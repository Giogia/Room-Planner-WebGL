'use strict';

import {camera, scene} from './app';

import {draggableObjects} from "./controls";
import GlbParser from "./glb/glbParser.js"
import GlbLoader from "./glb/glbLoader.js";
import utils from "./maths/Utils";

// let jsonUrl = 'http://localhost:3000/';
let jsonUrl = 'http://room-planner-webgl.herokuapp.com/';


export async function loadJson(name){

    let response = await fetch(jsonUrl + name.toString());
    return (await response).json();
}


export async function saveJson(name, data){

    await fetch(jsonUrl + name.toString(),
    {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
}


export async function importGlb(name){

    let path  = './models/furniture/' + name + '.glb';
    let parser = new GlbParser();
    let loader = new GlbLoader();

    let data = await fetch(path).then( response => response.arrayBuffer());

    let glb = parser.extractGlbData(data);

    return loader.load(glb);
}


export async function importModel(name, x= camera.position.x/5, y= 0.0, z= camera.position.z/5, angle= 0) {

    let model = await importGlb(name);

    model.name = name;
    model.position.set(x, y, z);
    model.rotation.rotateY(utils.degToRad(angle));

    scene.add(model);
    draggableObjects.push(model);

    return model
}










