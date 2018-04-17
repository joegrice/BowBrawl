import * as Phaser from "phaser-ce";
import * as socket from "socket.io";

class GameMain extends Phaser.Game {

    socket: socket.Client;

    constructor() {
        let widthTiles: number = 12;
        let heightTiles: number = 8;
        let tileSize: number = 64;
        super(widthTiles * tileSize, heightTiles * tileSize, Phaser.AUTO, "content");



        this.state.add("Main", Main, false);
        this.state.start("Main");
    }

    create(): void {
        socket.on("connect", this.onSocketConnected);
    }

    onSocketConnected(): void {
        console.log("connected to server");
    }
}

window.onload = () => {
    var game: GameMain = new GameMain();
};