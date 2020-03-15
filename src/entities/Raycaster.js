import {camera} from "../app";
import Vector from "../maths/Vector";
import utils from "../maths/Utils";
import Line from "../primitives/Line";
import render from "./Renderer";

class Raycaster{
    constructor() {
    	this.start = new Vector();
    	this.end = new Vector();
	}

    intersect(event, objects){

    	let point = utils.getWorldPosition(event);

    	this.start.set(camera.position.x, camera.position.y, camera.position.z);
		this.end.set(point.x, point.y, point.z);

		let ray = new Line(this.start, this.end);

		let intersected = null;

		let minimumDistance = null;

		for(let object of objects){

			if(object.visible){

				let distance = this.intersectBoundingBox(object, ray);

				if(distance !== null){
					if(minimumDistance > distance || minimumDistance == null){
						minimumDistance = distance;
						intersected = object
					}
				}
			}
		}

		return intersected
	}

	intersectBoundingBox(renderable, ray) {

    	let box = renderable.boundingBox;
    	box.updateMatrix();

		let rayDirection = utils.subtract(ray.end, ray.start),					//NOTE: This should be done when ray is created and cached.
			distanceRayBox = utils.subtract(renderable.position, ray.start),	//Distance between Ray start and Box Position

			axis = new Vector(),												//Current Axis being tested.
			tMin = 0,
			tMax = 1000000,
			tmp, min, max;

		let boxMin = box.min.array(); //[box.min.x, box.min.y, box.min.z];
		let boxMax = box.max.array(); //[box.max.x, box.max.y, box.max.z];

		for (let i = 0; i < 3; i++) {

			axis.set(box.worldMatrix[4 * i], box.worldMatrix[4 * i + 1], box.worldMatrix[4 * i + 2]);

			let nomLen = utils.dotProduct(axis, distanceRayBox); 	//Get the length of Axis and distance to ray position
			let denomLen = utils.dotProduct(rayDirection, axis);	//Get Length of ray and axis


			if (Math.abs(denomLen) > 0.00001) {	//Can't divide by Zero

				min = (nomLen + boxMin[i]) / denomLen;
				max = (nomLen + boxMax[i]) / denomLen;

				if (min > max) {
					tmp = min;
					min = max;
					max = tmp;
				}	//Swap

				if (min > tMin) tMin = min; 						//Biggest Min
				if (max < tMax) tMax = max;							//Smallest Max

				if (tMax < tMin) return null;

			}
			else if (-nomLen + boxMin[i] > 0 || -nomLen + boxMax[i] < 0) return null; //are almost parallel check
		}
		return tMin;//rayDirection.multiply(tMin);
	}
}

export default Raycaster;