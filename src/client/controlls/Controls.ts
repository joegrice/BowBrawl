import { Player } from "../actors/Player";
import { PlayerStates } from "../constants/PlayerStates";

export class Controls {
    private controls: ControlHandling;

    constructor(private gameInstance: Phaser.Game, private playerInstance: Player) {
        this.controls = {
            cursors: this.gameInstance.input.keyboard.createCursorKeys(),
            shoot: this.gameInstance.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR),
            mouse: this.gameInstance.input.activePointer
        };
    }

    public update(): void {
        if (this.playerInstance.alive) {
            this.playerInstance.playerState.set(PlayerStates.CanShoot, false);
            const vel = this.playerInstance.velocity;

            if (this.controls.cursors.up.isDown && (this.playerInstance.body.onFloor()
                || this.playerInstance.body.touching.down)) {
                this.playerInstance.body.velocity.y = -250;
                // todo: play move animation
                this.playerInstance.playerState.set(PlayerStates.IsMoving, true);
            }
            if (this.controls.cursors.left.isDown) {
                this.playerInstance.body.velocity.x = -vel;
            } else if (this.controls.cursors.right.isDown) {
                this.playerInstance.body.velocity.x = vel;
            } else {
                this.playerInstance.body.velocity.x = 0;
            }

            if (this.controls.mouse.leftButton.isDown) {
                this.playerInstance.fire(this.gameInstance);
            }
        }
    }
}

interface ControlHandling {
    cursors: Phaser.CursorKeys;
    shoot: Phaser.Key;
    mouse: Phaser.Pointer;
}