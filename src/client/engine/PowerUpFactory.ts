import { PowerUpConfig } from "../actors/PowerUpConfig";
import { AssetConstants } from "../constants/AssetConstants";
import { PowerUp } from "../actors/PowerUp";
import { Platform } from "../actors/Platform";
import { Location } from "../actors/Location";

export class PowerUpFactory {

    private readonly _game: Phaser.Game;
    private readonly _platforms: Phaser.Group;
    private readonly powerUpConfigs: PowerUpConfig[];

    constructor(game: Phaser.Game, platforms: Phaser.Group) {
        this._game = game;
        this._platforms = platforms;
        this.powerUpConfigs = JSON.parse(game.cache.getText(AssetConstants.Resources.PowerUpConfigs));
    }

    placePowerUp(name: string): PowerUp {
        const powerUpConfig: PowerUpConfig = this.getConfigByName(name);
        const powerUpSprite: PowerUp = new PowerUp(this._game, 0, 0, powerUpConfig);
        const location: Location = this.getRandomValidLocation(powerUpSprite);
        powerUpSprite.reset(location.x, location.y);
        return powerUpSprite;
    }

    getConfigByName(name: string): PowerUpConfig {
        let savedConfig: PowerUpConfig;
        for (const config of this.powerUpConfigs) {
            if (config.name === name) {
                savedConfig = config;
                break;
            }
        }
        return savedConfig;
    }

    getRandomValidLocation(sprite: Phaser.Sprite): Location {
        const platform: Platform = this._platforms.getRandom(0, this._platforms.length - 1);
        const x: number = this._game.rnd.integerInRange(platform.x + sprite.width, platform.width - sprite.width);
        const y: number = platform.y - (5 + sprite.height);
        return new Location(x, y);
    }
}