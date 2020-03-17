declare interface OffscreenCanvas {
    getContext(contextId: 'webgl' | 'experimental-webgl', contextAttributes?: WebGLContextAttributes): WebGLRenderingContext | null;
}
declare interface Window {
    OffscreenCanvas?: Constructor<OffscreenCanvas>;
}
