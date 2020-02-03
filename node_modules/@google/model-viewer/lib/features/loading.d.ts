import ModelViewerElementBase from '../model-viewer-base.js';
import { Constructor } from '../utilities.js';
export declare type RevealAttributeValue = 'auto' | 'interaction';
export declare const POSTER_TRANSITION_TIME = 300;
export declare const PROGRESS_BAR_UPDATE_THRESHOLD = 100;
export declare const $defaultProgressBarElement: unique symbol;
export declare const $defaultProgressMaskElement: unique symbol;
export declare const $posterContainerElement: unique symbol;
export declare const $defaultPosterElement: unique symbol;
export interface LoadingInterface {
    poster: string | null;
    reveal: RevealAttributeValue;
    preload: boolean;
    readonly loaded: boolean;
    readonly modelIsVisible: boolean;
    dismissPoster(): void;
}
/**
 * LoadingMixin implements features related to lazy loading, as well as
 * presentation details related to the pre-load / pre-render presentation of a
 * <model-viewer>
 */
export declare const LoadingMixin: <T extends Constructor<ModelViewerElementBase>>(ModelViewerElement: T) => Constructor<LoadingInterface> & T;
