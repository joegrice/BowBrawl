import { PlayerStates } from "../constants/PlayerStates";
import { Controls } from "../controlls/Controls";
import { AssetConstants } from "../constants/AssetConstants";
import Physics = Phaser.Physics;
import { Arrow } from "./Arrow";

export class Player {
    private _sprite: Phaser.Sprite;
    private _playerState: Map<PlayerStates, boolean | number> = new Map<PlayerStates, boolean | number>();
    private _velocity = 300;
    private _controls: Controls;
    private _fireRate = 200;
    private _nextFire = 0;
    private _ammo: Phaser.Group;

    constructor(private gameInstance: Phaser.Game, private playerInstance?: Player) {
        this.generatePlayer(gameInstance);
    }

    public generatePlayer(game: Phaser.Game) {
        // todo: Should later be moved to a factory? Or can this be considered a factory?
        this.initControls();
        this.sprite = this.gameInstance.add.sprite(100, 100, AssetConstants.Players.PinkyPlayer);
        this.sprite.id = "1"; // todo: Automate this later
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.name = "Random name";
        this.addPhysicsToPlayer(game);
        this.addAmmo();
    }

    private initControls(): void {
        this._controls = new Controls(this.gameInstance, this);
    }

    private addPhysicsToPlayer(game: Phaser.Game): void {
        game.physics.enable(this.sprite, Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.gravity.y = 800;
        this.sprite.body.angularDrag = 50;
        this.sprite.body.enable = true;
    }

    public updateView(): void {
        this.controls.update();
    }

    public fire() {
        if (this.gameInstance.time.now > this._nextFire && this._ammo.countDead() > 0) {
            this._nextFire = this.gameInstance.time.now + this._fireRate;
            const arrow: Arrow = this._ammo.getFirstDead();
            arrow.reset(this.sprite.x, this.sprite.y);
            arrow.updateArrow(this.gameInstance);
        }
    }

    public pickupWeapon() {
        // todo: When user picks up new weapon
        throw new Error("Function not implemented");
    }

    // Setters and Getters
    get controls(): Controls {
        return this._controls;
    }

    get sprite(): Phaser.Sprite {
        return this._sprite;
    }

    set sprite(value: Phaser.Sprite) {
        this._sprite = value;
    }

    get playerState(): Map<PlayerStates, boolean | number> {
        return this._playerState;
    }

    set playerState(value: Map<PlayerStates, boolean | number>) {
        this._playerState = value;
    }

    get velocity(): number {
        return this._velocity;
    }

    set velocity(value: number) {
        this._velocity = value;
    }

    private addAmmo() {
        this._ammo = this.gameInstance.add.group();
        this._ammo.classType = Arrow;
        for (let i = 0; i < 5; i++) {
            const arrow: Arrow = new Arrow(this.gameInstance, 0, 0);
            this._ammo.add(arrow);
        }
    }
}