import {utils} from "./Utils.js";

export var matrix={

	identity: function() {
		return [1,0,0,0,
				0,1,0,0,
				0,0,1,0,
				0,0,0,1];
	},

	invert: function(m){

		let out = [];
		let inv = [];
		let det, i;

		inv[0] = m[5]  * m[10] * m[15] - m[5]  * m[11] * m[14] - m[9]  * m[6]  * m[15] +
				 m[9]  * m[7]  * m[14] + m[13] * m[6]  * m[11] - m[13] * m[7]  * m[10];

		inv[4] = -m[4]  * m[10] * m[15] + m[4]  * m[11] * m[14] + m[8]  * m[6]  * m[15] -
				  m[8]  * m[7]  * m[14] - m[12] * m[6]  * m[11] + m[12] * m[7]  * m[10];

		inv[8] = m[4]  * m[9] * m[15] - m[4]  * m[11] * m[13] - m[8]  * m[5] * m[15] +
				 m[8]  * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];

		inv[12] = -m[4]  * m[9] * m[14] + m[4]  * m[10] * m[13] + m[8]  * m[5] * m[14] -
				   m[8]  * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];

		inv[1] = -m[1]  * m[10] * m[15] + m[1]  * m[11] * m[14] + m[9]  * m[2] * m[15] -
				  m[9]  * m[3] * m[14] - m[13] * m[2] * m[11] +  m[13] * m[3] * m[10];

		inv[5] = m[0]  * m[10] * m[15] - m[0]  * m[11] * m[14] - m[8]  * m[2] * m[15] +
				 m[8]  * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];

		inv[9] = -m[0]  * m[9] * m[15] + m[0]  * m[11] * m[13] + m[8]  * m[1] * m[15] -
				  m[8]  * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];

		inv[13] = m[0]  * m[9] * m[14] - m[0]  * m[10] * m[13] - m[8]  * m[1] * m[14] +
				  m[8]  * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];

		inv[2] = m[1]  * m[6] * m[15] - m[1]  * m[7] * m[14] - m[5]  * m[2] * m[15] +
				 m[5]  * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];

		inv[6] = -m[0]  * m[6] * m[15] + m[0]  * m[7] * m[14] + m[4]  * m[2] * m[15] -
				  m[4]  * m[3] * m[14] - m[12] * m[2] * m[7] +  m[12] * m[3] * m[6];

		inv[10] = m[0]  * m[5] * m[15] - m[0]  * m[7] * m[13] - m[4]  * m[1] * m[15] +
				  m[4]  * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];

		inv[14] = -m[0]  * m[5] * m[14] + m[0]  * m[6] * m[13] + m[4]  * m[1] * m[14] -
				   m[4]  * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];

		inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
				  m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];

		inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
				 m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];

		inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
				   m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];

		inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
				  m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

		det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

		if (det === 0)
			return out = this.identity();

		det = 1.0 / det;

		for (i = 0; i < 16; i++){
			out[i] = inv[i] * det;
		}

		return out;
	},

	transpose: function(m){
		let out = [];

		let row, column, row_offset;

		row_offset=0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			for (column = 0; column < 4; ++column){
				out[row_offset + column] = m[row + column * 4];
			  }
		}
		return out;
	},

	multiply: function(m1, m2){
	// Perform matrix product  { out = m1 * m2;}
		let out = [];

		let row, column, row_offset;

		row_offset=0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			for (column = 0; column < 4; ++column){
				out[row_offset + column] =
					(m1[row_offset + 0] * m2[column + 0]) +
					(m1[row_offset + 1] * m2[column + 4]) +
					(m1[row_offset + 2] * m2[column + 8]) +
					(m1[row_offset + 3] * m2[column + 12]);
			  }
		}
		return out;
	},

	MakeTranslate: function(dx, dy, dz) {
	// Create a transform matrix for a translation of ({dx}, {dy}, {dz}).

		let out = this.identity();

		out[3]  = dx;
		out[7]  = dy;
		out[11] = dz;
		return out;
	},

	MakeRotateX: function(a) {
	// Create a transform matrix for a rotation of {a} along the X axis.

		let out = this.identity();

		let adeg = utils.degToRad(a);
		let c = Math.cos(adeg);
		let s = Math.sin(adeg);

		out[5] = out[10] = c;
		out[6] = -s;
		out[9] = s;

		return out;
	},

	MakeRotateY: function(a) {
	// Create a transform matrix for a rotation of {a} along the Y axis.

		let out = this.identity();

		let adeg = utils.degToRad(a);

		let c = Math.cos(adeg);
		let s = Math.sin(adeg);

		out[0] = out[10] = c;
		out[2] = s;
		out[8] = -s;

		return out;
	},

	MakeRotateZ: function(a) {
	// Create a transform matrix for a rotation of {a} along the Z axis.

		let out = this.identity();

		let adeg = utils.degToRad(a);
		let c = Math.cos(adeg);
		let s = Math.sin(adeg);

		out[0] = out[5] = c;
		out[4] = s;
		out[1] = -s;

		return out;
	},

	MakeScale: function(s) {
	// Create a transform matrix for proportional scale

		let out = this.identity();

		out[0] = out[5] = out[10] = s;

		return out;
	},

	MakeScaleNu: function(sx, sy, sz) {
	// Create a scale matrix for a scale of ({sx}, {sy}, {sz}).

		let out = this.identity();
		out[0]  = sx;
		out[5]  = sy;
		out[10] = sz;
		return out;
	},

	MakeShearX: function(hy, hz) {
	// Create a scale matrix for a scale of ({sx}, {sy}, {sz}).

		let out = this.identity();
		out[4]  = hy;
		out[8] = hz;
		return out;
	},

	MakeShearY: function(hx, hz) {
	// Create a scale matrix for a scale of ({sx}, {sy}, {sz}).

		let out = this.identity();
		out[1]  = hx;
		out[9] = hz;
		return out;
	},

	MakeShearZ: function(hx, hy) {
	// Create a scale matrix for a scale of ({sx}, {sy}, {sz}).

		let out = this.identity();
		out[2]  = hx;
		out[6] = hy;
		return out;
	},


	MakeWorld: function(tx, ty, tz, rx, ry, rz, s){
	//Creates a world matrix for an object.

		let Rx = this.MakeRotateX(ry);
		let Ry = this.MakeRotateY(rx);
		let Rz = this.MakeRotateZ(rz);
		let S  = this.MakeScale(s);
		let T =  this.MakeTranslate(tx, ty, tz);
		let out;

		out = this.multiply(Rz, S);
		out = this.multiply(Ry, out);
		out = this.multiply(Rx, out);
		out = this.multiply(T, out);

		return out;
	},

	MakeView: function(cx, cy, cz, elev, ang) {
	// Creates in {out} a view matrix. The camera is centerd in ({cx}, {cy}, {cz}).
	// It looks {ang} degrees on y axis, and {elev} degrees on the x axis.

		let T = [];
		let Rx = [];
		let Ry = [];
		let tmp = [];
		let out = [];

		T =  this.MakeTranslate(-cx, -cy, -cz);
		Rx = this.MakeRotateX(-elev);
		Ry = this.MakeRotateY(-ang);

		tmp = this.multiply(Ry, T);
		out = this.multiply(Rx, tmp);

		return out;
	},

	MakePerspective:function(fov, a, n, f) {
	// Creates the perspective projection matrix. The matrix is returned.
	// {fov} contains the vertical field-of-view in degrees. {a} is the aspect ratio.
	// {n} is the distance of the near plane, and {f} is the far plane.

		let perspective = this.identity();

		let halfFovyRad = utils.degToRad(fov/2);	// stores {fov/2} in radians
		let ct = 1.0 / Math.tan(halfFovyRad);			// cotangent of {fov/2}

		perspective[0] = ct / a;
		perspective[5] = ct;
		perspective[10] = (f + n) / (n - f);
		perspective[11] = 2.0 * f * n / (n - f);
		perspective[14] = -1.0;
		perspective[15] = 0.0;

		return perspective;
	},

	MakeParallel:function(w, a, n, f) {
	// Creates the parallel projection matrix. The matrix is returned.
	// {w} contains the horizontal half-width in world units. {a} is the aspect ratio.
	// {n} is the distance of the near plane, and {f} is the far plane.

		let parallel = this.identity();

		parallel[0] = 1.0 / w;
		parallel[5] = a / w;
		parallel[10] = 2.0 / (n - f);
		parallel[11] = (n + f) / (n - f);

		return parallel;
	},

	MakeLookAt: function(cameraPosition, target, up) {
		let zAxis = utils.subtract(cameraPosition, target).normalize();
		let xAxis = utils.crossProduct(up, zAxis).normalize();
		let yAxis = utils.crossProduct(zAxis, xAxis).normalize();

		return [
		   xAxis.x, xAxis.y, xAxis.z, 0,
		   yAxis.x, yAxis.y, yAxis.z, 0,
		   zAxis.x, zAxis.y, zAxis.z, 0,
		   cameraPosition.x,
		   cameraPosition.y,
		   cameraPosition.z,
		   1,
		];
	  },

	  fromQuaternionTranslationScale: function(q, v, s){

		let out = [];

		// Quaternion math
		var x = q[0], y = q[1], z = q[2], w = q[3],

		x2 = x + x,
		y2 = y + y,
		z2 = z + z,

		xx = x * x2,
		xy = x * y2,
		xz = x * z2,
		yy = y * y2,
		yz = y * z2,
		zz = z * z2,
		wx = w * x2,
		wy = w * y2,
		wz = w * z2,
		sx = s[0],
		sy = s[1],
		sz = s[2];

		out[0] = (1 - (yy + zz)) * sx;
		out[1] = (xy + wz) * sx;
		out[2] = (xz - wy) * sx;
		out[3] = 0;
		out[4] = (xy - wz) * sy;
		out[5] = (1 - (xx + zz)) * sy;
		out[6] = (yz + wx) * sy;
		out[7] = 0;
		out[8] = (xz + wy) * sz;
		out[9] = (yz - wx) * sz;
		out[10] = (1 - (xx + yy)) * sz;
		out[11] = 0;
		out[12] = v[0];
		out[13] = v[1];
		out[14] = v[2];
		out[15] = 1;

		return out;
	}
};
