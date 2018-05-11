import { PlayerStates } from "../constants/PlayerStates";
import { Controls } from "../controlls/Controls";
import Physics = Phaser.Physics;
import { Hud } from "../UI/Hud";
import { Weapon } from "../weapon/Weapon";
import { type } from "os";
import { AssetConstants } from "../constants/AssetConstants";

export class Player {
    // Sprite should be variable of player in order to provide an interface to pass to server
    private _player: Phaser.Sprite;
    private _playerState: Map<PlayerStates, boolean | number>;
    private _velocity = 300;
    private _controls: Controls;
    private _hud: Hud;
    private _weapon: Weapon;
    // todo: Temp remove
    /*  private _fireRate = 200;
      private _nextFire = 0;
      private _fireSpeed = 600;
      private _ammo: Phaser.Group;*/

    // Power ups should be incidated in states?
    //  private _powerUpActive: boolean;

    constructor(private game: Phaser.Game, player: Player, type: AssetConstants.Players) {
        this.createPlayer(this.game, type);
        this._playerState = new Map<PlayerStates, boolean | number>();
    }

    private initControls(): void {
        this._controls = new Controls(this.game, this);
    }

    private addPhysicsToPlayer(game: Phaser.Game): void {
        game.physics.enable(this, Physics.ARCADE);
        this._player.body.collideWorldBounds = true;
        this._player.body.gravity.y = 800;
        this._player.body.angularDrag = 50;
        this._player.body.enable = true;
        this._player.anchor.set(0.5, 0.5);
    }

    public updateView(): void {
        this.controls.update();
    }
    // todo: Temp remove
    /* public fire(game: Phaser.Game) {
         if (game.time.now > this._nextFire && this._ammo  > 0) {
             this._nextFire = game.time.now + this._fireRate;
             const arrow: Arrow = this._ammo.getFirstDead();
             arrow.reset(this.x, this.y);
             arrow.fire(game, this._fireSpeed);
         }
     }*/

    // todo: Temp remove
    /*  public applyPowerUp(config: PowerUpConfig) {
          this._fireSpeed += config.fireSpeed;
          this._velocity += config.velocity;
          this.body.gravity.y -= config.gravity;
          this.health += config.health;
      }
  */
    public pickupWeapon() {
        // todo: When user picks up new weapon
        throw new Error("Function not implemented");
    }

    // Setters and Getters
    get controls(): Controls {
        return this._controls;
    }

    get playerState(): Map<PlayerStates, boolean | number> {
        return this._playerState;
    }

    set playerState(value: Map<PlayerStates, boolean | number>) {
        this._playerState = value;
    }

    get velocity(): number {
        return this._velocity;
    }

    set velocity(value: number) {
        this._velocity = value;
    }

    get player(): Phaser.Sprite {
        return this._player;
    }

    set player(value: Phaser.Sprite) {
        this._player = value;
    }

    /* private addAmmo(game: Phaser.Game) {
         this._ammo = game.add.group();
         this._ammo.classType = Arrow;
         for (let i = 0; i < 5; i++) {
             const arrow: Arrow = new Arrow(game, 0, 0);
             this._ammo.add(arrow);
         }
     }*/
    private createPlayer(game: Phaser.Game, type: any) {
        this._hud = new Hud();
        this.initControls();
    }
}