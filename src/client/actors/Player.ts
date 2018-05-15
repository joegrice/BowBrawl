import { PlayerStates } from "../constants/PlayerStates";
import { Controls } from "../controlls/Controls";
import Physics = Phaser.Physics;
import { Hud } from "../UI/Hud";
import { Weapon } from "../weapon/Weapon";
import { AssetConstants } from "../constants/AssetConstants";
import { PlayerModel } from "../../shared/PlayerModel";
import { PowerUpConfig } from "../../shared/PowerUpConfig";
import { SharedConstants } from "../../shared/Constants";
import { debug } from "util";

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
    private _ammo = 3;
    private _fireRate = 200;
    /**
     * ONLY FOR DEBUG
     * DO NOT USE
     * @type {number}
     */
    private static pcount = 0;
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

    public applyUp(config: PowerUpConfig) {
        this._fireSpeed += config.fireSpeed;
        this._velocity += config.velocity;
        this._player.body.gravity.y -= config.gravity;
        this._player.health += config.health;
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

    get ammo(): number {
        return this._ammo;
    }

    set ammo(value: number) {
        this._ammo = value;
    }

    get fireSpeed(): number {
        return this._fireSpeed;
    }

    set fireSpeed(value: number) {
        this._fireSpeed = value;
    }

    get hud(): Hud {
        return this._hud;
    }

    public firedArrow() {
        this._ammo -= 1;
        this._hud.updateAmmo(this._ammo);
    }

    public hit(damage: number) {
        this.player.damage(damage);
        this._hud.updateHealth(this.player.health);
    }

    public death() {
        this.player.alive = false;
        this.player.exists = false;
        this.player.visible = false;
        this.player.kill();
        this.player.destroy(true);
    }

    private createPlayer(game: Phaser.Game, type: any) {
        this._hud = new Hud();
        this.initControls();
        this.player = game.add.sprite(this.playerInstance.x, this.playerInstance.y, type);
        this.player.id = this.playerInstance.id;
        this.player.health = 10;
        this.player.anchor.set(0.5, 0.5);
        // add animations
        this.player.name = this.playerInstance.name;
        this.addPhysicsToPlayer(game);
        // this.addAmmo(game);
        this._hud.setName(game, this.player);
        this._hud.setAmmo(game, this.player, this._ammo);
        this._hud.setHealth(game, this.player);
        this.player.scale.set(1.5);
    }
}