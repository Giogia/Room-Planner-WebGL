import {matrix} from "../maths/Matrix.js";
import Transform from "./Transform.js";
import Vector from "../maths/Vector.js";
import {uboGlobal} from '../app2.js'


class Camera extends Transform{

    constructor(fov, aspect, near, far){
        super();

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.target = new Vector(0,0,0);
        this.up = new Vector(0,1,0);

		this.perspectiveMatrix = matrix.MakePerspective(fov, aspect, near, far);
        this.viewMatrix = matrix.identity();
        this.projectionMatrix = matrix.identity();

        this.ubo = uboGlobal;
		this.updateProjectionMatrix();
		this.ubo.setItem( "matProjection", this.projectionMatrix ).update();
    };


    lookAt(x,y,z){

        this.target.set(x,y,z);
        this.updateProjectionMatrix();
    };

    updatePerspectiveMatrix(fov = this.fov, aspect = this.aspect, near = this.near, far = this.far){

        this.perspectiveMatrix = matrix.MakePerspective(fov, aspect, near, far);
    }

    updateProjectionMatrix(){

        this.viewMatrix = matrix.invert(matrix.MakeLookAt(this.position, this.target, this.up));
        this.projectionMatrix = matrix.multiply(this.viewMatrix, this.perspectiveMatrix);
    };

    update(){

        this.updateProjectionMatrix();
        this.ubo.setItem( "matProjection", this.projectionMatrix ).update();
    }
}

export default Camera

