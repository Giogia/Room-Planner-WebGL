'use strict';

import _ from 'lodash';

import Graph from "graph.js/dist/graph.es6";
import {hide} from "./view";
import {scene} from "./app";
import {loadJson, saveJson} from "./loader";
import Column from "./primitives/Column";
import Wall from "./primitives/Wall";
import Point from "./primitives/Point";
import Line from "./primitives/Line";
import Vector from "./maths/Vector";
import Shape from "./primitives/Shape";
//import {addText} from "./draw";

let inside = require("point-in-polygon");

export const DEPTH = 0.05;
export const HEIGHT = 1.3;

export let floorPlan;
export let drawModel, floorModel, wallsModel, skirtingModel;

export async function createModel (){

    floorPlan = await loadJson('floorPlan');

    drawModel = createDrawModel();
    scene.add(drawModel);
    hide(drawModel);

    floorModel = createFloorModel();
    scene.add(floorModel);

    skirtingModel = createWallsModel(true);
    scene.add(skirtingModel);

    wallsModel = createWallsModel();
    scene.add(wallsModel);

    //await saveJson('floorPlan', floorPlan);
}


export function createDrawModel () {

    let points = getPointModels(floorPlan.points);
    let walls = getLineModels(floorPlan);

    let group = [];

    _.each(points, point => group.push(point));
    _.each(walls, wall => group.push(wall));

    /*_.each(floorPlan.walls, wall => {

      let distanceX = wall.to.x - wall.from.x;
      let distanceZ = wall.to.z - wall.from.z;

      let x = (wall.from.x + wall.to.x)/2;
      let z = (wall.from.z + wall.to.z)/2;

      // Move text from line position a little bit
      const move = 0.2;

      if(distanceX === 0){ x = x + move}
      if(distanceZ === 0){ z = z + move}
      if(distanceX !== 0 && distanceZ !== 0 ){
          x = x - Math.sign(distanceZ) * move;
          z = z + Math.sign(distanceX) * move;
      }

      let message = (Math.floor(Math.hypot(distanceX, distanceZ)*10)/10).toString() + 'm';

      let text = addText(message, x, 0, z);
      group.push(text);
    });
    */

  return group;
}

export function createWallsModel (skirting=false) {

    let columns = getColumnsModels(floorPlan.points, skirting);
    let walls = getWallsModels(floorPlan, skirting);

    let group = [];

    _.each(walls, (wall) => group.push(wall));
    _.each(columns, (column) => group.push(column));

    return group;
}


function getPointModels (points) {
  return _.map(points, ({x, z, selected}) => {

      let mesh = new Point();

      if(selected) mesh.setColor('#4d8dff');

      mesh.position.set(x, 0, z);

      return mesh;
  });
}

function getLineModels ({walls, points}) {
    return _.map(walls, ({from, to}) => {

        let start = new Vector(from.x, 0, from.z);
        let end = new Vector(to.x, 0, to.z);

        return new Line(start, end);
    });
}

function getColumnsModels (points, skirting=false){
    return _.map(points, ({x, z})=> {

        let height = skirting? HEIGHT/20 : HEIGHT;
        let depth = skirting? 1.2 * DEPTH : DEPTH;

        let mesh = new Column(height, depth/2);

        mesh.position.set(x, height/2, z);

        return mesh;
    });
}

function getWallsModels ({walls, points}, skirting=false) {
    return _.map(walls, ({from, to}) => {

        let startPoint = _.find(points, {x:from.x, z:from.z});
        let endPoint = _.find(points, {x:to.x, z:to.z});
        let width = Math.hypot(from.x - to.x, from.z - to.z);

        let height = skirting? HEIGHT/20 : HEIGHT;
        let depth = skirting? 1.2 * DEPTH : DEPTH;

        let mesh = new Wall(width, height, depth);

        if(!skirting){
            let wall = _.find(floorPlan.walls, {from: {x:from.x, z:from.z}, to: {x:to.x, z:to.z}});

            if(wall.texture !== undefined){
                mesh.setTexture( wall.texture, [width,1]);
                wall.mesh = mesh.uuid;
            }
            if(wall.texture === undefined){
                mesh.setTexture( 'plaster', [width,1]);
                wall.mesh = mesh.uuid;
                wall.texture = 'plaster';
            }
        }

        if(skirting){
            mesh.setTexture('wood2', [width,height])
        }

        let offsetX = startPoint.x - endPoint.x;
        let offsetZ = startPoint.z - endPoint.z;
        let angle = -Math.atan(offsetZ / offsetX);

        mesh.position.set(endPoint.x + offsetX / 2, height / 2, endPoint.z + offsetZ / 2);
        mesh.rotation.rotateY(angle);

        return mesh;
    });
}

