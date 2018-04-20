import { Player } from "./actors/Player";
import { AssetConstants } from "./constants/AssetConstants";

export class Game {
    private actors: Player[];
    private actor: Player;

    protected manageAssets(game: Phaser.Game): void {
        throw new Error("Not Implemented");
    }

    protected gameUpdate(game: Phaser.Game): void {
        throw new Error("Not Implemented");
    }

    protected properties(game: Phaser.Game): void {
        game.stage.disableVisibilityChange = true;
        game.time.desiredFps = 60;

        // Background set
        game.add.tileSprite(0, 0, game.width, game.height, AssetConstants.BackgroundNight);
        game.add.sprite(0, 0, AssetConstants.BackgroundNight);

        game.renderer.clearBeforeRender = false;
        game.physics.startSystem(Phaser.Physics.ARCADE);
    }
}
