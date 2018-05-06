import { Player } from "./actors/Player";
import { AssetConstants } from "./constants/AssetConstants";
import { PlatformGenerator } from "./engine/PlatformGenerator";

export class Game {
    private players: Player[] = [];
    private player: Player;
    private platforms: Phaser.Group;

    /**
     * @desc To be used for attaching listeners
     * @param game instance of game
     */
    protected manageAssets(game: Phaser.Game): void {
        this.player = new Player(game);

        this.platforms = game.add.group();
        const platformGenerator = new PlatformGenerator(game, this.platforms);
        platformGenerator.generatePlatforms();
    }

    protected gameUpdate(game: Phaser.Game): void {
        game.physics.arcade.collide(this.player.sprite, this.platforms);

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
