import ModelViewerElementBase from './model-viewer-base.js';
export declare const ModelViewerElement: import("./utilities.js").Constructor<import("./features/magic-leap.js").MagicLeapInterface> & import("./utilities.js").Constructor<import("./features/staging.js").StagingInterface> & import("./utilities.js").Constructor<import("./features/environment.js").EnvironmentInterface> & import("./utilities.js").Constructor<import("./features/controls.js").ControlsInterface> & import("./utilities.js").Constructor<import("./features/ar.js").ARInterface> & import("./utilities.js").Constructor<import("./features/loading.js").LoadingInterface> & import("./utilities.js").Constructor<import("./features/animation.js").AnimationInterface> & typeof ModelViewerElementBase;
export declare type ModelViewerElement = InstanceType<typeof ModelViewerElement>;
declare global {
    interface HTMLElementTagNameMap {
        'model-viewer': ModelViewerElement;
    }
}
