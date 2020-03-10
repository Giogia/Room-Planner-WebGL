import { Camera, Matrix4, Object3D } from 'three';
/**
 * The Reticle class creates an object that repeatedly calls
 * `xrSession.requestHitTest()` to render a ring along a found
 * horizontal surface.
 */
export default class Reticle extends Object3D {
    private ring;
    private camera;
    private hitTestSource;
    private hitTestSourceRequest;
    private _hitMatrix;
    /**
     * @param {XRSession} xrSession
     * @param {THREE.Camera} camera
     */
    constructor(camera: Camera);
    readonly hitMatrix: Matrix4 | null;
    /**
     * Fires a hit test in the middle of the screen and places the reticle
     * upon the surface if found.
     *
     * @param {XRFRame} frame
     * @param {XRFrameOfReference} frameOfRef
     */
    update(_session: XRSession, _frame: XRFrame, _viewerReferenceSpace: XRReferenceSpace, _frameOfRef: XRReferenceSpace): Promise<void>;
}
