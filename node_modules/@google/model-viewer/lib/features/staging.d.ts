import ModelViewerElementBase from '../model-viewer-base.js';
import { Constructor } from '../utilities.js';
export declare const AUTO_ROTATE_DELAY_DEFAULT = 3000;
export interface StagingInterface {
    autoRotate: boolean;
}
export declare const StagingMixin: <T extends Constructor<ModelViewerElementBase>>(ModelViewerElement: T) => Constructor<StagingInterface> & T;
