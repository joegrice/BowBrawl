import { SharedConstants } from "./Constants";
import PowerUp = SharedConstants.PowerUp;

export class EnumUtils {
    public static RandomEnum(): string {
        const length = Object.keys(SharedConstants.PowerUp).length;
        const random = getRandomInt(0, length - 1);
        switch (random) {
            case 0:
                return PowerUp.fireBoost;
            case 1:
                return PowerUp.movment;
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
}