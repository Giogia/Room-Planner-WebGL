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

		let x = this.x;
		let y = this.y;
		let z = this.z;
		let w = this.w;

		let cos = Math.cos(rad/2);
		let sin = Math.sin(rad/2);

		this.x = x * cos + w * sin;
		this.y = y * cos + z * sin;
		this.z = z * cos - y * sin;
		this.w = w * cos - x * sin;

		return this;
	}

	rotateY(rad) {

		let x = this.x;
		let y = this.y;
		let z = this.z;
		let w = this.w;

		let cos = Math.cos(rad/2);
		let sin = Math.sin(rad/2);

		this.x = x * cos - z * sin;
		this.y = y * cos + w * sin;
		this.z = z * cos + x * sin;
		this.w = w * cos - y * sin;

		return this;
	}

	rotateZ(rad) {

		let x = this.x;
		let y = this.y;
		let z = this.z;
		let w = this.w;

		let cos = Math.cos(rad/2);
		let sin = Math.sin(rad/2);

		this.x = x * cos + y * sin;
		this.y = y * cos - x * sin;
		this.z = z * cos + w * sin;
		this.w = w * cos - z * sin;

		return this;
	}
}

export default Quaternion