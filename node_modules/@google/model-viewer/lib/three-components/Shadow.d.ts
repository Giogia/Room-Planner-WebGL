import { DirectionalLight, Object3D } from 'three';
import Model from './Model';
/**
 * The Shadow class creates a shadow that fits a given model and follows a
 * target. This shadow will follow the model without any updates needed so long
 * as the shadow and model are both parented to the same object (call it the
 * pivot) and this pivot is passed as the target parameter to the shadow's
 * constructor. We also must constrain the pivot to motion within the horizontal
 * plane and call the setRotation() method whenever the pivot's Y-axis rotation
 * changes. For motion outside of the horizontal plane, this.needsUpdate must be
 * set to true.
 *
 * The softness of the shadow is controlled by changing its resolution, making
 * softer shadows faster, but less precise.
 */
export declare class Shadow extends DirectionalLight {
    private model;
    private shadowMaterial;
    private floor;
    private boundingBox;
    private size;
    needsUpdate: boolean;
    constructor(model: Model, target: Object3D, softness: number);
    setModel(model: Model, softness: number): void;
    setSoftness(softness: number): void;
    setMapSize(maxMapSize: number): void;
    setIntensity(intensity: number): void;
    getIntensity(): number;
    setRotation(radiansY: number): void;
}
