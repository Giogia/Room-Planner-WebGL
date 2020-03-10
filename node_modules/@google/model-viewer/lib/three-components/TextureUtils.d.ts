import { EventDispatcher, PMREMGenerator, Texture, WebGLRenderer, WebGLRenderTarget } from 'three';
import { ProgressTracker } from '../utilities/progress-tracker.js';
export interface EnvironmentMapAndSkybox {
    environmentMap: WebGLRenderTarget;
    skybox: WebGLRenderTarget | null;
}
export interface EnvironmentGenerationConfig {
    progressTracker?: ProgressTracker;
}
declare const $environmentMapCache: unique symbol;
declare const $generatedEnvironmentMap: unique symbol;
declare const $PMREMGenerator: unique symbol;
declare const $addMetadata: unique symbol;
declare const $loadEnvironmentMapFromUrl: unique symbol;
declare const $loadGeneratedEnvironmentMap: unique symbol;
export default class TextureUtils extends EventDispatcher {
    readonly pmremGenerator: PMREMGenerator;
    private [$generatedEnvironmentMap];
    private [$PMREMGenerator];
    private [$environmentMapCache];
    constructor(threeRenderer: WebGLRenderer);
    load(url: string, progressCallback?: (progress: number) => void): Promise<Texture>;
    loadEquirectAsCubeUV(url: string, progressCallback?: (progress: number) => void): Promise<WebGLRenderTarget>;
    /**
     * Returns a { skybox, environmentMap } object with the targets/textures
     * accordingly. `skybox` is a WebGLRenderCubeTarget, and `environmentMap`
     * is a Texture from a WebGLRenderCubeTarget.
     */
    generateEnvironmentMapAndSkybox(skyboxUrl?: string | null, environmentMapUrl?: string | null, options?: EnvironmentGenerationConfig): Promise<EnvironmentMapAndSkybox>;
    private [$addMetadata];
    /**
     * Loads a WebGLRenderTarget from a given URL. The render target in this
     * case will be assumed to be used as an environment map.
     */
    private [$loadEnvironmentMapFromUrl];
    /**
     * Loads a dynamically generated environment map.
     */
    private [$loadGeneratedEnvironmentMap];
    dispose(): Promise<void>;
}
export {};
