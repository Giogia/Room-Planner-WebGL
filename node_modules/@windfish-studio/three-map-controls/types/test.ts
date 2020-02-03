import MapControls from 'three-map-controls';
import { PerspectiveCamera, Sphere, Plane, Vector3, Box2, MOUSE, Box3 } from "three";

const camera = new PerspectiveCamera();
const element = new Element();

let controls: MapControls = new MapControls(camera, element, { mode: "foo" }); // $ExpectError
controls = new MapControls(camera, element, { foo: "bar" }); // $ExpectError

controls = new MapControls(camera, element, { target: new Box3()}); // $ExpectError
controls = new MapControls(camera, element, { target: new Plane(new Vector3(0, 0, 0), 0)}); // $ExpectError

// $ExpectType MapControls
controls = new MapControls(camera, element, { mode: "plane", target: new Sphere(new Vector3(0, 0, 0), 5) });

// $ExpectType MapControls
controls = new MapControls(camera, element, {
    mode: "plane",
    target: new Sphere(new Vector3(0, 0, 0), 5),
    maxDistance: 5
});

controls.getZoomAlpha(); // $ExpectType number
controls.targetAreaVisible(); // $ExpectType Box2

controls.mouseButtons = {PAN: MOUSE.RIGHT};

controls.mouseButtons = {FOO: "BAR"}; // $ExpectError
controls.mouseButtons = {FOO: MOUSE.LEFT}; // $ExpectError

controls.keys = {PAN_UP: "ArrowUp"};
controls.keys = {FOO: 1}; // $ExpectError