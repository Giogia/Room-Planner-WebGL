class Quaternion
{
	constructor(){

		this.x = 0;
		this.y = 0;
        this.z = 0;
		this.w = 1;

	}

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

		rad *= 0.5;

		let x = Math.sin(rad);
		let w = Math.cos(rad);

		this.x = this.x * w + this.w * x;
		this.y = this.y * w + this.z * x;
		this.z = this.z * w - this.y * x;
		this.w = this.w * w - this.x * x;

		return this;
	}

	rotateY(rad) {

		rad *= 0.5;

		let y = Math.sin(rad);
		let w = Math.cos(rad);

		this.x = this.x * w + this.z * y;
		this.y = this.y * w + this.w * y;
		this.z = this.z * w - this.x * y;
		this.w = this.w * w - this.y * y;

		return this;
	}

	rotateZ(rad) {

		rad *= 0.5;

		let z = Math.sin(rad);
		let w = Math.cos(rad);

		this.x = this.x * w + this.y * z;
		this.y = this.y * w + this.x * z;
		this.z = this.z * w - this.w * z;
		this.w = this.w * w - this.z * z;

		return this;
	}


	setFromEuler(x,y,z,order){

		let c1 = Math.cos(x/2),
			c2 = Math.cos(y/2),
			c3 = Math.cos(z/2),

			s1 = Math.sin(x/2),
			s2 = Math.sin(y/2),
			s3 = Math.sin(z/2);

		switch(order){
			case 'XYZ':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;
			case 'YXZ':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;
			case 'ZXY':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;
			case 'ZYX':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;
			case 'YZX':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;
			case 'XZY':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;
		}

		return this;
	}
}

export default Quaternion