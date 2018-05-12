import { Player } from "./actors/Player";
import { AssetConstants } from "./constants/AssetConstants";
import { PlatformGenerator } from "./engine/PlatformGenerator";
import { PowerUpFactory } from "./engine/PowerUpFactory";
import { PowerUp } from "./actors/PowerUp";
import { Platform } from "./actors/Platform";
import { Events } from "../shared/Events";
import PlayerEvents = Events.PlayerEvents;
import GameEvents = Events.GameEvents;
import { PlayerStates } from "./constants/PlayerStates";
import { Login } from "./screens/login";
import { PlayerModel } from "../shared/PlayerModel";
import { PowerUpConfig } from "./actors/PowerUpConfig";

declare const window: any; // This is necessary to get socket events!

export class Game {
    private players: Player[]; // Changed this back to array to make it easier for me to understand and implement events
    // can be changed back later
    private player: Player;
    private platforms: Phaser.Group;
    private powerUps: Phaser.Group;
    private login: Login;

    constructor() {
        window.socket = io.connect();
        this.login = new Login();
    }

    /**
     * @desc To be used for attaching listeners
     * @param game instance of game
     */
    protected manageAssets(game: Phaser.Game): void {
        this.players = [];

        window.socket.on(PlayerEvents.joined, (player) => {
            this.players.push(new Player(game, player, AssetConstants.Players.PinkyPlayer));
        });

        // Creating a new event for the main player?
        // a main  player is the player that owns the lobby
        // If we see that this has no semantic value can be changed to the general player event
        window.socket.on(PlayerEvents.protagonist, (player) => {
            this.player = new Player(game, player, AssetConstants.Players.PinkyPlayer);
            this.players.push(this.player);
        });
        window.socket.on(PlayerEvents.players, (players: PlayerModel[]) => {
            // If a returning or new player joins current game
            // Collect all data and update client
            // Thus player not seeing different things than rest
            // What this means we must collect all of the visible data the enemies have
            // And update this players browser
            // Assuming ammo is visible
            console.info(players);
            players.forEach((player: PlayerModel) => {
                const enemy = new Player(game, player, AssetConstants.Players.PinkyPlayer);
                // todo: update states
                this.players.push(enemy);
            });
        });
        window.socket.on(PlayerEvents.quit, (playerId) => {
            this.players.filter(player => player.player.id === playerId)
                .map(player => player.player.kill()); // Destroy sprite in case player leaves game
        });

        window.socket.on(GameEvents.drop, (coors) => {
            // The server will be causing arrows to drop every n seconds
            // When this happen act upon
            // if arrows exist prior to this remove then and replace with  new ones
            if (/*todo: sudo: check arrows exist*/false) {
                // Remove arrows
            }
            // todo: sudo: Create arrows
        });
        window.socket.on(PlayerEvents.hit, (enemy) => {
            // Detect which player was hit
            // reload their client so that health updates
            // todo: Implementation

        });
        window.socket.on(PlayerEvents.powerup, (player: Player, powerUpConfig: PowerUpConfig) => {
            this.players.filter(actor => actor.player.id === player.player.id).map(player => {
                player.applyPowerUp(powerUpConfig);
            });
        });
        window.socket.on(PlayerEvents.pickup, (player) => {
            // Once arrows have been picked up
            // Assign them to the user that has picked them up
            this.players.filter(actor => actor.player.id === player).map(player => {
                // todo: assign arrows to player
            });
            // todo: Kill arrow sprite
        });
        /*!IMPORTANT HERE WE KEEP TRACK OF ALL THE OTHER PLAYERS ACTIONS
        * here we keep the current state
        * */
        window.socket.on(PlayerEvents.coordinates, (player) => {
            this.players.filter((actor: Player) => {
                if (actor.player.id === player.player.id) {
                    actor.player.x = player.coors.x;
                    actor.player.y = player.coors.y;
                }
                // todo: Then we need a method to update the HUD if we will have one
                // todo: detect if player is firing and moving and add animations
            });
        });
        this.platforms = game.add.group();
        this.platforms.classType = Platform;
        this.platforms = PlatformGenerator.generateRandomPlatforms(game.width, game.height, game);

        this.powerUps = game.add.group();
        const powerUpFactory = new PowerUpFactory(game, this.platforms);
        this.powerUps.add(powerUpFactory.placePowerUp(AssetConstants.PowerUps.MovementSpeedBoost));
        this.powerUps.add(powerUpFactory.placePowerUp(AssetConstants.PowerUps.FireSpeedBoost));
    }

    /**
     * This is called via tha phaser engine class, it is the loop that updates the characters
     * During this loop the states of the players have to be constantly emitted
     *  i.e Firing, Movement etc.
     * @param {Phaser.Game} game
     */
    protected gameUpdate(game: Phaser.Game): void {
        if (this.player) {
            if (this.player.controls) {
                // Allows players to stand on platforms
                // Must be before update view so that it can update if player sprite is touching a platform
                game.physics.arcade.collide(
                    this.player.player,
                    this.platforms
                );
                this.player.updateView();
                window.socket.emit(PlayerEvents.coordinates, {
                    x: this.player.player.position.x,
                    y: this.player.player.position.y,
                    r: this.player.player.rotation,
                    f: this.player.playerState.get(PlayerStates.Shooting),
                    m: this.player.playerState.get(PlayerStates.IsMoving),
                    a: this.player.playerState.get(PlayerStates.AMMO)
                });
                // Further check to see if any player has collided with a player we bounce them off
                game.physics.arcade.collide(
                    this.player.player,
                    this.players.map(player => player.player)
                );

                // Apply power up to player
                game.physics.arcade.overlap(this.player.player, this.powerUps, (player: Phaser, powerUp: PowerUp) => {
                    powerUp.kill();
                    window.socket.emit(PlayerEvents.powerup, {
                        player: this.player,
                        powerUpConfig: powerUp
                    });
                });
            }
        }


        // todo: Check if arrow has collided with a player an emit the event but first lets create an arrow class of some sort
        // todo: Then using the overlap method we need to check if the player has touched any arrows and emit that event and destroy the arrow sprite

        /* game.physics.arcade.collide(this.player, this.platforms);
         game.physics.arcade.overlap(this.players, this.powerUps, (player: Player, powerUp: PowerUp) => {
             player.applyPowerUp(powerUp.getConfig);
             powerUp.kill();
         }, undefined, this);

         if (this.player && this.player.controls) {
             this.player.updateView();
         }*/
    }

    protected properties(game: Phaser.Game): void {
        game.stage.disableVisibilityChange = true;
        game.time.desiredFps = 60;

        // Background set
        game.add.tileSprite(0, 0, game.width, game.height, AssetConstants.Backgrounds.BackgroundNight);
        game.add.sprite(0, 0, AssetConstants.Backgrounds.BackgroundNight);

        game.renderer.clearBeforeRender = false;
        game.physics.startSystem(Phaser.Physics.ARCADE);
    }
}
