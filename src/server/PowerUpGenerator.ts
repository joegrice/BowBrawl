import { SharedConstants } from "../shared/Constants";
import { PowerUpModel } from "../shared/PowerUpModel";
import { PowerUpConfig } from "../shared/PowerUpConfig";

export class PowerUpGenerator {
    private powerUpList: Map<string, PowerUpConfig> = new Map<string, PowerUpConfig>();

    constructor() {
        this.powerUpList.set(SharedConstants.PowerUp.movment.toString(), new PowerUpConfig(SharedConstants.PowerUp.movment, 0, 200, 0, 0));
        this.powerUpList.set(SharedConstants.PowerUp.fireBoost.toString(), new PowerUpConfig(SharedConstants.PowerUp.fireBoost, 0, 0, 0, 10));
    }

    public getPowerUp(name: string): PowerUpConfig {
        return this.powerUpList.get(name);
    }
}
