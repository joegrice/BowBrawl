import { Platform } from "../actors/Platform";
import { AssetConstants } from "../constants/AssetConstants";
import { exists } from "fs";


export class PlatformGenerator {

    /**
     * Creates platforms in a random fashion will ensure that platforms do not overlap
     * @param {number} width
     * @param {number} height
     * @param {Phaser.Game} game
     * @param {number} noPlatforms
     * @return {Phaser.Group}
     */
     static generateRandomPlatforms(width: number, height: number, game: Phaser.Game, noPlatforms = 5): Phaser.Group {
        const locArr: Phaser.Point[] = [];
        const group = game.add.physicsGroup();
        group.enableBody = true;
        group.physicsBodyType = Phaser.Physics.ARCADE;
        for (let i = 0; i <= noPlatforms; i++) {
            const point = new Phaser.Point(game.rnd.between(0, width), game.rnd.between(0, height));
            if (locArr.length === 0) {
                group.create(point.x, point.y, AssetConstants.Environment.Platform);
                locArr.push(point);
            } else {
                for (const p of locArr) {
                    if (!(p.x === point.x && p.y === point.y)) {
                        group.create(point.x, point.y, AssetConstants.Environment.Platform);
                        locArr.push(point);
                        break;
                    }
                }
            }
        }
        group.setAll("body.allowGravity", false);
        group.setAll("body.immovable", true);

        return group;
    }
}