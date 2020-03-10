import { Camera, Event as ThreeEvent, Object3D, PerspectiveCamera, Scene, Vector3 } from 'three';
import ModelViewerElementBase from '../model-viewer-base.js';
import Model from './Model.js';
import { Shadow } from './Shadow.js';
export interface ModelLoadEvent extends ThreeEvent {
    url: string;
}
export interface ModelSceneConfig {
    element: ModelViewerElementBase;
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
}
export declare type IlluminationRole = 'primary' | 'secondary';
export declare const IlluminationRole: {
    [index: string]: IlluminationRole;
};
declare const $paused: unique symbol;
/**
 * A THREE.Scene object that takes a Model and CanvasHTMLElement and
 * constructs a framed scene based off of the canvas dimensions.
 * Provides lights and cameras to be used in a renderer.
 */
export declare class ModelScene extends Scene {
    private [$paused];
    aspect: number;
    canvas: HTMLCanvasElement;
    shadow: Shadow | null;
    shadowIntensity: number;
    shadowSoftness: number;
    pivot: Object3D;
    pivotCenter: Vector3;
    width: number;
    height: number;
    isVisible: boolean;
    isDirty: boolean;
    element: ModelViewerElementBase;
    context: CanvasRenderingContext2D;
    exposure: number;
    model: Model;
    framedFieldOfView: number;
    activeCamera: Camera;
    camera: PerspectiveCamera;
    constructor({ canvas, element, width, height }: ModelSceneConfig);
    readonly paused: boolean;
    pause(): void;
    resume(): void;
    /**
     * Sets the model via URL.
     */
    setModelSource(source: string | null, progressCallback?: (progress: number) => void): Promise<void>;
    /**
     * Receives the size of the 2D canvas element to make according
     * adjustments in the scene.
     */
    setSize(width: number, height: number): void;
    /**
     * Set's the framedFieldOfView based on the aspect ratio of the window in
     * order to keep the model fully visible at any camera orientation.
     */
    frameModel(): void;
    /**
     * Returns the size of the corresponding canvas element.
     */
    getSize(): {
        width: number;
        height: number;
    };
    /**
     * Returns the current camera.
     */
    getCamera(): Camera;
    /**
     * Sets the passed in camera to be used for rendering.
     */
    setCamera(camera: Camera): void;
    /**
     * Sets the rotation of the model's pivot, around its pivotCenter point.
     */
    setPivotRotation(radiansY: number): void;
    /**
     * Gets the current rotation value of the pivot
     */
    getPivotRotation(): number;
    /**
     * Called when the model's contents have loaded, or changed.
     */
    onModelLoad(event: {
        url: string;
    }): void;
    /**
     * Sets the shadow's intensity, lazily creating the shadow as necessary.
     */
    setShadowIntensity(shadowIntensity: number): void;
    /**
     * Sets the shadow's softness by mapping a [0, 1] softness parameter to the
     * shadow's resolution. This involves reallocation, so it should not be
     * changed frequently. Softer shadows are cheaper to render.
     */
    setShadowSoftness(softness: number): void;
}
export {};
