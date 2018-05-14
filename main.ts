import { BrawlGame } from "./src/client/engine/BrawlGame";
import { RoundOver } from "./src/client/engine/RoundOver";
import { Game } from "./src/client/Game";

class GameMain extends Phaser.Game {

    constructor() {

        super(1024, 768, Phaser.AUTO, "BowBrawl");

        this.state.add("Preload", BrawlGame, false);
        this.state.add("GameState", Game, false);
        this.state.add("RoundOver", RoundOver, false);
        this.state.start("Preload");
    }
}

new GameMain();