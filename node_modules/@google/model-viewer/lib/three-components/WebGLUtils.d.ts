export declare const assertContext: (context: WebGLRenderingContext | null) => WebGLRenderingContext;
export declare const getContext: (canvas: HTMLCanvasElement | OffscreenCanvas, options: WebGLContextAttributes) => WebGLRenderingContext;
/**
 * Patch the values reported by WebGLRenderingContext's
 * extension store to fix compatibility issues.
 */
export declare const applyExtensionCompatibility: (gl: WebGLRenderingContext) => void;
