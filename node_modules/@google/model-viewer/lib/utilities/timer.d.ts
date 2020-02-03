declare const $time: unique symbol;
declare const $duration: unique symbol;
/**
 * The Timer class can be used power delays and animations
 */
export declare class Timer {
    /**
     * total time incremented by the tick method. time is initialized to 0
     */
    readonly time: number;
    /**
     * a calculation of `time / duration` which can be used for animations
     */
    readonly timeScale: number;
    /**
     * duration of the timer
     */
    readonly duration: number;
    /**
     * whether the timer has run fully or stop has been called
     */
    readonly hasStopped: boolean;
    private [$time];
    private [$duration];
    /**
     * Creates a new timer
     *
     * @param duration the total duration for the timer
     */
    constructor(duration: number);
    /**
     * reset the time back to 0
     */
    reset(): void;
    /**
     * sets time to duration meaning the timer has completed and hasStopped will
     * return true
     */
    stop(): void;
    /**
     * pass deltaTime to the tick method to tick/increment the timer forward
     *
     * @param deltaTime delta time since last tick was called
     */
    tick(deltaTime: number): void;
}
export {};
