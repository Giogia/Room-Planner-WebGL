import ModelViewerElementBase from '../model-viewer-base.js';
import { Constructor } from '../utilities.js';
/**
 * Takes a URL to a USDZ file and sets the appropriate fields so that Safari
 * iOS can intent to their AR Quick Look.
 */
export declare const openIOSARQuickLook: (usdzSrc: string) => void;
/**
 * Takes a URL and a title string, and attempts to launch Scene Viewer on the
 * current device.
 */
export declare const openSceneViewer: (gltfSrc: string, title: string, arScale: string) => void;
export declare type QuickLookBrowser = 'safari' | 'chrome';
export declare type ARMode = 'quick-look' | 'ar-viewer' | 'unstable-webxr' | 'none';
export declare interface ARInterface {
    ar: boolean;
    arScale: string;
    unstableWebxr: boolean;
    iosSrc: string | null;
    quickLookBrowsers: string;
    readonly canActivateAR: boolean;
    activateAR(): Promise<void>;
}
export declare const ARMixin: <T extends Constructor<ModelViewerElementBase, object>>(ModelViewerElement: T) => {
    new (...args: any[]): ARInterface;
    prototype: ARInterface;
} & object & T;
