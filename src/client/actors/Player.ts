import { PlayerStates } from "../constants/PlayerStates";

export class Player {
    private _sprite: Phaser.Sprite;
    private _projectile: Projectile;
    private _playerState: Map<PlayerStates, boolean | number> = new Map<PlayerStates, boolean|number>();
    private _velocity = 300;

    constructor(private gameInstance: Phaser.Game, private playerInstance: Player) {
        //
    }

    get sprite(): Phaser.Sprite {
        return this._sprite;
    }

    set sprite(value: Phaser.Sprite) {
        this._sprite = value;
    }

    get projectile(): Projectile {
        return this._projectile;
    }

    set projectile(value: Projectile) {
        this._projectile = value;
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
}