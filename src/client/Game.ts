import { Player } from "./actors/Player";
import { AssetConstants } from "./constants/AssetConstants";
import { PlatformGenerator } from "./engine/PlatformGenerator";
import { PowerUpFactory } from "./engine/PowerUpFactory";
import { Platform } from "./actors/Platform";
import { Events } from "../shared/Events";
import PlayerEvents = Events.PlayerEvents;
import GameEvents = Events.GameEvents;
import { PlayerStates } from "./constants/PlayerStates";
import { Login } from "./screens/login";
import { PlayerModel } from "../shared/PlayerModel";
import { PowerUpConfig } from "../shared/PowerUpConfig";
import { Arrow } from "./actors/Arrow";
import { SharedConstants } from "../shared/Constants";
import { PowerUpModel } from "../shared/PowerUpModel";
import ServerEvents = Events.ServerEvents;
import Players = AssetConstants.Players;
import * as uuid from "uuid";

declare const window: any; // This is necessary to get socket events!

export class Game extends Phaser.State {
    private players: Player[]; // Changed this back to array to make it easier for me to understand and implement events
    // can be changed back late
    private player: Player;
    private platforms: Phaser.Group;
    private powerUps: Phaser.Group;
    private firedArrows: Phaser.Group;
    private login: Login;

    /**
     * ONLY FOR DEBUG DO NOT USE
     * @type {number}
     */
    private static count = 0;

    constructor() {
        super();
        window.socket = io.connect();
        this.login = new Login();

    }

    init(name: string, winner?: string) {

        if (name !== undefined) {
            window.socket.disconnect();
            window.socket = io.connect();
            window.socket.emit(GameEvents.authentication, {name}, {
                x: window.innerWidth,
                y: window.innerHeight
            });
        }
        if (winner) {
            this.login = new Login(winner);
        }
        this.properties(this.game);
        this.manageAssets(this.game);
    }

    update(): void {
        this.gameUpdate(this.game);
    }

