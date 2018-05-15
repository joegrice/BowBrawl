import { PhaserLifecycle } from "./PhaserLifecycle";
import { Game } from "../Game";
import { Events } from "../../shared/Events";
import GameEvents = Events.GameEvents;
import PlayerEvents = Events.PlayerEvents;
import { Player } from "../actors/Player";
import { AssetConstants } from "../constants/AssetConstants";
import { PlayerModel } from "../../shared/PlayerModel";

declare const window: any; // This is necessary to get socket events!
export class RoundOver extends Phaser.State implements PhaserLifecycle {

    private _player: Player;
    private _players: PlayerModel[];
    private playersReadyText: Phaser.Text;

    constructor() {
        super();
    }

    init(player: Player, players: PlayerModel[]): void {
        this._player = player;
        this._players = players;
    }

    preload(): void {
        this.game.load.image(AssetConstants.Environment.Platform, "assets/platform.png");
    }

    create(): void {
        window.socket.on(GameEvents.allplayersready, () => {
            this.game.state.start("GameState", true, false, this._player.playerInstance.name);
        });

        window.socket.on(PlayerEvents.ready, (ready: number, totalPlayers: number) => {
            if (this.playersReadyText === undefined) {
                this.playersReadyText = this.game.add.text(this.game.world.centerX - 125, this.game.world.centerY + 150,
                    ready + "/" + totalPlayers + " players ready...", {
                        font: "25px Arial",
                        fill: "#ffffff"
                    });
            } else {
                this.playersReadyText.setText(ready + "/" + totalPlayers + " players ready...");
            }
        });

        this.game.add.text(this.game.world.centerX - 125, this.game.world.centerY - 230, "ROUND OVER", {
            font: "25px Arial",
            fill: "#ffffff"
        });

        let distance = 30;
        this._players.map(player => {
            console.log(this._players);
            console.log(player);
            console.log(player.score);
            this.game.add.text(this.game.world.centerX - 125, this.game.world.centerY - 200 + distance, "Name: " + player.name + "    Score: " + player.score, {
                font: "25px Arial",
                fill: "#ffffff"
            });
            distance += 30;
        });

        const btn: Phaser.Sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, AssetConstants.Environment.Platform);
        btn.anchor.set(0.5);
        btn.inputEnabled = true;
        btn.events.onInputDown.add(this.newRound, this);
    }

    update(): void {
        // TODO: Add Update()
    }

    newRound(): void {
        if (!this._player.playerInstance.ready) {
            window.socket.emit(PlayerEvents.ready, {
                playerId: this._player.player.id
            });
            this._player.playerInstance.ready = true;
        }

    }
}
