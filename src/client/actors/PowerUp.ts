export class PowerUp extends Phaser.Sprite {

    constructor(game: Phaser.Game, x: number, y: number, name: string) {
        super(game, x, y, name);

        this.game.physics.arcade.enable(this);
        this.body.enable = true;
        this.body.collideWorldBounds = true;
        this.body.gravity.y = 800;
    }
}