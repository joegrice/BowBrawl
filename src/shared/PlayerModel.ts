export interface PlayerModel {
    id: string;
    name: string;
    x: number;
    y: number;
    ammo: number;
    health: number;
    activePowerUp?: string;
    alive: boolean;
    score: number;
    ready: boolean;
}