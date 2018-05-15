import { AssetConstants } from "../constants/AssetConstants";
import Physics = Phaser.Physics;

export class Arrow extends Phaser.Sprite {

    private _game: Phaser.Game;
    private _damageValue = 5;

    constructor(game: Phaser.Game, x: number, y: number, id: string) {
        super(game, x, y, AssetConstants.Projectiles.Arrow);
        this._game = game;
        this.id = id;
        this._game.physics.enable(this, Physics.ARCADE);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.body.enable = true;
        this.body.allowGravity = false;
        // this.exists = false;
        // this.alive = false;
        this.body.allowRotation = false;
        this.anchor.set(0.5);
    }

    fire(game: Phaser.Game, speed: number, x: number, y: number) {
        // this.rotation = game.physics.arcade.moveToPointer(this, speed);
        this.rotation = game.physics.arcade.moveToXY(this, x, y, speed);
    }

    get damageValue(): number {
        return this._damageValue;
    }

    set damageValue(value: number) {
        this._damageValue = value;
    }
}