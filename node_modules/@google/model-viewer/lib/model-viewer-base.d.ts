/// <reference types="resize-observer-browser" />
import { UpdatingElement } from 'lit-element/lib/updating-element';
import { Vector3 } from 'three';
import { ModelScene } from './three-components/ModelScene.js';
import { ContextLostEvent, Renderer } from './three-components/Renderer.js';
import { ProgressTracker } from './utilities/progress-tracker.js';
declare const $updateSize: unique symbol;
declare const $loaded: unique symbol;
declare const $template: unique symbol;
declare const $fallbackResizeHandler: unique symbol;
declare const $defaultAriaLabel: unique symbol;
declare const $resizeObserver: unique symbol;
declare const $intersectionObserver: unique symbol;
declare const $lastDpr: unique symbol;
declare const $clearModelTimeout: unique symbol;
declare const $onContextLost: unique symbol;
declare const $contextLostHandler: unique symbol;
export declare const $isInRenderTree: unique symbol;
export declare const $ariaLabel: unique symbol;
export declare const $loadedTime: unique symbol;
export declare const $updateSource: unique symbol;
export declare const $markLoaded: unique symbol;
export declare const $container: unique symbol;
export declare const $canvas: unique symbol;
export declare const $scene: unique symbol;
export declare const $needsRender: unique symbol;
export declare const $tick: unique symbol;
export declare const $onModelLoad: unique symbol;
export declare const $onResize: unique symbol;
export declare const $onUserModelOrbit: unique symbol;
export declare const $renderer: unique symbol;
export declare const $progressTracker: unique symbol;
export declare const $getLoaded: unique symbol;
export declare const $getModelIsVisible: unique symbol;
export interface Vector3D {
    x: number;
    y: number;
    z: number;
    toString(): string;
}
export declare const toVector3D: (v: Vector3) => {
    x: number;
    y: number;
    z: number;
    toString(): string;
};
interface ToBlobOptions {
    mimeType?: string;
    qualityArgument?: number;
    idealAspect?: boolean;
}
/**
 * Definition for a basic <model-viewer> element.
 */
export default class ModelViewerElementBase extends UpdatingElement {
    protected static [$template]: HTMLTemplateElement | void;
    static readonly is: string;
    /** @nocollapse */
    static readonly template: void | HTMLTemplateElement;
    /** @export */
    /** @export */
    static modelCacheSize: number;
    alt: string | null;
    src: string | null;
    protected [$isInRenderTree]: boolean;
    protected [$loaded]: boolean;
    protected [$loadedTime]: number;
    protected [$scene]: ModelScene;
    protected [$container]: HTMLDivElement;
    protected [$canvas]: HTMLCanvasElement;
    protected [$defaultAriaLabel]: string;
    protected [$lastDpr]: number;
    protected [$clearModelTimeout]: number | null;
    protected [$fallbackResizeHandler]: (...args: any[]) => void;
    protected [$resizeObserver]: ResizeObserver | null;
    protected [$intersectionObserver]: IntersectionObserver | null;
    protected [$progressTracker]: ProgressTracker;
    protected [$contextLostHandler]: (event: ContextLostEvent) => void;
    /** @export */
    readonly loaded: boolean;
    readonly [$renderer]: Renderer;
    /** @export */
    readonly modelIsVisible: boolean;
    /**
     * Creates a new ModelViewerElement.
     */
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, any>): void;
    /** @export */
    toDataURL(type?: string, encoderOptions?: number): string;
    /** @export */
    toBlob(options?: ToBlobOptions): Promise<Blob>;
    readonly [$ariaLabel]: string;
    [$getLoaded](): boolean;
    [$getModelIsVisible](): boolean;
    /**
     * Called on initialization and when the resize observer fires.
     */
    [$updateSize]({ width, height }: {
        width: any;
        height: any;
    }, forceApply?: boolean): void;
    [$tick](_time: number, _delta: number): void;
    [$markLoaded](): void;
    [$needsRender](): void;
    [$onModelLoad](_event: any): void;
    [$onResize](e: {
        width: number;
        height: number;
    }): void;
    [$onContextLost](event: ContextLostEvent): void;
    /**
     * Parses the element for an appropriate source URL and
     * sets the views to use the new model based off of the `preload`
     * attribute.
     */
    [$updateSource](): Promise<void>;
}
export {};
