import ModelViewerElementBase from '../model-viewer-base.js';
import { Constructor } from '../utilities.js';
export interface AnimationInterface {
    autoplay: boolean;
    animationName: string | void;
    animationCrossfadeDuration: number;
    readonly availableAnimations: Array<string>;
    readonly paused: boolean;
    currentTime: number;
    pause(): void;
    play(): void;
}
export declare const AnimationMixin: <T extends Constructor<ModelViewerElementBase>>(ModelViewerElement: T) => Constructor<AnimationInterface> & T;
