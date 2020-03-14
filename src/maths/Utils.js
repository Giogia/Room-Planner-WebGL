import Vector from "./Vector.js";
import {app, camera, raycaster} from "../app";
import Quaternion from "./Quaternion.js";

let utils = {

    //***Custom functions

	degToRad: function(angle){
		return(angle*Math.PI/180);
	},

	radToDeg: function(angle){
		return(angle/Math.PI*180);
	},

	hexToRgb: function(hex){
		let position = (hex[0] === "#")?1:0;	//Determine starting position in char array to start pulling from

		return([
			parseInt(hex[position  ] + hex[position+1],16)	/ 255.0,
			parseInt(hex[position+2] + hex[position+3],16)	/ 255.0,
			parseInt(hex[position+4] + hex[position+5],16)	/ 255.0]
		);
	},

    multiplyVectorMatrix: function(vector, matrix){

		let x = vector.x, y = vector.y, z = vector.z;

		let w = 1 / ( matrix[ 3 ] * x + matrix[ 7 ] * y + matrix[ 11 ] * z + matrix[ 15 ] );

		vector.x = ( matrix[ 0 ] * x + matrix[ 4 ] * y + matrix[ 8 ] * z + matrix[ 12 ] ) * w;
		vector.y = ( matrix[ 1 ] * x + matrix[ 5 ] * y + matrix[ 9 ] * z + matrix[ 13 ] ) * w;
		vector.z = ( matrix[ 2 ] * x + matrix[ 6 ] * y + matrix[ 10 ] * z + matrix[ 14 ] ) * w;

		return vector;
	},

	distance: function(vector1, vector2){
		return Math.sqrt(Math.pow(vector1.x - vector2.x,2) + Math.pow(vector1.y - vector2.y,2) + Math.pow(vector1.z - vector2.z,2));
	},

	add: function(vector1, vector2){

		return new Vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z );
	},

	subtract: function(vector1, vector2){

		return new Vector(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z );
	},

	crossProduct: function(v1,v2) {

		return new Vector(v1.y * v2.z - v1.z * v2.y,
							v1.z * v2.x - v1.x * v2.z,
			  				v1.x * v2.y - v1.y * v2.x);
	},

	getWorldPosition: function(event){

		let vector = {
			x: (event.clientX / app.clientWidth) * 2 - 1,
			y: -(event.clientY / app.clientHeight) * 2 + 1,
			z: -1
		};

		vector = camera.unProject( vector );
		vector = utils.subtract( vector, camera.position);
		vector = vector.normalize();

		let distance = - camera.position.y / vector.y;

		return {
			x: camera.position.x + distance * vector.x,
			y: camera.position.y + distance * vector.y,
			z: camera.position.z + distance * vector.z
		};
	},

};

export default utils