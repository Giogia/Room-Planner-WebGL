import * as webGL from "../webGL.js";
import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/renderable.js";

class Wall{
	constructor(width=1, height=1, depth=1){

		this.width = width;
		this.height = height;
		this.depth = depth;

		this.vertices = [];
		this.normals = [];
		this.uv = [];
		this.indices = [];

		this.setVertices();
		this.setNormals();
		this.setUV();
		this.setIndices();

		this.vao = new VAO("Wall", this.vertices, this.indices, this.normals, this.uv);

		return new Renderable("Wall", this.vao, "WallMaterial", "wallShader");
	}

	setVertices(){

		let x = 0, y = 0, z = 0;

		let w = this.width/2,
			h = this.height/2,
			d = this.depth/2;

		let x0 = x - w, x1 = x + w,
			y0 = y - h, y1 = y + h,
			z0 = z - d, z1 = z + d;

		this.vertices = [
			x0, y1, z1,	//0 Front
			x0, y0, z1,	//1
			x1, y0, z1,	//2
			x1, y1, z1,	//3

			x1, y1, z0,	//4 Back
			x1, y0, z0,	//5
			x0, y0, z0,	//6
			x0, y1, z0,	//7

			x1, y1, z1,	//3 Right
			x1, y0, z1,	//2
			x1, y0, z0,	//5
			x1, y1, z0,	//4

			x0, y0, z1,	//1 Bottom
			x0, y0, z0,	//6
			x1, y0, z0,	//5
			x1, y0, z1,	//2

			x0, y1, z0,	//7 Left
			x0, y0, z0,	//6
			x0, y0, z1,	//1
			x0, y1, z1,	//0

			x0, y1, z0,	//7 Top
			x0, y1, z1,	//0
			x1, y1, z1,	//3
			x1, y1, z0,	//4
		];
	}

	setIndices(){

		let indices = [];
		for(let i=0; i < this.vertices.length / 3; i+=2)
			indices.push(i, i+1, (Math.floor(i/4)*4)+((i+2)%4));

		this.indices = indices;

	}

	setUV(){

		let uv = [];
		for(let i=0; i < 6; i++){
			uv.push(0,0, 0,1, 1,1, 1,0);
		}

		this.uv = uv;
	}

	setNormals(){

		this.normals = [
			 0, 0, 1,	 0, 0, 1,	 0, 0, 1,	 0, 0, 1,		//Front
			 0, 0,-1,	 0, 0,-1,	 0, 0,-1,	 0, 0,-1,		//Back
			-1, 0, 0,	-1, 0, 0,	-1, 0, 0,	-1, 0, 0,		//Left
			 0,-1, 0,	 0,-1, 0,	 0,-1, 0,	 0,-1, 0,		//Bottom
			 1, 0, 0,	 1, 0, 0,	 1, 0, 0,	 1, 0, 0,		//Right
			 0, 1, 0,	 0, 1, 0,	 0, 1, 0,	 0, 1, 0		//Top
		];
	}
}



export default Wall;