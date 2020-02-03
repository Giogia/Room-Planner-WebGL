import { Scene, Texture, WebGLRenderer, WebGLRenderTarget } from 'three';
declare const $roughness: unique symbol;
declare const $sigma: unique symbol;
declare const $sizeLod: unique symbol;
declare const $lodPlanes: unique symbol;
declare const $blurMaterial: unique symbol;
declare const $flatCamera: unique symbol;
declare const $pingPongRenderTarget: unique symbol;
/**
 * This class generates a Prefiltered, Mipmapped Radiance Environment Map
 * (PMREM) from a cubeMap environment texture. This allows different levels of
 * blur to be quickly accessed based on material roughness. It is packed into a
 * special CubeUV format that allows us to perform custom interpolation so that
 * we can support nonlinear formats such as RGBE. Unlike a traditional mipmap
 * chain, it only goes down to the LOD_MIN level (above), and then creates extra
 * even more filtered 'mips' at the same LOD_MIN resolution, associated with
 * higher roughness levels. In this way we maintain resolution to smoothly
 * interpolate diffuse lighting while limiting sampling computation.
 */
export declare class PMREMGenerator {
    private renderer;
    private [$roughness];
    private [$sigma];
    private [$sizeLod];
    private [$lodPlanes];
    private [$blurMaterial];
    private [$flatCamera];
    private [$pingPongRenderTarget];
    constructor(renderer: WebGLRenderer);
    /**
     * Generates a PMREM from our default EnvironmentScene, which is a blurry
     * greyscale room with several boxes on the floor and several lit windows.
     */
    fromDefault(): WebGLRenderTarget;
    /**
     * Generates a PMREM from a supplied Scene, which can be faster than using an
     * image if networking bandwidth is low. Optional near and far planes ensure
     * the scene is rendered in its entirety (the cubeCamera is placed at the
     * origin).
     */
    fromScene(scene: Scene, near?: number, far?: number): WebGLRenderTarget;
    /**
     * Generates a PMREM from an equirectangular texture, which can be either LDR
     * (RGBFormat) or HDR (RGBEFormat).
     */
    fromEquirectangular(equirectangular: Texture): WebGLRenderTarget;
    private [$sceneToCubeUV];
    private [$equirectangularToCubeUV];
    private [$createRenderTarget];
    private [$applyPMREM];
    /**
     * This is a two-pass Gaussian blur for a cubemap. Normally this is done
     * vertically and horizontally, but this breaks down on a cube. Here we apply
     * the blur latitudinally (around the poles), and then longitudinally (towards
     * the poles) to approximate the orthogonally-separable blur. It is least
     * accurate at the poles, but still does a decent job.
     */
    private [$blur];
    private [$halfBlur];
}
export {};
