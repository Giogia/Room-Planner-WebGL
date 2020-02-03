// TypeScript Version: 3.5

import {
    Box2,
    EventDispatcher,
    MOUSE,
    Object3D,
    PerspectiveCamera,
    Plane,
    Sphere,
    Vector2,
    Vector3
} from "three";

export enum KeyboardActions {
    PAN_UP,
    PAN_DOWN,
    PAN_LEFT,
    PAN_RIGHT,
    ZOOM_OUT,
    ZOOM_IN
}

export enum MouseActions {
    ZOOM,
    PAN
}

export enum MapMode {
    plane,
    sphere
}

export interface MapControlsRequiredOpts {
    target: MapControls['target'];
    mode: MapControls['mode'];
}

export default class MapControls extends EventDispatcher {
    constructor(
        camera: PerspectiveCamera,
        domElement: Element,
        options: MapControlsRequiredOpts & { [key in keyof MapControls]?: MapControls[key] }
    );

    camera: PerspectiveCamera;
    domElement: Element;
    enabled: boolean;
    target: Plane | Sphere;
    mode: keyof typeof MapMode;

    minDistance: number;
    maxDistance: number;
    enableZoom: boolean;
    zoomSpeed: number;
    zoomDampingAlpha: number;
    initialZoom: number;

    enablePan: boolean;
    panDampingAlpha: number;

    keyPanSpeed: number;
    keyZoomSpeed: number;
    enableKeys: boolean;

    keys: {[key in keyof typeof KeyboardActions]?: string};
    mouseButtons: {[key in keyof typeof MouseActions]?: MOUSE};

    getZoomAlpha(): number;
    reset(): void;
    update(): void;
    dispose(): void;

    zoomToFit(
        mesh: Object3D,
        center: Vector3,
        dims: Vector2
    ): void;

    targetAreaVisible(): Box2;
}
