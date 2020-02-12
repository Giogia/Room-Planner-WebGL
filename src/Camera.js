import {matrix} from "./maths/Matrix";
import Transform from "./entities/Transform";


class Camera extends Transform{

    constructor(fov, aspect, near, far){
        super();

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.ubo = gl.UBOTransform;
		this.projectionMatrix = matrix.MakePerspective(fov, aspect, near, far);
		this.invertedLocalMatrix = new Float32Array(16);

		this.ubo.update("matProjection",this.projectionMatrix); //Initialize The Transform UBO.
    };


    lookAt(x,y,z){

        let target = new Vector(x,y,z);
        let up = new Vector(0,1,0);

        let viewMatrix = matrix.invert(matrix.MakeLookAt(this.position, target, up));

        let perspProjectionMatrix = matrix.multiply(this.projectionMatrix, viewMatrix);
        let worldViewPerspMatrix = matrix.transpose(matrix.multiply(perspProjectionMatrix, viewMatrix));
    };

    projectionMatrix(){
        this.projectionMatrix = matrix.MakePerspective(this.fov, this.aspect, this.near, this.far)
    }

    updateMatrixWorld(){
        return this.camera.updateMatrixWorld();
    };

    updateProjectionMatrix(){
        return this.camera.updateProjectionMatrix();
    };
}

export default Camera

