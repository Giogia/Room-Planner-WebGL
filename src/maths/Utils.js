import Vector from "./Vector.js";
//import {app, camera, raycaster} from "../app";
import Quaternion from "./Quaternion.js";

export var utils = {

    //***Custom functions

	degToRad: function(angle){
		return(angle*Math.PI/180);
	},

	radToDeg: function(angle){
		return(angle/Math.PI*180);
	},

	hexToRgbArray: function(hex){

		let rgb = [];

		let position = (hex[0] === "#")?1:0;	//Determine starting position in char array to start pulling from

		rgb.push(
				parseInt(hex[position+0] + hex[position+1],16)	/ 255.0,
				parseInt(hex[position+2] + hex[position+3],16)	/ 255.0,
				parseInt(hex[position+4] + hex[position+5],16)	/ 255.0
		);

		return rgb;
	},

    multiplyVectorMatrix: function(vector, matrix){

		let x = vector.x, y = vector.y, z = vector.z;

		let w = 1 / ( matrix[ 3 ] * x + matrix[ 7 ] * y + matrix[ 11 ] * z + matrix[ 15 ] );

		vector.x = ( matrix[ 0 ] * x + matrix[ 4 ] * y + matrix[ 8 ] * z + matrix[ 12 ] ) * w;
		vector.y = ( matrix[ 1 ] * x + matrix[ 5 ] * y + matrix[ 9 ] * z + matrix[ 13 ] ) * w;
		vector.z = ( matrix[ 2 ] * x + matrix[ 6 ] * y + matrix[ 10 ] * z + matrix[ 14 ] ) * w;

		return vector;
	},

	unProject: function(vector, camera){

		let projectionMatrixInverse = camera.projectionMatrixInverse.elements;
		let MatrixWorld = camera.matrixWorld.elements;

		vector = utils.multiplyVectorMatrix(vector, projectionMatrixInverse);
		vector = utils.multiplyVectorMatrix(vector, MatrixWorld);

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

		vector = utils.unProject( vector, camera );
		vector = utils.subtract( vector, camera.position);
		vector = vector.normalize();

		let distance = - camera.position.y / vector.y;

		return {
			x: camera.position.x + distance * vector.x,
			y: camera.position.y + distance * vector.y,
			z: camera.position.z + distance * vector.z
		};
	},

	intersect: function(event,objects){

		let mouse = {
			x: ( event.clientX / app.clientWidth ) * 2 - 1,
			y: - ( event.clientY / app.clientHeight ) * 2 + 1
		};

		for( let object of objects){

		}

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects, true);
	},

	multiplyQuaternions: function(q1,q2){

			let quaternion = new Quaternion();

			quaternion.x = q1.x * q2.w + q1.w * q2.x + q1.y * q2.z - q1.z * q2.y;
			quaternion.y = q1.y * q2.w + q1.w * q2.y + q1.z * q2.x - q1.x * q2.z;
			quaternion.z = q1.z * q2.w + q1.w * q2.z + q1.x * q2.y - q1.y * q2.x;
			quaternion.w = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;

			return quaternion;
	},

	multiplyVec3Quaternion: function(v,q){

		let vector = new Vector();

		vector.x = q.x + q.w * v.x + q.y * v.z - q.z * v.y;
		vector.y = q.y + q.w * v.y + q.z * v.x - q.x * v.z;
		vector.z = q.z + q.w * v.z + q.x * v.y - q.y * v.x;

		return vector;
	}
};