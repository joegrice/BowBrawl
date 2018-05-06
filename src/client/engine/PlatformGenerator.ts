import { AssetConstants } from "../constants/AssetConstants";
import { Platform } from "../actors/Platform";

class Location {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class PlatformGenerator {

    game: Phaser.Game;
    group: Phaser.Group;

    /**
     * Random Platform Generator
     */
    constructor(game: Phaser.Game, group: Phaser.Group) {
        this.game = game;
        this.group = group;
    }

    generatePlatforms() {
        const locations: Location[] = JSON.parse(this.game.cache.getText(AssetConstants.Resources.PlatformPositions));
        for (const location of locations) {
            const platform = new Platform(this.game, location.x, location.y);
            this.group.add(platform);
        }
    }
}