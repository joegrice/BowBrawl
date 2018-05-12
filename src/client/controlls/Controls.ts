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
        if (this.playerInstance.player.alive) {
            this.playerInstance.playerState.set(PlayerStates.CanShoot, false);
            const vel = this.playerInstance.velocity;

            if (this.controls.cursors.up.isDown && (this.playerInstance.player.body.onFloor()
                || this.playerInstance.player.body.touching.down)) {
                this.playerInstance.player.body.velocity.y = -vel;
                this.playerInstance.playerState.set(PlayerStates.IsMoving, true);
            }
            if (this.controls.cursors.left.isDown) {
                this.playerInstance.player.body.velocity.x = -vel;
            } else if (this.controls.cursors.right.isDown) {
                this.playerInstance.player.body.velocity.x = vel;
            } else {
                this.playerInstance.player.body.velocity.x = 0;
            }

            if (this.controls.mouse.leftButton.isDown) {
                this.playerInstance.playerState.set(PlayerStates.Shooting, true);
            }
        }
    }
}

interface ControlHandling {
    cursors: Phaser.CursorKeys;
    shoot: Phaser.Key;
    mouse: Phaser.Pointer;
}