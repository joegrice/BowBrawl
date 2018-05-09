import { PlayerStates } from "../constants/PlayerStates";
import { Controls } from "../controlls/Controls";
import { AssetConstants } from "../constants/AssetConstants";
import Physics = Phaser.Physics;
import { Arrow } from "./Arrow";
import { PowerUpConfig } from "./PowerUpConfig";

export class Player extends Phaser.Sprite {
    private _playerState: Map<PlayerStates, boolean | number> = new Map<PlayerStates, boolean | number>();
    private _velocity = 300;
    private _controls: Controls;
    private _fireRate = 200;
    private _nextFire = 0;
    private _fireSpeed = 600;
    private _ammo: Phaser.Group;
    private _powerUpActive: boolean;

    constructor(game: Phaser.Game) {
        super(game, 100, 100, AssetConstants.Players.PinkyPlayer);
        // todo: Should later be moved to a factory? Or can this be considered a factory?
        this.initControls(game);
        this.id = "1"; // todo: Automate this later
        this.anchor.set(0.5, 0.5);
        this.name = "Random name";
        this._powerUpActive = false;
        this.addPhysicsToPlayer(game);
        this.addAmmo(game);
    }

    private initControls(game: Phaser.Game): void {
        this._controls = new Controls(game, this);
    }

    private addPhysicsToPlayer(game: Phaser.Game): void {
        game.physics.enable(this, Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.gravity.y = 800;
        this.body.angularDrag = 50;
        this.body.enable = true;
    }

    public updateView(): void {
        this.controls.update();
    }

    public fire(game: Phaser.Game) {
        if (game.time.now > this._nextFire && this._ammo.countDead() > 0) {
            this._nextFire = game.time.now + this._fireRate;
            const arrow: Arrow = this._ammo.getFirstDead();
            arrow.reset(this.x, this.y);
            arrow.fire(game, this._fireSpeed);
        }
    }

    public applyPowerUp(config: PowerUpConfig) {
        this._fireSpeed += config.fireSpeed;
        this._velocity += config.velocity;
        this.body.gravity.y -= config.gravity;
        this.health += config.health;
    }

    public pickupWeapon() {
        // todo: When user picks up new weapon
        throw new Error("Function not implemented");
    }

    // Setters and Getters
    get controls(): Controls {
        return this._controls;
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

    get powerUp(): boolean {
        return this._powerUpActive;
    }

    set powerUp(value: boolean) {
        this._powerUpActive = value;
    }

    private addAmmo(game: Phaser.Game) {
        this._ammo = game.add.group();
        this._ammo.classType = Arrow;
        for (let i = 0; i < 5; i++) {
            const arrow: Arrow = new Arrow(game, 0, 0);
            this._ammo.add(arrow);
        }
    }
}