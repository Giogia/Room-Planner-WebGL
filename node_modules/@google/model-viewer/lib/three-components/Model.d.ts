import { Box3, Object3D, Texture, Vector3 } from 'three';
declare const $cancelPendingSourceChange: unique symbol;
declare const $currentScene: unique symbol;
export declare const DEFAULT_FOV_DEG = 45;
/**
 * An Object3D that can swap out its underlying
 * model.
 */
export default class Model extends Object3D {
    private [$currentScene];
    private loader;
    private mixer;
    private [$cancelPendingSourceChange];
    private animations;
    private animationsByName;
    private currentAnimationAction;
    modelContainer: Object3D;
    animationNames: Array<string>;
    boundingBox: Box3;
    size: Vector3;
    idealCameraDistance: number;
    fieldOfViewAspect: number;
    userData: {
        url: string | null;
    };
    url: string | null;
    /**
     * Creates a model.
     */
    constructor();
    /**
     * Returns a boolean indicating whether or not there is a
     * loaded model attached.
     */
    hasModel(): boolean;
    applyEnvironmentMap(map: Texture | null): void;
    /**
     * Pass in a THREE.Object3D to be controlled
     * by this model.
     */
    setObject(model: Object3D): void;
    setSource(url: string | null, progressCallback?: (progress: number) => void): Promise<void>;
    animationTime: number;
    readonly hasActiveAnimation: boolean;
    /**
     * Plays an animation if there are any associated with the current model.
     * Accepts an optional string name of an animation to play. If no name is
     * provided, or if no animation is found by the given name, always falls back
     * to playing the first animation.
     */
    playAnimation(name?: string | null, crossfadeTime?: number): void;
    stopAnimation(): void;
    updateAnimation(step: number): void;
    clear(): void;
    /**
     * Calculates the idealCameraDistance and fieldOfViewAspect that allows the 3D
     * object to be framed tightly in a 2D window of any aspect ratio without
     * clipping at any camera orbit. The camera's center target point can be
     * optionally specified. If no center is specified, it defaults to the center
     * of the bounding box, which means asymmetric models will tend to be tight on
     * one side instead of both. Proper choice of center can correct this.
     */
    updateFraming(center?: Vector3 | null): void;
}
export {};