export function createFloorModel() {

    let graph = new Graph();
    let points = floorPlan.points;
    let walls = floorPlan.walls;

    // Create Graph adding Nodes and both sides Edges
    _.each(points, point => graph.addVertex(points.indexOf(point), {value: 1}));

    _.each(walls, wall => graph.addEdge(
        points.indexOf(_.find(points, {x:wall.from.x, z:wall.from.z})),
        points.indexOf(_.find(points, {x:wall.to.x, z:wall.to.z})),
        { value:1}));

    _.each(walls, wall => graph.addEdge(
        points.indexOf(_.find(points, {x:wall.to.x, z:wall.to.z})),
        points.indexOf(_.find(points, {x:wall.from.x, z:wall.from.z})),
        { value:1}));

    let cycles = [];
    let rooms = [];

    // remove 2 points loops
    for (let cycle of graph.cycles()){
        if(cycle.length>2){
          cycles.push(cycle)
        }
    }

    // remove loops containing other loops
    for (let i=0; i<cycles.length; i++) {

        let contained = false;
        for (let j = i + 1; j < cycles.length; j++) {
            if (cycles[j].every(val => cycles[i].includes(val))) {
                contained = true;
                break;
            }
        }
        if (!contained) {
            rooms.push(cycles[i]);
        }
    }

    let floor = [];
    let centers = [];

    // Filter rooms containing other rooms
    for( let room of rooms){

        let shape = new Shape();
        for( let point of room) shape.points.push(new Vector(points[point].x, 0.0, points[point].z));

        let center = shape.getCenter();
        let overlapped = false;

        for( let room2 of rooms) {

            if(room !== room2 && room.length >= room2.length){

                let polygon = [];
                _.each(room2, point => { polygon.push([points[point].x, points[point].z])});

                if (inside([center.x, center.z], polygon)) {
                    overlapped = true;
                    break;
                }
            }
        }

        if(!overlapped){

            let mesh = shape.getMesh();

            let existingRoom = _.find(floorPlan.rooms, {center: center});

            if(existingRoom){
                mesh.setTexture(existingRoom.texture, [2,2]);
                existingRoom.mesh = mesh.uuid;
            }
            if(!existingRoom){
                mesh.setTexture( 'wood2', [2,2]);
                floorPlan.rooms.push({center:center, mesh:mesh.uuid, texture:'wood2'});
            }

            //mesh.rotateX(Math.PI/2);
            floor.push(mesh);
            centers.push(center);
        }
    }

    // Remove non existing rooms from floorPlan model
    for(let room of floorPlan.rooms){
        if(!_.find(centers, {x: room.center.x, y: room.center.z, z: room.center.y,})){
            _.remove(floorPlan.rooms, discard =>{ return discard === room })
        }
    }

    /*
    let centersGroup = [];
    _.each(getPointModels(centers), (wall) => centersGroup.push(wall));
     */

    return floor;
}


export async function updateScene(){

    scene.remove(drawModel);
    drawModel = createDrawModel();
    scene.add(drawModel);

    //await saveJson('floorPlan', floorPlan);
}


export function updateModel(){

    scene.remove(floorModel);
    floorModel = createFloorModel();

    scene.add(floorModel);
    hide(floorModel);

    scene.remove(wallsModel);
    wallsModel = createWallsModel();
    scene.add(wallsModel);
    hide(wallsModel);

    scene.remove(skirtingModel);
    skirtingModel = createWallsModel(true);
    scene.add(skirtingModel);
    hide(skirtingModel);
}



