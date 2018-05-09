import { AssetConstants } from "../constants/AssetConstants";
import Physics = Phaser.Physics;

export class Arrow extends Phaser.Sprite {

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, AssetConstants.Projectiles.Arrow);

        this.game = game;

        this.game.physics.enable(this, Physics.ARCADE);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.body.enable = true;
        this.exists = false;
        this.alive = false;
        this.body.allowRotation = false;
        this.anchor.set(0.5);
    }

    fire(game: Phaser.Game, speed: number) {
        this.rotation = game.physics.arcade.moveToPointer(this, speed);
    }
}