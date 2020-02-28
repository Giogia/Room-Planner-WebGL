import Vector from "../maths/Vector.js";
import Quaternion from "../maths/Quaternion.js";
import {matrix} from "../maths/Matrix.js";

class Transform{

	constructor(){

		this.position		= new Vector(0,0,0);
		this.scale			= new Vector(1,1,1);
		this.rotation		= new Quaternion();
		this.localMatrix	= matrix.identity();
		this.worldMatrix	= matrix.identity();

		this.children	= [];
		this._parent	= null;

		this.name		= "";
		this.visible	= true;
	}


	setPosition(x,y,z){
	    this.position.set(x,y,z);
	    return this;
	}


	setScale(x,y,z){
	    this.scale.set(x,y,z);
	    return this;
	}


	set parent(parent){

        if(this._parent != null){
            this._parent.removeChild(this); }

        if(parent != null) parent.addChild(this); //addChild also sets parent

	}


	addChild(child){

        if(this.children.indexOf(child) === -1){ //check if child already exists
            child._parent = this;
            this.children.push(child);
        }
        return this;
    }


    removeChild(child){

        let i = this.children.indexOf(child);

        if(i !== -1){
            this.children[i]._parent = null;
            this.children.splice(i,1);
        }

        return this;
    }

    updateMatrix(forceWorldUpdate){

        this.localMatrix = matrix.fromQuaternionTranslationScale(this.localMatrix, this.rotation, this.position, this.scale);

        //Figure out the world matrix.
        if(this._parent != null){
            this.worldMatrix = matrix.multiply(this._parent.worldMatrix, this.localMatrix);
        }
        else this.worldMatrix = this.copyMatrix(this.worldMatrix, this.localMatrix); //if not parent, localMatrix is worldMatrix

        return true;
    }

    copyMatrix(matrix1, matrix2){
        for(let i=0; i < 16; i++)
            matrix1[i] = matrix[i];
            return matrix1;
    }
}

export default Transform;