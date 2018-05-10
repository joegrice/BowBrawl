import { Events } from "../shared/Events";
import ServerEvents = Events.ServerEvents;
import { Socket } from "socket.io";
import PlayerEvents = Events.PlayerEvents;
import { setInterval } from "timers";
import GameEvents = Events.GameEvents;
import { PlayerModel } from "../shared/PlayerModel";

const uuid = require("uuid");

const express = require("express");
const app = express();
const http = require("http").Server(app);
const IO = require("socket.io")(http);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendfile(`./index.html`);
});

class GameServer {

    private _dirtyFlag = false;

    constructor() {
        this.socketEvents();
    }

    public connect(port): void {
        http.listen(port, () => {
            console.info(`Listening to port ${port}`);
        });
    }

    private socketEvents(): void {
        IO.on(ServerEvents.connected, socket => {
            this.attachListeners(socket);
        });
    }

    private attachListeners(socket: Socket): void {
        this.addSignOnListener(socket);
        this.addMovementListener(socket);
        this.addSignOutListener(socket);
        this.addHitListener(socket);
        this.addPickupListener(socket);
    }

    private createPlayer(socket, player: PlayerModel, windowSize: { x, y }): void {
        socket.player = {
            name: player.name,
            id: uuid(),
            ammo: 0,
            x: this.randomInt(0, windowSize.x),
            y: this.randomInt(0, windowSize.y)
        };
    }

    private addSignOnListener(socket) {
        socket.on(GameEvents.authentication, (player, gameSize) => {
            socket.emit(PlayerEvents.players, this.getAllPlayers());
            socket.emit(PlayerEvents.protagonist, socket.player);
            socket.broadcast.emit(PlayerEvents.joined, socket.player);
        });
    }

    private addMovementListener(socket) {
        socket.on(PlayerEvents.coordinates, (coors) => {
            socket.broadcast.emit(PlayerEvents.coordinates, {
                coors,
                player: socket.player
            });
        });
    }

    private addSignOutListener(socket) {
        socket.on(ServerEvents.discconected, () => {
            if (socket.player) {
                socket.broadcast.emit(PlayerEvents.quit, socket.player.id);
            }
        });
    }

    private addHitListener(socket: Socket) {
        socket.on(PlayerEvents.hit, (playerId) => {
            socket.broadcast.emit(PlayerEvents.hit, playerId);
        });
    }

    private addPickupListener(socket) {
        // Player picks up item
        socket.on(PlayerEvents.pickup, (player) => {
            socket.player.ammo = player.ammo;
            socket.broadcast.emit(PlayerEvents.pickup, player.uuid);
        });
    }

    private gameInitialised(socket: Socket): void {
        // Start game on first user login
        if (!this._dirtyFlag) {
            this._dirtyFlag = true;
        }
        // Interval for arrow spawning
        setInterval(() => {
            const coordinates = {
                x: Math.floor(Math.random() * 1024) + 1,
                y: Math.floor(Math.random() * 768) + 1
            };
            socket.emit(GameEvents.drop, coordinates);
            socket.broadcast.emit(GameEvents.drop, coordinates);
        }, 10000);
    }
    private get players(): number {
        return Object.keys(IO.sockets.connected).length;
    }

    /**
     * A method for getting all the players
     * @return {PlayerModel[]} All the players active
     */
    private getAllPlayers(): PlayerModel[] {
        const players = [];
        Object.keys(IO.sockets.connected).map((socketId) => {
           const player = IO.sockets.connected[socketId].player;
           if (player) {
               players.push(player);
           }
        });
        return players;
    }

    /**
     * Generate random coordinates
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    private randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

const gameSession = new GameServer();
gameSession.connect(3000);

