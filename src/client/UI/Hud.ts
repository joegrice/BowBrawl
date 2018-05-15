import { SharedConstants } from "../../shared/Constants";

export class Hud {
    private ammo: Phaser.Text;
    private name: Phaser.Text;
    private health: Phaser.Text;
    private style: { font, fill };
    private powerup: Phaser.Text;

    constructor() {
        this.style = {
            font: "10px Arial",
            fill: "#ffffff"
        };
    }

    public setPowerup(game: Phaser.Game, player: Phaser.Sprite, powerupKind: string) {
        let pp: string;
        if (powerupKind === SharedConstants.PowerUp.fireBoost) {
            pp = "F";
        } else if (powerupKind === SharedConstants.PowerUp.movment) {
            pp = "M";
        }
        this.powerup = game.add.text(45, -25, pp, this.style);
        player.addChild(this.powerup);
    }

    public setName(game: Phaser.Game, player: Phaser.Sprite): void {
        this.name = game.add.text(-18, -25, player.name.substring(0, 6), this.style);
        player.addChild(this.name);
    }

    public updateAmmo(ammo: number): void {
        this.ammo.setText("" + ammo);
    }

    public updateHealth(health: number): void {
        this.health.setText("" + health);
    }

    public setAmmo(game: Phaser.Game, player: Phaser.Sprite, ammo: number): void {
        this.ammo = game.add.text(18, -25, "" + ammo, this.style);
        player.addChild(this.ammo);
    }

    public setHealth(game: Phaser.Game, player: Phaser.Sprite): void {
        this.health = game.add.text(30, -25, "" + player.health, this.style);
        player.addChild(this.health);
    }
}