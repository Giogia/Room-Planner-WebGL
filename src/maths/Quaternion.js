class Quaternion
{
	constructor(){

		this.x = 0;
		this.y = 0;
        this.z = 0;
		this.w = 1;

	}

	set(x,y,z,w){

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;
    };

	copy(quaternion){

        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.w = quaternion.w;

        return this;
	}

	normalize(){

	    let length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y,2 ) + Math.pow(this.z,2) + Math.pow(this.w,2));

		if(length > 0){
			this.x = this.x / length;
			this.y = this.y / length;
			this.z = this.z / length;
			this.w = this.w / length;
		}
		return this;
	}


	rotateX(rad){

		this.x = Math.sin(rad/2);
		this.w = Math.cos(rad/2);

		return this;
	}

	rotateY(rad) {

		this.y = Math.sin(rad/2);
		this.w = Math.cos(rad/2);

		return this;
	}

	rotateZ(rad) {

		this.z = Math.sin(rad/2);
		this.w = Math.cos(rad/2);

		return this;
	}
}

export default Quaternion