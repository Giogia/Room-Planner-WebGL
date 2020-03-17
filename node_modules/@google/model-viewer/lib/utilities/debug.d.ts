import { WebGLRenderTarget } from 'three';
import { ModelScene } from '../three-components/ModelScene';
/**
 * Renders a box representing the shadow camera, which is helpful in
 * debugging.
 */
export declare const showShadowHelper: (scene: ModelScene) => void;
/**
 * Debug method to save an offscreen render target to an image; filename should
 * have a .png extension to ensure lossless transmission.
 */
export declare const saveTarget: (target: WebGLRenderTarget, filename: string) => void;