    /**
     * @desc To be used for attaching listeners
     * @param game instance of game
     */
    protected manageAssets(game: Phaser.Game): void {
        this.players = [];
        this.player = undefined;
        this.powerUps = game.add.physicsGroup();
        this.platforms = game.add.physicsGroup();
        this.platforms.classType = Platform;

        const platformGenerator = new PlatformGenerator(game, this.platforms);
        const powerUpFactory = new PowerUpFactory(game, this.powerUps);

        window.socket.on(PlayerEvents.joined, (player: PlayerModel) => {
            // This is called 3 times
            // Should be called only 1 as there is only 1 other player
            if (!this.players.find(p => p.player.id === player.id)) {
                this.players.push(new Player(game, player, AssetConstants.Players.PinkyPlayer));
            }
        });
        window.socket.on(PlayerEvents.protagonist, (player, isGameInitialised: boolean, platformLocs, powerUpList: PowerUpModel[]) => {
            // This is called twice should be called 1
            console.log(this.players);
            if (!this.players.find(p => p.player.id === player.id)) {
                this.player = new Player(game, player, AssetConstants.Players.PinkyPlayer);
            }

            this.players.push(this.player);
            if (powerUpList) {
                powerUpList.forEach(p => {
                    powerUpFactory.placePowerUp(p.name, p.x, p.y, p.id);
                });
            }

            if (platformLocs) {
                const locations: Phaser.Point[] = JSON.parse(platformLocs);
                locations.forEach(loc => {
                    this.platforms.create(loc.x, loc.y, AssetConstants.Environment.Platform);
                });
            }
            if (!isGameInitialised) {
                const locAndGroup = platformGenerator.generateRandomPlatforms(game.width, game.height);
                window.socket.emit(GameEvents.platformsCreated, locAndGroup.platformLoc);
                const locations: Phaser.Point[] = JSON.parse(locAndGroup.platformLoc);
                locations.forEach(loc => {
                    this.platforms.create(loc.x, loc.y, AssetConstants.Environment.Platform);
                });
            }
            platformGenerator.removeOverlappingPlatforms();
            platformGenerator.removeOverlappingPlatforms(this.platforms);
            this.platforms.setAll("body.allowGravity", false);
            this.platforms.setAll("body.immovable", true);

        });

        window.socket.on(GameEvents.drop, (coors: { x: number, y: number, powerUp: string, id: string }) => {
            powerUpFactory.placePowerUp(coors.powerUp, coors.x, coors.y, coors.id);
        });

        window.socket.on(GameEvents.arrowplatform, (arrowId) => {
            const arrow: Arrow = this.firedArrows.filter(arrow => arrow.id === arrowId.arrowId).first;
            if (arrow) {
                console.log("SERVER: " + arrowId.arrowId);
                console.log("CLIENT: " + arrow.id);
                arrow.destroy(true);
            }
        });

        window.socket.on(GameEvents.roundover, (players: PlayerModel[], scores) => {
            console.log(scores);
            game.state.start("RoundOver", true, false, this.player, players);
        });

        // Creating a new event for the main player?
        // a main  player is the player that owns the lobby
        // If we see that this has no semantic value can be changed to the general player event
        window.socket.on(PlayerEvents.players, (players: PlayerModel[]) => {
            // If a returning or new player joins current game
            // Collect all data and update client
            // Thus player not seeing different things than rest
            // What this means we must collect all of the visible data the enemies have
            // And update this players browser
            // Assuming ammo is visible

            players.map((player: PlayerModel) => {
                if (!this.players.find(p => p.player.id === player.id)) {
                    const enemy = new Player(game, player, AssetConstants.Players.PinkyPlayer);
                    this.players.push(enemy);
                }
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

        // Player hit by arrow
        window.socket.on(PlayerEvents.hit, (playerId: string, damage: number) => {
            this.players.filter(actor => actor.player.id === playerId).map(player => {
                player.hit(damage);
            });
        });

        // Player fired arrow
        window.socket.on(PlayerEvents.arrowfire, (playerId: string, playerX: number, playerY: number, mouseX: number, mouseY: number, id: string) => {
            const arrow = new Arrow(game, playerX, playerY, id);
            game.add.existing(arrow);
            this.firedArrows.add(arrow);
            arrow.fire(game, this.player.fireSpeed, mouseX, mouseY);
            if (this.player.player.id !== playerId) {
                this.players.filter(actor => actor.player.id === playerId).map(player => {
                    player.firedArrow();
                    player.playerState.set(PlayerStates.Shooting, false);
                });
            } else {
                this.player.firedArrow();
                this.player.playerState.set(PlayerStates.Shooting, false);
            }
        });

        // Player collected power up
        window.socket.on(PlayerEvents.powerPickup, (playerid: string, powerup: PowerUpConfig, pId: string) => {
            this.players.filter(p => p.player.id === playerid).map(p => {
                p.applyUp(powerup);
                p.hud.setPowerup(game, p.player, powerup.name);
            });
            const pp = this.powerUps.filter(p => p.id === pId).first;
            this.powerUps.remove(pp, true);
        });

        // Player died
        window.socket.on(PlayerEvents.death, (playerId: string) => {
            this.players.filter(actor => actor.player.id === playerId).map((player: Player) => {
                player.death();
            });
        });
        window.socket.on(GameEvents.gameover, (winner: string) => {
            window.socket.disconnect();
            window.socket = io.connect();
            game.state.start("GameState", true, false, undefined, winner);
        });
        // Player picks up item
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
        this.firedArrows = game.add.physicsGroup();
        this.firedArrows.classType = Arrow;
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

                // Fire bullet
                if (this.player.playerState.get(PlayerStates.Shooting)) {
                    if (this.player.ammo > 0) {
                        /*const arrow = new Arrow(game, this.player.player.x, this.player.player.y);
                        game.add.existing(arrow);
                        arrow.fire(game, this.player.fireSpeed, game.input.activePointer.x, game.input.activePointer.y);
                        this.player.firedArrow();
                        this.player.playerState.set(PlayerStates.Shooting, false);*/
                        window.socket.emit(PlayerEvents.arrowfire, {
                            playerId: this.player.player.id,
                            playerX: this.player.player.x,
                            playerY: this.player.player.y,
                            mouseX: game.input.activePointer.x,
                            mouseY: game.input.activePointer.y,
                            id: uuid()
                        });
                    }
                }

                // Further check to see if any player has collided with a player we bounce them off
                game.physics.arcade.collide(
                    this.player.player,
                    this.players.map(player => player.player)
                );
                game.physics.arcade.collide(
                    this.platforms,
                    this.players.map(player => player.player)
                );
                game.physics.arcade.collide(
                    this.powerUps,
                    this.platforms
                );
                game.physics.arcade.collide(
                    this.firedArrows,
                    this.platforms, (arrow: Arrow, platform: Platform) => {
                        window.socket.emit(GameEvents.arrowplatform, {
                            arrowId: arrow.id
                        });
                    }
                );
                // Apply power up to player
                game.physics.arcade.overlap(this.player.player, this.powerUps, (player, powerUp) => {
                    window.socket.emit(PlayerEvents.powerup, this.player.player.id, powerUp.key, powerUp.id);
                }, undefined, this);


                this.platforms.forEach((p: Phaser.Sprite) => {
                    p.body.checkCollision.left = false;
                    p.body.checkCollision.right = false;
                }, this);

                // Hit by bullet
                game.physics.arcade.collide(this.player.player, this.firedArrows, (player: Phaser.Sprite, arrow: Arrow) => {
                    window.socket.emit(PlayerEvents.hit, {
                        playerId: this.player.player.id,
                        damage: arrow.damageValue
                    });
                    arrow.destroy(true);
                });
            }
        }
    }

    protected properties(game: Phaser.Game): void {
        game.stage.disableVisibilityChange = true;
        game.time.desiredFps = 60;

        // Background set
        game.add.tileSprite(0, 0, game.width, game.height, AssetConstants.Backgrounds.BackgroundNight);
        game.add.sprite(0, 0, AssetConstants.Backgrounds.BackgroundNight);

        game.renderer.clearBeforeRender = false;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.set(0, 800);
    }
}

