# three-controls
ThreeJS controls as standalone

# how to use

## install

```javscript
npm install three-controls --save
```

## use

```javascript
import * as ThreeControls from 'three-controls'

let orbit = new ThreeControls.OrbitControls(camera, domElement)


function render() {
  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
```

or you can use like this

```javascript
import {OrbitControls} from 'three-controls'

let orbit = new OrbitControls(camera, domElement)


function render() {
  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
```
