import { AssetConstants } from "../constants/AssetConstants";
import Physics = Phaser.Physics;
import { Events } from "../../shared/Events";
import PlayerEvents = Events.PlayerEvents;

declare const window: any; // This is necessary to get socket events!

export class Arrow extends Phaser.Sprite {

    private _game: Phaser.Game;
    private readonly _playerId: number;

    constructor(game: Phaser.Game, x: number, y: number, playerid: number) {
        super(game, x, y, AssetConstants.Projectiles.Arrow);
        this._game = game;
        this._playerId = playerid;
        this._game.physics.enable(this, Physics.ARCADE);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.body.enable = true;
        this.body.allowGravity = false;
        this.exists = false;
        this.alive = false;
        this.body.allowRotation = false;
        this.anchor.set(0.5);
    }

    fire(game: Phaser.Game, speed: number) {
        this.rotation = game.physics.arcade.moveToPointer(this, speed);
        window.socket.emit(PlayerEvents.arrowfire, {
            playerId: this._playerId,
            arrow: this
        });
    }
}