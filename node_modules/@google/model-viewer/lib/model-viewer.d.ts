import ModelViewerElementBase from './model-viewer-base.js';
export declare const ModelViewerElement: {
    new (...args: any[]): import("./features/scene-graph.js").SceneGraphInterface;
    prototype: import("./features/scene-graph.js").SceneGraphInterface;
} & object & {
    new (...args: any[]): import("./features/magic-leap.js").MagicLeapInterface;
    prototype: import("./features/magic-leap.js").MagicLeapInterface;
} & {
    new (...args: any[]): import("./features/annotation.js").AnnotationInterface;
    prototype: import("./features/annotation.js").AnnotationInterface;
} & {
    new (...args: any[]): import("./features/staging.js").StagingInterface;
    prototype: import("./features/staging.js").StagingInterface;
} & {
    new (...args: any[]): import("./features/environment.js").EnvironmentInterface;
    prototype: import("./features/environment.js").EnvironmentInterface;
} & {
    new (...args: any[]): import("./features/controls.js").ControlsInterface;
    prototype: import("./features/controls.js").ControlsInterface;
} & {
    new (...args: any[]): import("./features/ar.js").ARInterface;
    prototype: import("./features/ar.js").ARInterface;
} & {
    new (...args: any[]): import("./features/loading.js").LoadingInterface;
    prototype: import("./features/loading.js").LoadingInterface;
} & import("./features/loading.js").LoadingStaticInterface & {
    new (...args: any[]): import("./features/animation.js").AnimationInterface;
    prototype: import("./features/animation.js").AnimationInterface;
} & typeof ModelViewerElementBase;
export declare type ModelViewerElement = InstanceType<typeof ModelViewerElement>;
declare global {
    interface HTMLElementTagNameMap {
        'model-viewer': ModelViewerElement;
    }
}
