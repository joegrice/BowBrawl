import { AssetConstants } from "../constants/AssetConstants";

export class PlatformGenerator {

    private _game: Phaser.Game;
    private _group: Phaser.Group;
    private readonly _platformWidth = 256;
    private readonly _platformHeight = 64;
    private readonly _gapX: number;
    private readonly _gapY: number;
    private locArr: number[] = [];

    constructor(game: Phaser.Game) {
        this._game = game;
        this._group = game.add.physicsGroup();
        this._gapX = game.width / this._platformWidth;
        this._gapY = game.height / this._platformHeight;
    }

    /**
     * Creates platforms in a random fashion will ensure that platforms do not overlap
     * @param {number} width Can be any given width doesnt need to represent game width
     * @param {number} height Can be any given height doesnt need to represent game height
     * @param {number} noPlatforms
     * @return {Phaser.Group}
     */
    generateRandomPlatforms(width: number, height: number, noPlatforms = 5): Phaser.Group {
        this._group.enableBody = true;
        this._group.physicsBodyType = Phaser.Physics.ARCADE;

        // Ensure no platforms overlap and generate random platforms
        for (let i = 0; i <= noPlatforms; i++) {
            this.createPlatformAtUniqueLoc();
        }
        this.readabilityTest();
        this._group.setAll("body.allowGravity", false);
        this._group.setAll("body.immovable", true);


        return this._group;


        // Do check to ensure player can reachable platforms
        // First remove the platform we are checking from the list

    }

    private generateRandomXY(): Phaser.Point {
        const x = Phaser.Math.snapTo(this._game.world.randomX, this._gapX);
        const y = Phaser.Math.snapTo(this._game.world.randomY, this._gapY);

        return new Phaser.Point(x, y);
    }

    private generateCoordinateXY(betweenPointStart?: Phaser.Point, betweenPointEnd?: Phaser.Point): Phaser.Point {
        const y = Phaser.Math.snapTo(Phaser.Math.between(betweenPointStart.y + this._platformHeight, betweenPointEnd.y), this._gapY);
        const x = Phaser.Math.snapTo(Phaser.Math.between(betweenPointStart.x + this._platformWidth, betweenPointEnd.x), this._gapX);

        return new Phaser.Point(x, y);
    }

    private readabilityTest(): void {
        let hasPassedReadabilityTest: boolean;

        for (let i = 0; i < this._group.length; i++) {
            hasPassedReadabilityTest = false; // for every instance of the foreach loop this must return true
            const sprite = this._group.getAt(i) as Phaser.Sprite;
            let closestSprite: Phaser.Sprite;

            this._group.remove(sprite);
            closestSprite = this._group.getClosestTo(sprite);

            if (closestSprite) {
                const distance = Phaser.Math.difference(sprite.y, closestSprite.y);
                if (distance > 125) {
                    this.createPlatformAtUniqueLoc(new Phaser.Point(sprite.x, sprite.y), new Phaser.Point(closestSprite.x, closestSprite.y));
                } else {
                    hasPassedReadabilityTest = true;
                }
                if (!hasPassedReadabilityTest) {
                    this.readabilityTest();
                }
            }
            this._group.add(sprite);
        }
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
        this.locArr.forEach(i => {
            if (Phaser.Math.between(index, i + this._platformWidth + this._platformHeight)) {
                return false;
            }
            if (Phaser.Math.between(index, i - this._platformWidth + this._platformHeight)) {
                return false;
            }
        });
        return true;
    }
}