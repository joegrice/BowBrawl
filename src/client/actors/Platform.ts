import { AssetConstants } from "../constants/AssetConstants";
import Physics = Phaser.Physics;

export class Platform extends Phaser.Sprite {

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, AssetConstants.Environment.Platform);

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.immovable = true;
        this.body.moves = false;
        this.body.enable = true;
    }
}