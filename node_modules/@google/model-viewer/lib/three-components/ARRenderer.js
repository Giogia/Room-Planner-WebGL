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
var _a, _b, _c, _d, _e, _f;
import { EventDispatcher, Matrix4, Object3D, PerspectiveCamera, Raycaster, Scene, Vector3 } from 'three';
import { assertIsArCandidate } from '../utilities.js';
import Reticle from './Reticle.js';
import { assertContext } from './WebGLUtils.js';
const $presentedScene = Symbol('presentedScene');
const $rafId = Symbol('rafId');
const $currentSession = Symbol('currentSession');
const $tick = Symbol('tick');
const $refSpace = Symbol('refSpace');
const $resolveCleanup = Symbol('resolveCleanup');
const $outputContext = Symbol('outputContext');
const $onWebXRFrame = Symbol('onWebXRFrame');
const $postSessionCleanup = Symbol('postSessionCleanup');
const matrix4 = new Matrix4();
const vector3 = new Vector3();
export class ARRenderer extends EventDispatcher {
    constructor(parentRenderer) {
        super();
        this.camera = new PerspectiveCamera();
        this.scene = new Scene();
        this.dolly = new Object3D();
        this.reticle = new Reticle(this.camera);
        this.raycaster = null;
        this[_a] = null;
        this[_b] = null;
        this[_c] = null;
        this[_d] = null;
        this[_e] = null;
        this[_f] = null;
        const inputContext = parentRenderer.context;
        // The parentRenderer is a Renderer object which has-a ARRenderer. We need
        // to save a reference so we can restore state once the AR session is done.
        this.parentRenderer = parentRenderer;
        // this.renderer is a three.js WebGLRenderer, it is shared with the parent
        // Renderer.
        this.renderer = parentRenderer.renderer;
        this.inputContext = inputContext;
        this.camera.matrixAutoUpdate = false;
        this.scene.add(this.reticle);
        this.scene.add(this.dolly);
    }
    initializeRenderer() {
        this.renderer.setPixelRatio(1);
    }
    async resolveARSession() {
        assertIsArCandidate();
        const session = await navigator.xr.requestSession('immersive-ar');
        const gl = assertContext(this.renderer.getContext());
        // `makeXRCompatible` replaced `setCompatibleXRDevice` in Chrome M73 @TODO
        // #293, handle WebXR API changes. WARNING: this can cause a GL context
        // loss according to the spec, though current implementations don't do so.
        await gl.makeXRCompatible();
        this[$outputContext] = gl;
        session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl, { alpha: true }) });
        // The render state update takes effect on the next animation frame. Wait
        // for it so that we get a framebuffer.
        let waitForAnimationFrame = new Promise((resolve, _reject) => {
            session.requestAnimationFrame(() => resolve());
        });
        await waitForAnimationFrame;
        // Redirect rendering to the WebXR offscreen framebuffer.
        // TODO: this method should be added to three.js's exported interface.
        this.renderer
            .setFramebuffer(session.renderState.baseLayer.framebuffer);
        this.renderer.setSize(session.renderState.baseLayer.framebufferWidth, session.renderState.baseLayer.framebufferHeight, false);
        return session;
    }
    /**
     * The currently presented scene, if any
     */
    get presentedScene() {
        return this[$presentedScene];
    }
    /**
     * Resolves to true if the renderer has detected all the necessary qualities
     * to support presentation in AR.
     */
    async supportsPresentation() {
        try {
            assertIsArCandidate();
            await navigator.xr.supportsSession('immersive-ar');
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Present a scene in AR
     */
    async present(scene) {
        if (this.isPresenting) {
            console.warn('Cannot present while a model is already presenting');
        }
        scene.model.scale.set(1, 1, 1);
        this[$presentedScene] = scene;
        this.initializeRenderer();
        this[$currentSession] = await this.resolveARSession();
        this[$currentSession].addEventListener('end', () => {
            this[$postSessionCleanup]();
        }, { once: true });
        // `requestReferenceSpace` replaced `requestFrameOfReference` in Chrome M73
        // @TODO #293, handle WebXR API changes
        this[$refSpace] =
            await this[$currentSession].requestReferenceSpace('local');
        this[$tick]();
    }
    /**
     * If currently presenting a scene in AR, stops presentation and exits AR.
     */
    async stopPresenting() {
        if (!this.isPresenting) {
            return;
        }
        const cleanupPromise = new Promise((resolve) => {
            this[$resolveCleanup] = resolve;
        });
        try {
            const session = this[$currentSession];
            this[$currentSession] = null;
            session.cancelAnimationFrame(this[$rafId]);
            await session.end();
            await cleanupPromise;
        }
        catch (error) {
            console.warn('Error while trying to end AR session');
            console.warn(error);
            this[$postSessionCleanup]();
        }
    }
    [(_a = $outputContext, _b = $rafId, _c = $currentSession, _d = $refSpace, _e = $presentedScene, _f = $resolveCleanup, $postSessionCleanup)]() {
        // The offscreen WebXR framebuffer is now invalid, switch
        // back to the default framebuffer for canvas output.
        // TODO: this method should be added to three.js's exported interface.
        this.renderer.setFramebuffer(null);
        // Trigger a parent renderer update. TODO(klausw): are these all
        // necessary and sufficient?
        if (this[$presentedScene] != null) {
            this.dolly.remove(this[$presentedScene]);
            this[$presentedScene].isDirty = true;
        }
        // The parentRenderer's render method automatically updates
        // the device pixel ratio, but only updates the three.js renderer
        // size if there's a size mismatch. Reset the size to force that
        // to refresh.
        this.parentRenderer.setRendererSize(1, 1);
        this[$refSpace] = null;
        this[$presentedScene] = null;
        if (this[$resolveCleanup] != null) {
            this[$resolveCleanup]();
        }
    }
    /**
     * True if a scene is currently in the process of being presented in AR
     */
    get isPresenting() {
        return this[$presentedScene] != null;
    }
    get outputContext() {
        return this[$outputContext];
    }
    async placeModel() {
        if (this[$currentSession] == null) {
            return;
        }
        if (this.raycaster == null) {
            this.raycaster = new Raycaster();
        }
        // NOTE: Currently rays will be cast from the middle of the screen.
        // Eventually we might use input coordinates for this.
        this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);
        const ray = this.raycaster.ray;
        let xrray = new XRRay(ray.origin, ray.direction);
        let hits;
        try {
            hits = await this[$currentSession]
                .requestHitTest(xrray, this[$refSpace]);
        }
        catch (e) {
            // Spec says this should no longer throw on invalid requests:
            // https://github.com/immersive-web/hit-test/issues/24
            // But in practice, it will still happen, so just ignore:
            // https://github.com/immersive-web/hit-test/issues/37
        }
        if (hits && hits.length) {
            const presentedScene = this[$presentedScene];
            const hit = hits[0];
            const hitMatrix = matrix4.fromArray(hit.hitMatrix);
            this.dolly.position.setFromMatrixPosition(hitMatrix);
            // Orient the dolly/model to face the camera
            const camPosition = vector3.setFromMatrixPosition(this.camera.matrix);
            this.dolly.lookAt(camPosition.x, this.dolly.position.y, camPosition.z);
            this.dolly.rotateY(-presentedScene.pivot.rotation.y);
            this.dolly.add(presentedScene);
            this.dispatchEvent({ type: 'modelmove' });
        }
    }
    /**
     * It appears that XRSession's `inputsourceschange` event is not implemented
     * in Chrome Canary as of m72 for 'screen' inputs, which would be preferable
     * since we only need an "select" event, rather than track a pose on every
     * frame (like a 6DOF controller). Due to this bug, on every frame, check to
     * see if an input exists.
     * @see https://bugs.chromium.org/p/chromium/issues/detail?id=913703
     * @see https://immersive-web.github.io/webxr/#xrinputsource-interface
     */
    processXRInput(frame) {
        const { session } = frame;
        // Get current input sources. For now, only 'screen' input is supported,
        // which is only added to the session's active input sources immediately
        // before `selectstart` and removed immediately after `selectend` event.
        // If we have a 'screen' source here, it means the output canvas was tapped.
        const sources = Array.from(session.inputSources)
            .filter(input => input.targetRayMode === 'screen');
        if (sources.length === 0) {
            return;
        }
        const pose = frame.getPose(sources[0].targetRaySpace, this[$refSpace]);
        if (pose) {
            this.placeModel();
        }
    }
    [$tick]() {
        this[$rafId] = this[$currentSession].requestAnimationFrame((time, frame) => this[$onWebXRFrame](time, frame));
    }
    [$onWebXRFrame](_time, frame) {
        const { session } = frame;
        // `getViewerPose` replaced `getDevicePose` in Chrome M73
        // @TODO #293, handle WebXR API changes
        const pose = 'getDevicePose' in frame ?
            frame.getDevicePose(this[$refSpace]) :
            frame.getViewerPose(this[$refSpace]);
        // TODO: Notify external observers of tick
        // TODO: Note that reticle may be "stabilized"
        this[$tick]();
        if (pose == null) {
            return;
        }
        for (const view of frame.getViewerPose(this[$refSpace]).views) {
            const viewport = session.renderState.baseLayer.getViewport(view);
            this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
            this.camera.projectionMatrix.fromArray(view.projectionMatrix);
            const viewMatrix = matrix4.fromArray(view.transform.inverse.matrix);
            this.camera.matrix.getInverse(viewMatrix);
            this.camera.updateMatrixWorld(true);
            // NOTE: Updating input or the reticle is dependent on the camera's
            // pose, hence updating these elements after camera update but
            // before render.
            this.reticle.update(this[$currentSession], this[$refSpace]);
            this.processXRInput(frame);
            // NOTE: Clearing depth caused issues on Samsung devices
            // @see https://github.com/googlecodelabs/ar-with-webxr/issues/8
            // this.renderer.clearDepth();
            this.renderer.render(this.scene, this.camera);
        }
    }
}
//# sourceMappingURL=ARRenderer.js.map