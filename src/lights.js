'use strict';

import * as THREE from 'three';
import {scene} from './app';

export let hemisphere, directional;

export function addLights(){

    hemisphere = new THREE.HemisphereLight(0xffffff, 0x444455, 0.7);
    hemisphere.position.set(0, 20, 0);
    scene.add( hemisphere );

    directional = new THREE.DirectionalLight( 0xffffff, 1 );
    directional.position.set( 10, 20, - 10 );
    directional.castShadow = true;
    directional.shadow.camera.top = 10;
    directional.shadow.camera.bottom = - 10;
    directional.shadow.camera.left = - 10;
    directional.shadow.camera.right = 10;
    directional.shadow.camera.near = 0.1;
    directional.shadow.camera.far = 100;
    scene.add( directional );

    directional.intensity = 0.5;
    directional.position.set( -5, 20, 5 );
    scene.add(directional);
}