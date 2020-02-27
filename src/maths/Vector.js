class Vector extends Float32Array{

    constructor(x= 0,y= 0,z= 0){

        super();

        this.x = x;
        this.y = y;
        this.z = z;
    };

    set(x,y,z){

        this.x = x;
		this.y = y;
		this.z = z;

		return this;
    };

    copy(vector){

        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;

        return this;
    };

    multiply(scalar){

        this.x = scalar * this.x;
        this.y = scalar * this.y;
        this.z = scalar * this.z;

        return this
    }

    normalize() {

        let length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));

        if (length > 0) {
            this.x = this.x / length;
            this.y = this.y / length;
            this.z = this.z / length;
        }

        return this;
    };
}

export default Vector;