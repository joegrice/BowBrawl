import { PhaserLifecycle } from "./PhaserLifecycle";
import { Game } from "../Game";
import { AssetConstants } from "../constants/AssetConstants";

export class BrawlGame extends Game implements PhaserLifecycle {
    private game: Phaser.Game;

    constructor() {
        super();
        this.game = new Phaser.Game(1024, 768, Phaser.AUTO, "BowBrawl", {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    create(): void {
        super.properties(this.game);
        super.manageAssets(this.game);
    }

    preload(): void {
        const game = this.game.load;
        game.crossOrigin = "anonymous";
        game.image(AssetConstants.Players.PinkyPlayer, "assets/players/pinky.png");
        game.image(AssetConstants.Backgrounds.BackgroundNight, "assets/backgroundNight.png");
        game.image(AssetConstants.Environment.Platform, "assets/platform.png");
        game.image(AssetConstants.PowerUps.FireSpeedBoost, "assets/power_ups/" + AssetConstants.PowerUps.FireSpeedBoost + ".png");
        game.image(AssetConstants.PowerUps.MovementSpeedBoost, "assets/power_ups/" + AssetConstants.PowerUps.MovementSpeedBoost + ".png");
        game.image(AssetConstants.Projectiles.Arrow, "assets/" + AssetConstants.Projectiles.Arrow);
        game.text(AssetConstants.Resources.PlatformPositions, "resources/" + AssetConstants.Resources.PlatformPositions);
        game.text(AssetConstants.Resources.PowerUpConfigs, "resources/" + AssetConstants.Resources.PowerUpConfigs);
    }

    update(): void {
        super.gameUpdate(this.game);
    }
}
