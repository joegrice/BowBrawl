import { Platform } from "../actors/Platform";
import { AssetConstants } from "../constants/AssetConstants";
import { exists } from "fs";


export class PlatformGenerator {

    private _game: Phaser.Game;
    private _group: Phaser.Group;
    private readonly _platforWidth = 256;
    private readonly _platformHeight = 64;

    constructor(game: Phaser.Game) {
        this._game = game;
        this._group = game.add.physicsGroup();
    }

    /**
     * Creates platforms in a random fashion will ensure that platforms do not overlap
     * @param {number} width Can be any given width doesnt need to represent game width
     * @param {number} height Can be any given height doesnt need to represent game height
     * @param {number} noPlatforms
     * @return {Phaser.Group}
     */
    generateRandomPlatforms(width: number, height: number, noPlatforms = 5): Phaser.Group {
        const locArr: Phaser.Point[] = [];
        this._group.enableBody = true;
        this._group.physicsBodyType = Phaser.Physics.ARCADE;
        for (let i = 0; i <= noPlatforms; i++) {
            const point = new Phaser.Point(this._game.rnd.between(0, width), this._game.rnd.between(0, height));
            if (locArr.length === 0) {
                this._group.create(point.x, point.y, AssetConstants.Environment.Platform);
                locArr.push(point);
            } else {
                this.generateNextPlatform(point);
                locArr.push(point);

            }
        }
        this._group.setAll("body.allowGravity", false);
        this._group.setAll("body.immovable", true);

        return this._group;
    }

    private generateNextPlatform(point: Phaser.Point) {
        let nextWidth = 0;
        let nextHeight = 0;

        // ensure platform not to far away
        ensurePlayerCanReach(this);
        // check out of bounds
        checkOutOfBounds(this);
        this._group.create(point.x, point.y, AssetConstants.Environment.Platform);
        function ensurePlayerCanReach(self: PlatformGenerator) {
            if (self._game.rnd.integerInRange(0, 1) === 1) {
                nextHeight = point.y - self._platformHeight;
                nextWidth = point.x - self._platforWidth;
            } else {
                nextHeight = point.y + self._platformHeight;
                nextWidth = point.x + self._platforWidth;
            }
        }

        function checkOutOfBounds(self: PlatformGenerator) {
            if (point.x - self._platforWidth < 0) {
                nextWidth = point.x + self._platforWidth;
            }
            if (point.y - self._platformHeight < 0) {
                nextHeight = point.y + self._platformHeight;
            }
            if (point.x + self._platforWidth > self._game.width) {
                nextWidth = point.x - self._platforWidth;
            }
            if (point.y + self._platformHeight) {
                nextHeight = point.y + self._platformHeight;
            }
        }

    }
}