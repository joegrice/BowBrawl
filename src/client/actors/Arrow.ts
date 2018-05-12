import { AssetConstants } from "../constants/AssetConstants";
import Physics = Phaser.Physics;

export class Arrow {

    private _sprite: Phaser.Sprite;
    private _game: Phaser.Game;

    constructor(game: Phaser.Game, x: number, y: number) {
        this._game = game;

        this._sprite = this.createSprite(x, y);
    }

    createSprite(x: number, y: number): Phaser.Sprite {
        const sprite = this._game.add.sprite(x, y, AssetConstants.Projectiles.Arrow);
        this._game.physics.enable(sprite, Physics.ARCADE);
        sprite.checkWorldBounds = true;
        sprite.outOfBoundsKill = true;
        sprite.body.enable = true;
        sprite.exists = false;
        sprite.alive = false;
        sprite.body.allowRotation = false;
        sprite.anchor.set(0.5);
        return sprite;
    }

    fire(game: Phaser.Game, speed: number) {
        this._sprite.rotation = game.physics.arcade.moveToPointer(this, speed);
    }
}