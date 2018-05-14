import { PowerUp } from "../actors/PowerUp";

export class PowerUpFactory {

    private readonly _game: Phaser.Game;
    private _powerGroup: Phaser.Group;

    constructor(game: Phaser.Game, powerUpGroup: Phaser.Group) {
        this._game = game;
        this._powerGroup = powerUpGroup;
        this._powerGroup.enableBody = true;
    }

    placePowerUp(name: string, x: number, y: number) {
        const powerUp = new PowerUp(this._game, x, y, name);
        this._game.add.existing(powerUp);
        this._powerGroup.add(powerUp);
    }

}