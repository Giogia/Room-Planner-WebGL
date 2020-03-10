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
		this.parent	= null;

		this.name		= "";
		this.visible	= true;
	}

	setParent(parent){

        if(this.parent != null){
            this.parent.removeChild(this);
        }

        this.parent = parent;

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


    updateMatrix(){

        this.localMatrix = matrix.MakeWorld(this.position, this.scale, this.rotation);

        if(this.parent != null){
            this.worldMatrix = matrix.multiply(this.localMatrix, this.parent.worldMatrix);
        }
        else this.worldMatrix = this.copyMatrix(this.worldMatrix, this.localMatrix);

        return true;
    }

    copyMatrix(matrix1, matrix2){
        for(let i=0; i < 16; i++)
            matrix1[i] = matrix2[i];
            return matrix1;
    }
}

export default Transform;