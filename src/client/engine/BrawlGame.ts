import { PhaserLifecycle } from "./PhaserLifecycle";
import { Game } from "../Game";
import { AssetConstants } from "../constants/AssetConstants";

export class BrawlGame extends Game implements PhaserLifecycle {
    protected game: Phaser.Game;
    constructor() {
        super();
        this.game = new Phaser.Game(1024, 768, Phaser.AUTO, "BowBrawl", {
            preload: this.preload(),
            create: this.create(),
            update: this.update()
        });
    }

    create(): void {
        super.properties(this.game);
        super.manageAssets(this.game);
    }

    preload(): void {
        const game = this.game.load;
        game.crossOrigin = "anonymous";
        game.image(AssetConstants.BackgroundNight, "assets/backgroundNight.png");
    }

    update(): void {
        super.gameUpdate(this.game);
    }
}
