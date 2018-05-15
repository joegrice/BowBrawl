import { AssetConstants } from "../constants/AssetConstants";

export class PlatformGenerator {

    private _game: Phaser.Game;
    private _group: Phaser.Group;
    private readonly _platformWidth = 256;
    private readonly _platformHeight = 64;
    private readonly _gapX: number;
    private readonly _gapY: number;
    private locArr: number[] = [];

    constructor(game: Phaser.Game, platforms: Phaser.Group) {
        this._game = game;
        this._group = platforms;
        this._gapX = game.width / this._platformWidth;
        this._gapY = game.height / this._platformHeight;
    }

    /**
     * Creates platforms in a random fashion will ensure that platforms do not overlap
     * @param {number} width Can be any given width doesnt need to represent game width
     * @param {number} height Can be any given height doesnt need to represent game height
     * @param {number} noPlatforms this will be trimmed to ensure no platforms overlap
     * @return {Phaser.Group}
     */
    generateRandomPlatforms(width: number, height: number, noPlatforms = 40): { platformLoc: string, platformGroup: Phaser.Group } {
        this._group.enableBody = true;
        this._group.physicsBodyType = Phaser.Physics.ARCADE;

        // Create random platforms
        for (let i = 0; i <= noPlatforms; i++) {
            this.createPlatformAtUniqueLoc();
        }

        // Check platforms can be reached
        this.reachableTest();
        // Remove overlapping at end so more aren't added after
        this.removeOverlappingPlatforms();


        const platformLocs: Phaser.Point[] = [];
        this._group.forEach((p: Phaser.Sprite) => {
            platformLocs.push(new Phaser.Point(p.x, p.y));
        }, this);
        this._group.setAll("body.allowGravity", false);
        this._group.setAll("body.immovable", true);
        return {platformLoc: JSON.stringify(platformLocs), platformGroup: this._group};
    }

    private generateRandomXY(): Phaser.Point {
        const x = Phaser.Math.snapTo(this._game.world.randomX, this._gapX);
        const y = Phaser.Math.snapTo(this._game.world.randomY, this._gapY);

        this.locArr.filter((s: number) => {
            if (Phaser.Math.difference(s, s + this._platformWidth + this._platformHeight) < this._platformWidth + this._platformHeight) {
                this.generateRandomXY();
            }
        });
        return new Phaser.Point(x, y);
    }

    private generateCoordinateXY(betweenPointStart?: Phaser.Point, betweenPointEnd?: Phaser.Point): Phaser.Point {
        const y = Phaser.Math.snapTo(Phaser.Math.between(betweenPointStart.y + this._platformHeight, betweenPointEnd.y), this._gapY);
        const x = Phaser.Math.snapTo(Phaser.Math.between(betweenPointStart.x + this._platformWidth, betweenPointEnd.x), this._gapX);
        this.locArr.filter((s: number) => {
            if (Phaser.Math.difference(s, s + this._platformHeight + this._platformHeight) < this._platformHeight + this._platformHeight) {
                this.generateCoordinateXY(betweenPointStart, betweenPointEnd);
            }
        });

        return new Phaser.Point(x, y);
    }

    private reachableTest(): void {
        let hasPassedReadabilityTest: boolean;

        for (let i = 0; i < this._group.length; i++) {
            hasPassedReadabilityTest = false; // for every instance of the foreach loop this must return true
            const sprite = this._group.getAt(i) as Phaser.Sprite;
            let closestSprite: Phaser.Sprite;

            this._group.remove(sprite);
            closestSprite = this._group.getClosestTo(sprite);

            if (closestSprite) {
                const distance = Phaser.Math.difference(sprite.y, closestSprite.y);
                if (distance > 400) {
                    this.createPlatformAtUniqueLoc(new Phaser.Point(sprite.x, sprite.y), new Phaser.Point(closestSprite.x, closestSprite.y));
                } else {
                    hasPassedReadabilityTest = true;
                }
                if (!hasPassedReadabilityTest) {
                    this.reachableTest();
                }
            }
            this._group.add(sprite);
        }
    }

    public removeOverlappingPlatforms(group?: Phaser.Group) {
        if (!group) {
            group = this._group;
        }
        if (this.remove(group)) this.removeOverlappingPlatforms();

    }

    private remove(group: Phaser.Group): boolean {
        group.forEach((p: Phaser.Sprite) => {
            group.forEach((s: Phaser.Sprite) => {
                if (this._game.physics.arcade.overlap(p, s)) {
                    s.destroy();
                    group.remove(s, true);
                    return true;
                }
            }, this);
        }, this);
        return false;
    }

    private createPlatformAtUniqueLoc(betweenPointStart?: Phaser.Point, betweenPointEnd?: Phaser.Point) {
        let index = 0;
        let point: Phaser.Point;

        do {
            if (betweenPointStart && betweenPointEnd) {
                point = this.generateCoordinateXY(betweenPointStart, betweenPointEnd);
            } else {
                point = this.generateRandomXY();
            }
            index = point.x + point.y;
        }
        while (!this.checkProximity(index)) ;
        this.locArr.push(index);
        this._group.create(point.x, point.y, AssetConstants.Environment.Platform);

    }

    private checkProximity(index: number): boolean {
        let pass = false;
        const platformIndex = this._platformWidth + this._platformHeight;
        this.locArr.filter((i: number) => {
            const platformDifference = Phaser.Math.difference(index, i + this._platformWidth + this._platformHeight);
            pass = platformDifference >= platformIndex;
        });
        if (this.locArr.length === 0) pass = true;
        return pass;
    }
}