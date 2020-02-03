# three-map-controls
Map Controls class for ThreeJS; pan and zoom with respect to a ThreeJS [_Plane_](https://threejs.org/docs/#api/en/math/Plane) or [_Sphere_](https://threejs.org/docs/#api/en/math/Sphere).

The aim of this library is to provide a ThreeJS-compatible interface by which a user can interact with a map, either two-dimensonal (a plane) or three-dimensonal (a sphere). The controls provided are meant to behave in the most _natural_ way possible for cartographic navigation; e.g. panning the map by dragging the mouse should keep the same point under the cursor as the map moves. 
## Usage

```javascript
import MapControls from '@windfish-studio/three-map-controls'

const radius = 6.0;
new MapControls( camera, renderer.domElement, {
    mode: 'sphere',
    target: new Sphere(new THREE.Vector3(0,0,0), radius),
    minDistance: 2.0,
    maxDistance: 20
});
```

Here's a [JSFiddle demo](https://jsfiddle.net/sikanrong/m8c250o2/).


## Change Log

#### v1.1.3 - Jun 07 2019

Lots of big changes in the latest version, namely supporting a spherical target mode (e.g. a globe instead of a 2D map). 

As well, v1.1.3 introduces a _targetAreaVisible()_ function which returns the currently-visible portion of the map, in world coordinates. 

In spherical mode, _targetAreaVisible()_ returns a bounding box in spherical coordinates (theta and phi, in radians). Translating these coordinates to degrees will yield a latitude-longitude bounding box. 

These changes are reflected in the tests, which now use the Ava testing framework. As well, the [jsfiddle demo](https://jsfiddle.net/sikanrong/m8c250o2/) has been updated to show off the new functionality.

#### v1.0.1 - May 19 2018

Update the project to use ES6-style classes and function scoping features. Removes previous ES6 compatability hacks. Switches out browserify for webpack. Packages demo and test bundles with webpack, moving test
suite to the client. 

Finally adding a universal zoomToFit(mesh) function which optimally fills the screen with a given geometry by dollying the camera towards or away from it. 

Adjust the relationship of pan/dolly Vector math within update(). 

## API

### Member Variables


#### target: Plane | Sphere
Must be set to instance of threejs Plane or Sphere. *required*
```javascript
mapControls.target = new Sphere(new Vector3(0,0,0), 5);
```

#### mode: string
Must either be set to 'sphere' or 'plane'. *required*
```javascript
mapControls.mode = 'sphere';
```

#### enabled: boolean
Set to false to disable all input events.
```javascript
mapControls.enabled = true;
```

#### min/maxDistance: number
How far you can dolly the camera in and out from the target geometry. 
```javascript
mapControls.minDistance = 1; //probably should never be 0
mapControls.maxDistance = 100;
```

#### enableZoom: boolean
Set to false to disable all camera-dolly events.
```javascript
mapControls.enableZoom = true; 
```

#### zoomSpeed: number
Set speed of camera dolly; how fast the camera will move towards the target geometry on mousewheel events
```javascript
mapControls.zoomSpeed = 3.0; 
```

#### zoomDampingAlpha: number
Set the damping of the dolly movement; makes the camera dolly movement feel smoother.
```javascript
mapControls.zoomDampingAlpha = 0.1; 
```

#### enablePan: boolean
Set to false to disable camera pan inputs. In 'sphere' mode, this disables rotation of the camera about the sphere.
```javascript
mapControls.enablePan = true;
```

#### panDampingAlpha: number
Sets the damping of the pan movement; makes camera pan movement feel smoother.
```javascript
mapControls.panDampingAlpha = 0.2;
```

#### enableKeys: boolean
Enable/disable keyboard input
```javascript
mapControls.enableKeys = true;
```

#### keyPanSpeed: number
Define how fast the camera should pan for each keypress. Everything on the screen should move this many pixels per kepress.
```javascript
mapControls.keyPanSpeed = 12.0; 
```

#### keys: object
Define the keyboard char-codes which map to each pan movement.
```javascript
mapControls.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
```
#### mouseButtons: object
Define the mouse buttons and what action each one is mapped to. (Note: all values are from the threejs MOUSE enumeration)
```javascript
mapControls.mouseButtons = { ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
```

#### Member Functions

#### getZoomAlpha(void): number
returns current zoom value as a range between 0 and 1; zero represents the camera at mapControls.maxDistance from the target geometry (plane or sphere), and 1 is the camera at mapControls.maxDistance.
```javascript
mapControls.getZoomAlpha();
```

#### update(void): void
Called on each animation frame, updates all of the internal calculations and the camera position/lookAt vectors. 
```javascript
mapControls.update();
```

#### targetAreaVisible(void): [Box3](https://threejs.org/docs/#api/en/math/Box3)
Returns the bounding box which defines the currently-visible area of the map, in world coordinates. 

In spherical mode, returns a bounding box in spherical coordinates (Θ and φ; in radians). Translating these coordinates to degrees will yield a latitude-longitude bounding box. 
```javascript
mapControls.update();
```

#### zoomToFit(mesh: [Object3D](https://threejs.org/docs/#api/en/core/Object3D), center?: [Vector3](https://threejs.org/docs/#api/en/core/Vector3),  dims?: [Vector2](https://threejs.org/docs/#api/en/core/Vector2)): void
Will make the camera reposition itself to best fit **mesh** to the visible screen area.

The **center** and **dims** parameters refer to the center and dimensions of **mesh** _relative to the projection_. By default the function will attempt to infer these values from the boundingSphere of the mesh. However, this will result in a less exact fit of the object to the visible screen area; e.g. the algorithm will leave bigger margins between the edge of the screen and the mesh. 

## TODO

- Add typescript type definitions. 
- Add JSDoc documentation

## Testing
```bash
npm run test
```
```
TAP version 13
# shouldn't allow initialization if camera intersects plane
ok 1 - shouldn't allow initialization if camera intersects plane
# should correctly determine the camera orientation to the target plane
ok 2 - should correctly determine the camera orientation to the target plane
# should initialize with cam at controls.maxDistance by default
ok 3 - should initialize with cam at controls.maxDistance by default
# shouldn't move from initial position if no input received
ok 4 - shouldn't move from initial position if no input received
# should automatically orient camera towards plane based on starting position
ok 5 - should automatically orient camera towards plane based on starting position
# should lerp camera towards target plane on mousewheel
ok 6 - should lerp camera towards target plane on mousewheel
# should stop zooming at minDistance from target plane
ok 7 - should stop zooming at minDistance from target plane
# reset should revert camera to correct initial position
ok 8 - reset should revert camera to correct initial position
# should zoom into mouse pointer
ok 9 - should zoom into mouse pointer
# mouse should keep same world coordinates under it during camera pan (pan calibration)
ok 10 - mouse should keep same world coordinates under it during camera pan (pan calibration)
# initialZoom parameter should set the default cam position correctly
ok 11 - initialZoom parameter should set the default cam position correctly
# pan calibration should hold true when zoomed in
ok 12 - pan calibration should hold true when zoomed in
# sphere camera should return correct targetVisibleArea
ok 13 - sphere camera should return correct targetVisibleArea
# sphere camera should return correct targetVisibleArea on zoom
ok 14 - sphere camera should return correct targetVisibleArea on zoom
# sphere camera should maintain distance from sphere as it rotates around
ok 15 - sphere camera should maintain distance from sphere as it rotates around
# sphere test rotation calibration; when rotated the point on the sphere should stay under the cursor
ok 16 - sphere test rotation calibration; when rotated the point on the sphere should stay under the cursor
# sphere test zoom out stops at correct distance from sphere
ok 17 - sphere test zoom out stops at correct distance from sphere

1..17
# tests 17
# pass 17
# fail 0
```
