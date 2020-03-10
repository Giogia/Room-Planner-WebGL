/* @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a, _b;
import { ACESFilmicToneMapping, EventDispatcher, GammaEncoding, PCFSoftShadowMap, WebGLRenderer } from 'three';
import { HAS_OFFSCREEN_CANVAS, IS_WEBXR_AR_CANDIDATE, OFFSCREEN_CANVAS_SUPPORT_BITMAP } from '../constants.js';
import { $tick } from '../model-viewer-base.js';
import { isDebugMode, resolveDpr } from '../utilities.js';
import { ARRenderer } from './ARRenderer.js';
import { Debugger } from './Debugger.js';
import TextureUtils from './TextureUtils.js';
import * as WebGLUtils from './WebGLUtils.js';
export const $arRenderer = Symbol('arRenderer');
const $onWebGLContextLost = Symbol('onWebGLContextLost');
const $webGLContextLostHandler = Symbol('webGLContextLostHandler');
const $singleton = Symbol('singleton');
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
export class Renderer extends EventDispatcher {
    constructor(options) {
        super();
        this.width = 0;
        this.height = 0;
        this.debugger = null;
        this.scenes = new Set();
        this[_b] = (event) => this[$onWebGLContextLost](event);
        const webGlOptions = { alpha: true, antialias: true };
        // Only enable certain options when Web XR capabilities are detected:
        if (IS_WEBXR_AR_CANDIDATE) {
            Object.assign(webGlOptions, { alpha: true, preserveDrawingBuffer: true });
        }
        if (HAS_OFFSCREEN_CANVAS && OFFSCREEN_CANVAS_SUPPORT_BITMAP) {
            this.canvas3D = new OffscreenCanvas(0, 0);
        }
        else {
            this.canvas3D = document.createElement('canvas');
        }
        this.canvas3D.addEventListener('webglcontextlost', this[$webGLContextLostHandler]);
        // Need to support both 'webgl' and 'experimental-webgl' (IE11).
        try {
            this.context3D = WebGLUtils.getContext(this.canvas3D, webGlOptions);
            // Patch the gl context's extension functions before passing
            // it to three.
            WebGLUtils.applyExtensionCompatibility(this.context3D);
            this.threeRenderer = new WebGLRenderer({
                canvas: this.canvas3D,
                context: this.context3D,
            });
            this.threeRenderer.autoClear = true;
            this.threeRenderer.outputEncoding = GammaEncoding;
            this.threeRenderer.gammaFactor = 2.2;
            this.threeRenderer.physicallyCorrectLights = true;
            this.threeRenderer.setPixelRatio(resolveDpr());
            this.threeRenderer.shadowMap.enabled = true;
            this.threeRenderer.shadowMap.type = PCFSoftShadowMap;
            this.threeRenderer.shadowMap.autoUpdate = false;
            this.debugger =
                options != null && !!options.debug ? new Debugger(this) : null;
            this.threeRenderer.debug = { checkShaderErrors: !!this.debugger };
            // ACESFilmicToneMapping appears to be the most "saturated",
            // and similar to Filament's gltf-viewer.
            this.threeRenderer.toneMapping = ACESFilmicToneMapping;
        }
        catch (error) {
            this.context3D = null;
            console.warn(error);
        }
        this[$arRenderer] = new ARRenderer(this);
        this.textureUtils =
            this.canRender ? new TextureUtils(this.threeRenderer) : null;
        this.setRendererSize(1, 1);
        this.lastTick = performance.now();
    }
    static get singleton() {
        return this[$singleton];
    }
    static resetSingleton() {
        this[$singleton].dispose();
        this[$singleton] = new Renderer({ debug: isDebugMode() });
    }
    get canRender() {
        return this.threeRenderer != null && this.context3D != null;
    }
    setRendererSize(width, height) {
        if (this.canRender) {
            this.threeRenderer.setSize(width, height, false);
        }
        this.width = width;
        this.height = height;
    }
    registerScene(scene) {
        this.scenes.add(scene);
        if (this.canRender && this.scenes.size > 0) {
            this.threeRenderer.setAnimationLoop((time) => this.render(time));
        }
        if (this.debugger != null) {
            this.debugger.addScene(scene);
        }
    }
    unregisterScene(scene) {
        this.scenes.delete(scene);
        if (this.canRender && this.scenes.size === 0) {
            this.threeRenderer.setAnimationLoop(null);
        }
        if (this.debugger != null) {
            this.debugger.removeScene(scene);
        }
    }
    async supportsPresentation() {
        return this.canRender && this[$arRenderer].supportsPresentation();
    }
    get presentedScene() {
        return this[$arRenderer].presentedScene;
    }
    async present(scene) {
        try {
            return await this[$arRenderer].present(scene);
        }
        catch (error) {
            await this[$arRenderer].stopPresenting();
            throw error;
        }
        finally {
            // NOTE(cdata): Setting width and height to 0 will have the effect of
            // invoking a `setSize` the next time we render in this threeRenderer
            this.width = this.height = 0;
        }
    }
    stopPresenting() {
        return this[$arRenderer].stopPresenting();
    }
    get isPresenting() {
        return this[$arRenderer] != null && this[$arRenderer].isPresenting;
    }
    render(t) {
        if (!this.canRender || this.isPresenting) {
            return;
        }
        const delta = t - this.lastTick;
        const dpr = resolveDpr();
        if (dpr !== this.threeRenderer.getPixelRatio()) {
            this.threeRenderer.setPixelRatio(dpr);
        }
        for (let scene of this.scenes) {
            const { element, width, height, context } = scene;
            element[$tick](t, delta);
            if (!scene.visible || !scene.isDirty || scene.paused) {
                continue;
            }
            const camera = scene.getCamera();
            if (width > this.width || height > this.height) {
                const maxWidth = Math.max(width, this.width);
                const maxHeight = Math.max(height, this.height);
                this.setRendererSize(maxWidth, maxHeight);
            }
            const { exposure, shadow } = scene;
            const exposureIsNumber = typeof exposure === 'number' && !self.isNaN(exposure);
            this.threeRenderer.toneMappingExposure =
                exposureIsNumber ? exposure : 1.0;
            const shadowNeedsUpdate = this.threeRenderer.shadowMap.needsUpdate;
            if (shadow != null) {
                this.threeRenderer.shadowMap.needsUpdate =
                    shadowNeedsUpdate || shadow.needsUpdate;
                shadow.needsUpdate = false;
            }
            // Need to set the render target in order to prevent
            // clearing the depth from a different buffer -- possibly
            // from something in
            this.threeRenderer.setRenderTarget(null);
            this.threeRenderer.setViewport(0, 0, width, height);
            this.threeRenderer.render(scene, camera);
            const widthDPR = width * dpr;
            const heightDPR = height * dpr;
            context.clearRect(0, 0, widthDPR, heightDPR);
            context.drawImage(this.threeRenderer.domElement, 0, this.canvas3D.height - heightDPR, widthDPR, heightDPR, 0, 0, widthDPR, heightDPR);
            scene.isDirty = false;
        }
        this.lastTick = t;
    }
    dispose() {
        if (this.textureUtils != null) {
            this.textureUtils.dispose();
        }
        if (this.threeRenderer != null) {
            this.threeRenderer.dispose();
        }
        this.textureUtils = null;
        this.threeRenderer = null;
        this.scenes.clear();
        this.canvas3D.removeEventListener('webglcontextlost', this[$webGLContextLostHandler]);
    }
    [(_a = $singleton, _b = $webGLContextLostHandler, $onWebGLContextLost)](event) {
        this.dispatchEvent({ type: 'contextlost', sourceEvent: event });
    }
}
Renderer[_a] = new Renderer({ debug: isDebugMode() });
//# sourceMappingURL=Renderer.js.map