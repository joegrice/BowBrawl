export namespace Events {
    export class GameEvents {
        public static authentication = "authentication:successful";
        public static end: "game:over";
        public static start: "game:start";
        public static drop: "drop";
    }
    export class ServerEvents {
        public static connected = "connected";
        public static discconected = "disconnected";
    }
    export class PlayerEvents {
        public static joined = "player:joined";

        /**
         * When the player that has created the lobby enters
         */
        public static protagonist = "player:protagonist";
        public static players = "player:ping";
        public static quit = "player:left";
        public static pickup = "player:pickup";
        public static hit = "player:hit";
        public static coordinates = "player:coordinates";
    }
}