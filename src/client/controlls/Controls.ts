import { Player } from "../actors/Player";
import { PlayerStates } from "../constants/PlayerStates";

export class Controls {
    private controls: ControlHandling;

    constructor(private gameInstance: Phaser.Game, private playerInstance: Player) {
        this.controls = {
            cursors: this.gameInstance.input.keyboard.createCursorKeys(),
            shoot: this.gameInstance.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
        };
    }

    public update(): void {
        if (this.playerInstance.sprite.alive) {
            this.playerInstance.playerState.set(PlayerStates.CanShoot, false);
            const vel = this.playerInstance.velocity;
            const acceleration = this.playerInstance.sprite.body.acceleration;
            const rotation = this.playerInstance.sprite.rotation;
            const upSpeed = 100;

            if (this.controls.cursors.up.isDown) {
                this.gameInstance.physics.arcade.accelerationFromRotation(rotation, upSpeed, acceleration);
                // todo: play move animation
                this.playerInstance.playerState.set(PlayerStates.IsMoving, true);
            } else {
                this.playerInstance.sprite.body.acceleration.set(0);
                this.playerInstance.playerState.set(PlayerStates.IsMoving, false);
            }
            if (this.controls.cursors.down.isDown) {
                this.playerInstance.sprite.body.angularVelocity = -vel;
            } else if (this.controls.cursors.left.isDown) {
                this.playerInstance.sprite.body.angularVelocity = vel;
            } else {
                this.playerInstance.sprite.body.angularVelocity = 0;
            }
        }
    }
}

interface ControlHandling {
    cursors: Phaser.CursorKeys;
    shoot: Phaser.Key;
}