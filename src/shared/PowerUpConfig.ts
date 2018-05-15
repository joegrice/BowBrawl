export class PowerUpConfig {
    name: string;
    health: number;
    velocity: number;
    gravity: number;
    fireSpeed: number;
    ammo: number;


    constructor(name: string, health: number, velocity: number, gravity: number, fireSpeed: number, ammo = 0) {
        this.name = name;
        this.health = health;
        this.velocity = velocity;
        this.gravity = gravity;
        this.fireSpeed = fireSpeed;
        this.ammo = ammo;
    }
}