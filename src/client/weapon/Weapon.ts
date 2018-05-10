import { AssetConstants } from "../constants/AssetConstants";

export class Weapon {
    private _weapon: Phaser.Weapon;
    private _arrowCount: number;
    private _pickup;
    private _player: Phaser.Sprite;
    private _game: Phaser.Game;

    constructor(game: Phaser.Game, player?: Phaser.Sprite) {
        this._game = game;
        this._weapon = game.add.weapon(this._arrowCount, AssetConstants.Projectiles.Arrow);
        this._weapon.fireLimit = this._arrowCount;
        this._weapon.fireRate = 1000;
        if (player) {
            this._player = player;
            this._weapon.trackedSprite(this._player, 10, 0, true);
        }
    }

    public fireWeapon() {
        this._weapon.fire();
        this._arrowCount--;
    }

    get weapon(): Phaser.Weapon {
        return this._weapon;
    }

    set weapon(value: Phaser.Weapon) {
        this._weapon = value;
    }

    get arrowCount(): number {
        return this._arrowCount;
    }

    set arrowCount(value: number) {
        this._arrowCount = value;
    }

    get pickup() {
        return this._pickup;
    }

    set pickup(value) {
        this._pickup = value;
    }
}