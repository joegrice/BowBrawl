export interface PhaserLifecycle {
    preload(): void;
    create(): void;
    update(): void;
}