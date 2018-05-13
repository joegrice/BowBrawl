import { PlayerStates } from "../constants/PlayerStates";
import { Controls } from "../controlls/Controls";
import Physics = Phaser.Physics;
import { Hud } from "../UI/Hud";
import { Weapon } from "../weapon/Weapon";
import { AssetConstants } from "../constants/AssetConstants";
import { PlayerModel } from "../../shared/PlayerModel";
import { PowerUpConfig } from "./PowerUpConfig";
import { Arrow } from "./Arrow";

export class Player {
    // Sprite should be variable of player in order to provide an interface to pass to server
    private _player: Phaser.Sprite;
    private _playerState: Map<PlayerStates, boolean | number>;
    private _velocity = 600;
    private _controls: Controls;
    private _hud: Hud;
    private _weapon: Weapon;
    private _fireSpeed = 600;
    private _nextFire = 0;
    private _ammo: Phaser.Group;
    private _fireRate = 200;
    // Power ups should be indicated in states?
    // private _powerUpActive: boolean;

    constructor(private game: Phaser.Game, public playerInstance: PlayerModel, type: AssetConstants.Players) {
        this.createPlayer(this.game, type);
        this._playerState = new Map<PlayerStates, boolean | number>();
    }

    private initControls(): void {
        this._controls = new Controls(this.game, this);
    }

    private addPhysicsToPlayer(game: Phaser.Game): void {
        game.physics.enable(this._player, Physics.ARCADE);
        this.player.body.enable = true;
        this._player.body.collideWorldBounds = true;
        this._player.body.gravity.y = 800;
        this._player.body.angularDrag = 50;
        this._player.body.immovable = false;
    }

    public updateView(): void {
        this.controls.update();
    }

    public fire(game: Phaser.Game) {
        if (game.time.now > this._nextFire && this._ammo.length > 0) {
            this._nextFire = game.time.now + this._fireRate;
            const arrow = this._ammo.getFirstDead();
            if (arrow !== null) {
                arrow.reset(this._player.x, this._player.y);
                arrow.fire(game, this._fireSpeed);
            }
        }
    }

    public applyPowerUp(config: PowerUpConfig) {
        this._fireSpeed += config.fireSpeed;
        this._velocity += config.velocity;
        this._player.body.gravity.y -= config.gravity;
        this._player.health += config.health;
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

    get player(): Phaser.Sprite {
        return this._player;
    }

    set player(value: Phaser.Sprite) {
        this._player = value;
    }

    get ammo(): Phaser.Group {
        return this._ammo;
    }

    set ammo(value: Phaser.Group) {
        this._ammo = value;
    }

    private addAmmo(game: Phaser.Game) {
        this._ammo = game.add.group();
        this._ammo.classType = Arrow;
        for (let i = 0; i < 5; i++) {
            const arrow: Arrow = new Arrow(game, 0, 0);
            this._ammo.add(arrow);
        }
    }

    private createPlayer(game: Phaser.Game, type: any) {
        this._hud = new Hud();
        this.initControls();
        console.log(this.playerInstance);
        this.player = game.add.sprite(this.playerInstance.x, this.playerInstance.y, type);
        this.player.id = this.playerInstance.id;
        this.player.anchor.set(0.5, 0.5);
        // add animations
        this.player.name = this.playerInstance.name;
        this.addPhysicsToPlayer(game);
        this._hud.setName(game, this.player);
        this.player.scale.set(1.5);
        this.addAmmo(game);
    }
}