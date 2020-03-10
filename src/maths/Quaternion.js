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