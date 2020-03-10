import _ from 'lodash';

import {app, scene} from "./app";
import {floorPlan, updateModel, updateScene} from "./walls";

import {checkIntersection, colinearPointWithinSegment} from "line-intersect";
//import {font, textMaterial} from "./materials";

let currentLine;

export function editDrawing(event){

    let position = pointWorldPosition(event);
    let point = _.find(floorPlan.points,
        { x: Math.round(position.x * 4)/4, z: Math.round( position.z * 4)/4});

    if(point){
        selectPoint(point);
    }
    else{
        drawPoint(position);
    }
}


function selectPoint(point){

    let points = floorPlan.points;
    let selected = _.find(points,{ selected: true });

    // TODO use _.find
    //let point _.find(points,{ x: position.x, z: position.z });
    points[points.indexOf(point)].selected = !points[points.indexOf(point)].selected;
    updateScene();

    if(selected === undefined){

        app.addEventListener('mousemove', showLine, false);
        app.addEventListener('click', drawLine, false);
    }

    if(selected === point){

        app.removeEventListener( 'mousemove', showLine, false);
        app.removeEventListener('click', drawLine, false);
    }
}


function drawPoint(position){

    floorPlan.points.push(position);

    let walls = floorPlan.walls;

    // if it is drawn on one or more line those get split in two lines
    for(let intersecting of walls) {

        let start = intersecting.from;
        let end = intersecting.to;

        if (!(intersecting.from.x === position.x && intersecting.from.z === position.z) &&
            !(intersecting.to.x === position.x && intersecting.to.z === position.z)) {

            // check if points are collinear
            if ((end.z - start.z) * (position.x - start.x) === (end.x - start.x) * (position.z - start.z)) {
                if(colinearPointWithinSegment(position.x, position.z, start.x, start.z, end.x, end.z)){

                    walls.push({from: {x:position.x, z:position.z}, to: {x:start.x, z:start.z}});
                    walls.push({from: {x:position.x, z:position.z}, to: {x:end.x, z:end.z}});
                    _.remove(walls, wall => { return wall === intersecting });
                }
            }
        }
    }

    updateScene();
}


function showLine(event){

    let position = pointWorldPosition(event);
    let point = _.find(floorPlan.points,{ selected: true });

    let material = new LineMaterial({
        color: 0xe2a149,
        transparent: true,
        opacity: 0.3,
        linewidth: 0.007,
    });

    let geometry = new LineGeometry();
    geometry.setPositions([point.x, 0.02, point.z, position.x, 0.02, position.z]);

    scene.remove(currentLine);
    currentLine = new Line2(geometry, material);
    scene.add(currentLine);
}


function drawLine(event){

    let points = floorPlan.points;
    let walls = floorPlan.walls;

    let position = pointWorldPosition(event);
    let start = _.find(points, {selected: true});
    let end = _.find(points, {x:position.x, z:position.z});

    // fix to avoid drawing line from to same point.
    if(start === end){
        start = _.findLast(points, {selected: true});
    }

    scene.remove(currentLine);
    let newLine = {from: {x:start.x, z:start.z}, to: {x:end.x, z:end.z}};
    walls.push(newLine);
    for( let point of points){ point.selected = false}

    // create intersection point if two lines intersect
    for(let intersecting of walls){

        let start2 = intersecting.from;
        let end2 = intersecting.to;

        let intersection = checkIntersection(start.x, start.z, end.x, end.z, start2.x, start2.z, end2.x, end2.z);

        if( intersection.point ){

            let intersectionPoint = {x: Math.round(intersection.point.x * 4)/4, z: Math.round(intersection.point.y * 4)/4, selected: false};

            if(!_.find(points, {x: intersectionPoint.x, z: intersectionPoint.z})){
                drawPoint(intersectionPoint);
            }
        }
    }

    updateScene();
    updateModel();

    app.removeEventListener( 'mousemove', showLine, false);
    app.removeEventListener('click', drawLine, false);
}


export function deleteDrawing(event){

    let points = floorPlan.points;
    let walls = floorPlan.walls;

    let position = pointWorldPosition(event);
    let selected = _.find(points,{ x: position.x, z: position.z });

    if(selected){

        _.remove(walls, { from: {x:selected.x, z:selected.z} });
        _.remove(walls, { to: {x:selected.x, z:selected.z } });

        // TODO check this condition
        _.map(walls, wall =>{
            if(wall.to > selected){
                wall.to--;
            }
            if(wall.from > selected){
                wall.from--;
            }
            return wall
        });

        _.remove(points, point => { return point === selected });

        updateScene();
        updateModel();

    }


}


export function pointWorldPosition(event){

    let position = utils.getWorldPosition(event);

    position.x = Math.round( position.x * 4)/ 4;
    position.z = Math.round( position.z * 4)/ 4;

    return {x: position.x, z: position.z, selected: false}
}


export function addText(message, x, y, z){

    let writing = font.generateShapes(message, 0.1, 100);

    let geometry = new THREE.ShapeGeometry(writing);

    let mesh = new THREE.Mesh(geometry, textMaterial);

    mesh.position.set(x, y, z);
    mesh.rotateX(-Math.PI/2);
    mesh.rotateZ(-Math.PI/2);

    return mesh
}

