import { EventDispatcher, Object3D, PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from 'three';
import { ModelScene } from './ModelScene.js';
import { Renderer } from './Renderer.js';
import Reticle from './Reticle.js';
declare const $presentedScene: unique symbol;
declare const $rafId: unique symbol;
declare const $currentSession: unique symbol;
declare const $tick: unique symbol;
declare const $refSpace: unique symbol;
declare const $viewerRefSpace: unique symbol;
declare const $resolveCleanup: unique symbol;
declare const $outputContext: unique symbol;
declare const $onWebXRFrame: unique symbol;
declare const $postSessionCleanup: unique symbol;
export declare class ARRenderer extends EventDispatcher {
    private renderer;
    threeRenderer: WebGLRenderer;
    inputContext: WebGLRenderingContext;
    camera: PerspectiveCamera;
    scene: Scene;
    dolly: Object3D;
    reticle: Reticle;
    raycaster: Raycaster | null;
    private [$outputContext];
    private [$rafId];
    private [$currentSession];
    private [$refSpace];
    private [$viewerRefSpace];
    private [$presentedScene];
    private [$resolveCleanup];
    constructor(renderer: Renderer);
    initializeRenderer(): void;
    resolveARSession(): Promise<XRSession>;
    /**
     * The currently presented scene, if any
     */
    readonly presentedScene: ModelScene | null;
    /**
     * Resolves to true if the renderer has detected all the necessary qualities
     * to support presentation in AR.
     */
    supportsPresentation(): Promise<boolean>;
    /**
     * Present a scene in AR
     */
    present(scene: ModelScene): Promise<void>;
    /**
     * If currently presenting a scene in AR, stops presentation and exits AR.
     */
    stopPresenting(): Promise<void>;
    [$postSessionCleanup](): void;
    /**
     * True if a scene is currently in the process of being presented in AR
     */
    readonly isPresenting: boolean;
    readonly outputContext: WebGLRenderingContext | null;
    placeModel(): Promise<void>;
    /**
     * It appears that XRSession's `inputsourceschange` event is not implemented
     * in Chrome Canary as of m72 for 'screen' inputs, which would be preferable
     * since we only need an "select" event, rather than track a pose on every
     * frame (like a 6DOF controller). Due to this bug, on every frame, check to
     * see if an input exists.
     * @see https://bugs.chromium.org/p/chromium/issues/detail?id=913703
     * @see https://immersive-web.github.io/webxr/#xrinputsource-interface
     */
    processXRInput(frame: XRFrame): void;
    [$tick](): void;
    [$onWebXRFrame](_time: number, frame: XRFrame): void;
}
export {};
