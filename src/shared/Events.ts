export namespace Events {
    export class GameEvents {
        public static authentication = "authentication:successful";
        public static end = "game:over";
        public static start = "game:start";
        public static drop = "game:drop";
        static platformsCreated = "platformsCreated";
        public static roundover = "game:roundover";
        public static allplayersready = "game:allplayersready";
    }
    export class ServerEvents {
        public static connected = "connection";
        public static discconected = "disconnect";
    }
    export class PlayerEvents {
        public static joined = "player:joined";
        public static ready = "player:ready";

        /**
         * When the player that has created the lobby enters
         */
        public static protagonist = "player:protagonist";
        public static players = "player:ping";
        public static quit = "player:left";
        public static pickup = "player:pickup";
        public static hit = "player:hit";
        public static coordinates = "player:coordinates";
        public static powerup = "player:powerup";
        public static arrowfire = "player:arrowfire";
        public static death = "player:death";
        static powerPickup = "pickup:powerup";
    }
}