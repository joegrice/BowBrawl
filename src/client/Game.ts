import { Player } from "./actors/Player";
import { AssetConstants } from "./constants/AssetConstants";
declare const window: Window;

export class Game {
    private players: Player[] = [];
    private player: Player;

    /**
     * @desc To be used for attaching listeners
     * @param game instance of game
     */
    protected manageAssets(game: Phaser.Game): void {
        this.player = new Player(game);
    }

    protected gameUpdate(game: Phaser.Game): void {
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
