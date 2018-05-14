import { AssetConstants } from "../constants/AssetConstants";

export class BrawlGame extends Phaser.State {

    constructor() {
        super();
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

    create(): void {
        this.game.state.start("GameState");
    }
}
