import { Camera, Object3D } from 'three';
/**
 * The Reticle class creates an object that repeatedly calls
 * `xrSession.requestHitTest()` to render a ring along a found
 * horizontal surface.
 */
export default class Reticle extends Object3D {
    private ring;
    private camera;
    private raycaster;
    /**
     * @param {XRSession} xrSession
     * @param {THREE.Camera} camera
     */
    constructor(camera: Camera);
    /**
     * Fires a hit test in the middle of the screen and places the reticle
     * upon the surface if found.
     *
     * @param {XRSession} session
     * @param {XRFrameOfReference} frameOfRef
     */
    update(session: XRSession, frameOfRef: XRFrameOfReference): Promise<void>;
}
