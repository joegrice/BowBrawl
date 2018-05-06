import { PlayerStates } from "../constants/PlayerStates";
import { Controls } from "../controlls/Controls";
import { AssetConstants } from "../constants/AssetConstants";
import Physics = Phaser.Physics;

export class Player {
    private _sprite: Phaser.Sprite;
    private _playerState: Map<PlayerStates, boolean | number> = new Map<PlayerStates, boolean | number>();
    private _velocity = 300;
    private _controls: Controls;

    constructor(private gameInstance: Phaser.Game, private playerInstance?: Player) {
        this.generatePlayer(gameInstance);
    }

    public generatePlayer(game: Phaser.Game) {
        // todo: Should later be moved to a factory? Or can this be considered a factory?
        this.initControls();
        this.sprite = this.gameInstance.add.sprite(100, 100, AssetConstants.Players.PinkyPlayer);
        this.sprite.id = "1"; // todo: Automate this later
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.name = "Random name";
        this.addPhysicsToPlayer(game);
    }

    private initControls(): void {
        this._controls = new Controls(this.gameInstance, this);
    }

    private addPhysicsToPlayer(game: Phaser.Game): void {
        game.physics.enable(this.sprite, Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.gravity.y = 800;
        this.sprite.body.angularDrag = 50;
        this.sprite.body.enable = true;
    }

    public updateView(): void {
        this.controls.update();
    }

    public pickupWeapon() {
        // todo: When user picks up new weapon
        throw new Error("Function not implemented");
    }

    // Setters and Getters


    get controls(): Controls {
        return this._controls;
    }

    get sprite(): Phaser.Sprite {
        return this._sprite;
    }

    set sprite(value: Phaser.Sprite) {
        this._sprite = value;
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
}