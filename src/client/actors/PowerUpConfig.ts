export class PowerUpConfig {
    name: string;
    health: number;
    velocity: number;
    gravity: number;
    fireSpeed: number;


    constructor(name: string, health: number, velocity: number, gravity: number, fireSpeed: number) {
        this.name = name;
        this.health = health;
        this.velocity = velocity;
        this.gravity = gravity;
        this.fireSpeed = fireSpeed;
    }
}