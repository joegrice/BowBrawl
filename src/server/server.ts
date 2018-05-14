import { Events } from "../shared/Events";
import ServerEvents = Events.ServerEvents;
import { Socket } from "socket.io";
import PlayerEvents = Events.PlayerEvents;
import { setInterval } from "timers";
import GameEvents = Events.GameEvents;
import { PlayerModel } from "../shared/PlayerModel";
import { PowerUpConfig } from "../client/actors/PowerUpConfig";
import { SharedConstants } from "../shared/Constants";
import { EnumUtils } from "../shared/EnumUtils";
import { PowerUpModel } from "../shared/PowerUpModel";
import { Arrow } from "../client/actors/Arrow";
import { Player } from "../client/actors/Player";

const uuid = require("uuid");

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendfile(`./index.html`);
});

class GameServer {

    private _gameHasStarted = false;
    private powerUps: PowerUpModel[] = [];
    private platformLocations: string;
    private players: PlayerModel[];

    constructor() {
        this.socketEvents();
        this.players = [];
    }

    public connect(port): void {
        http.listen(port, () => {
            console.info(`Listening to port ${port}`);
        });
    }

    private socketEvents(): void {
        io.on(ServerEvents.connected, socket => {
            this.attachListeners(socket);
        });
    }

    private attachListeners(socket: Socket): void {
        this.addSignOnListener(socket);
        this.addMovementListener(socket);
        this.addSignOutListener(socket);
        this.addArrowFireListener(socket);
        this.addHitListener(socket);
        // this.addDeathListener(socket);
        this.addPickupListener(socket);
        this.addPowerUpListener(socket);
        this.addPlatformGenerationListener(socket);
        console.info("Listeners attached");

    }

    private addHitListener(socket) {
        socket.on(PlayerEvents.hit, (hit) => {
            const p = this.players.find(p => p.id === hit.playerId);
            p.health -= hit.damage;
            if (p.health > 0) {
                console.log("SERVER: PLAYER HIT, ID: " + hit.playerId);
                io.sockets.emit(PlayerEvents.hit, hit.playerId, hit.damage);
            } else if (p.health <= 0) {
                console.log("SERVER: PLAYER DIED, ID: " + hit.playerId);
                io.sockets.emit(PlayerEvents.death, hit.playerId);
            }
        });
    }

    /* private addDeathListener(socket) {
        socket.on(PlayerEvents.death, (player) => {
            console.log("SERVER: PLAYER DIED, ID:" + player.id);
            socket.broadcast.emit(PlayerEvents.death, player.id);
        });
    }*/

    private addArrowFireListener(socket) {
        socket.on(PlayerEvents.arrowfire, (coords) => {
            console.log("SERVER: ARROW FIRED BY: " + coords.playerId + " FROM X:" + coords.playerX + " Y:" + coords.playerY + ", TO: X:" + coords.mouseX + " Y: " + coords.mouseY);
            socket.broadcast.emit(PlayerEvents.arrowfire, coords.playerId, coords.playerX, coords.playerY, coords.mouseX, coords.mouseY);
        });
    }

    private gameInitialised(socket: Socket): void {
        // Start game on first user login
        if (!this._gameHasStarted) {
            this._gameHasStarted = true;
            this.makeRandomCoordinatesDrop(socket, 5000);
        }
    }

    private makeRandomCoordinatesDrop(socket, interval: number) {
        setInterval(() => {
            if (this.powerUps.length < 2) {
                const coordinates = this.generateCoordinates();
                io.sockets.emit(GameEvents.drop, coordinates);
                this.powerUps.push({x: coordinates.x, y: coordinates.y, name: coordinates.powerUp});
            }
        }, interval);

    }

    private createPlayer(socket, player: PlayerModel, windowSize: { x, y }): void {
        const playerModel: PlayerModel = {
            name: player.name,
            id: uuid(),
            ammo: 3,
            x: this.randomInt(0, windowSize.x),
            y: this.randomInt(0, windowSize.y),
            health: 10
        };
        socket.player = playerModel;
        this.players.push(playerModel);
    }

    private addSignOnListener(socket) {
        socket.on(GameEvents.authentication, (player, gameSize) => {
            socket.emit(PlayerEvents.players, this.getAllPlayers());
            this.createPlayer(socket, player, gameSize);
            socket.emit(PlayerEvents.protagonist, socket.player, this._gameHasStarted, this.platformLocations ? this.platformLocations : undefined);
            socket.broadcast.emit(PlayerEvents.joined, socket.player, this.powerUps);
            this.gameInitialised(socket);
        });
    }

    private addMovementListener(socket) {
        socket.on(PlayerEvents.coordinates, (coors) => {
            socket.broadcast.emit(PlayerEvents.coordinates, {
                coors: coors,
                player: socket.player
            });
        });
    }

    private addPowerUpListener(socket) {
        // Player collects power up item
        socket.on(PlayerEvents.powerup, (player: PlayerModel) => {
            socket.player.activePowerUp = player.activePowerUp;
            console.info(socket.player.activePowerUp);
            socket.broadcast.emit(PlayerEvents.powerup, player.id, player.activePowerUp);
        });
    }

    private addSignOutListener(socket) {
        socket.on(ServerEvents.discconected, () => {
            if (socket.player) {
                socket.broadcast.emit(PlayerEvents.quit, socket.player.id);
            }
        });
    }

    private addPickupListener(socket) {
        // Player picks up item
        socket.on(PlayerEvents.pickup, (player) => {
            socket.player.ammo = player.ammo;
            socket.broadcast.emit(PlayerEvents.pickup, player.id);
        });
    }

    /* private get players(): number {
        return Object.keys(io.sockets.connected).length;
    }*/

    private generateCoordinates(): { x: number, y: number, powerUp: string } {
        return {
            x: Math.floor(Math.random() * 1024) + 1,
            y: Math.floor(Math.random() * 768) + 1,
            powerUp: EnumUtils.RandomEnum()
        };
    }

    /**
     * A method for getting all the players
     * @return {PlayerModel[]} All the players active
     */
    private getAllPlayers(): PlayerModel[] {
        const players = [];
        Object.keys(io.sockets.connected).map((socketId) => {
            const player = io.sockets.connected[ socketId ].player;
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

    private addPlatformGenerationListener(socket) {
        socket.on(GameEvents.platformsCreated, (platLocs) => {
            this.platformLocations = platLocs;
        });
    }
}

const gameSession = new GameServer();
gameSession.connect(3000);

