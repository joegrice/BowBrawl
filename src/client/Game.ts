import { Player } from "./actors/Player";
import { AssetConstants } from "./constants/AssetConstants";
import { PlatformGenerator } from "./engine/PlatformGenerator";
import { PowerUpFactory } from "./engine/PowerUpFactory";
import { PowerUp } from "./actors/PowerUp";
import { Platform } from "./actors/Platform";

export class Game {
    private players: Phaser.Group;
    private player: Player;
    private platforms: Phaser.Group;
    private powerUps: Phaser.Group;

    /**
     * @desc To be used for attaching listeners
     * @param game instance of game
     */
    protected manageAssets(game: Phaser.Game): void {
        this.players = game.add.group();
        this.players.classType = Player;
        this.player = game.add.existing(new Player(game));
        this.players.add(this.player);

        this.platforms = game.add.group();
        this.platforms.classType = Platform;
        const platformGenerator = new PlatformGenerator(game, this.platforms);
        platformGenerator.generatePlatforms();

        this.powerUps = game.add.group();
        const powerUpFactory = new PowerUpFactory(game, this.platforms);
        this.powerUps.add(powerUpFactory.placePowerUp(AssetConstants.PowerUps.MovementSpeedBoost));
        this.powerUps.add(powerUpFactory.placePowerUp(AssetConstants.PowerUps.FireSpeedBoost));
    }

    protected gameUpdate(game: Phaser.Game): void {
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.overlap(this.players, this.powerUps, (player: Player, powerUp: PowerUp) => {
            player.applyPowerUp(powerUp.getConfig);
            powerUp.kill();
        }, undefined, this);

        if (this.player && this.player.controls) {
            this.player.updateView();
        }
    }

    protected properties(game: Phaser.Game): void {
        game.stage.disableVisibilityChange = true;
        game.time.desiredFps = 60;

        // Background set
        game.add.tileSprite(0, 0, game.width, game.height, AssetConstants.Backgrounds.BackgroundNight);
        game.add.sprite(0, 0, AssetConstants.Backgrounds.BackgroundNight);

        game.renderer.clearBeforeRender = false;
        game.physics.startSystem(Phaser.Physics.ARCADE);
    }
}
