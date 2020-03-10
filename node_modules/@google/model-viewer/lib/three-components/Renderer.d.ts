import { Event, EventDispatcher, WebGLRenderer } from 'three';
import { Debugger } from './Debugger.js';
import { ModelScene } from './ModelScene.js';
import TextureUtils from './TextureUtils.js';
export interface RendererOptions {
    debug?: boolean;
}
export interface ContextLostEvent extends Event {
    type: 'contextlost';
    sourceEvent: WebGLContextEvent;
}
export declare const $arRenderer: unique symbol;
declare const $onWebGLContextLost: unique symbol;
declare const $webGLContextLostHandler: unique symbol;
declare const $singleton: unique symbol;
/**
 * Registers canvases with Canvas2DRenderingContexts and renders them
 * all in the same WebGLRenderingContext, spitting out textures to apply
 * to the canvases. Creates a fullscreen WebGL canvas that is not added
 * to the DOM, and on each frame, renders each registered canvas on a portion
 * of the WebGL canvas, and applies the texture on the registered canvas.
 *
 * In the future, can use ImageBitmapRenderingContext instead of
 * Canvas2DRenderingContext if supported for cheaper transfering of
 * the texture.
 */
export declare class Renderer extends EventDispatcher {
    static [$singleton]: Renderer;
    static readonly singleton: Renderer;
    static resetSingleton(): void;
    threeRenderer: WebGLRenderer;
    context3D: WebGLRenderingContext | null;
    canvas3D: HTMLCanvasElement | OffscreenCanvas;
    textureUtils: TextureUtils | null;
    width: number;
    height: number;
    protected debugger: Debugger | null;
    private [$arRenderer];
    private scenes;
    private lastTick;
    private [$webGLContextLostHandler];
    readonly canRender: boolean;
    constructor(options?: RendererOptions);
    setRendererSize(width: number, height: number): void;
    registerScene(scene: ModelScene): void;
    unregisterScene(scene: ModelScene): void;
    supportsPresentation(): Promise<boolean>;
    readonly presentedScene: ModelScene | null;
    present(scene: ModelScene): Promise<void>;
    stopPresenting(): Promise<void>;
    readonly isPresenting: boolean;
    render(t: number): void;
    dispose(): void;
    [$onWebGLContextLost](event: WebGLContextEvent): void;
}
export {};
