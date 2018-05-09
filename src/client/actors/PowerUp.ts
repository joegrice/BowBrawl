import Physics = Phaser.Physics;
import { PowerUpConfig } from "./PowerUpConfig";

export class PowerUp extends Phaser.Sprite {

    private readonly config: PowerUpConfig;

    constructor(game: Phaser.Game, x: number, y: number, config: PowerUpConfig) {
        super(game, x, y, config.name);
        this.config = config;

        this.game.physics.enable(this, Physics.ARCADE);
        // this.outOfBoundsKill = true;
        this.body.enable = true;
        // this.anchor.set(0.5);
    }

    get getConfig(): PowerUpConfig {
        return this.config;
    }
}