import utils from "./Utils.js";

export var matrix= {

	identity: function () {
		return [1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1];
	},

	invert: function (m) {

		let out = [];
		let inv = [];
		let det, i;

		inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
			m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];

		inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
			m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];

		inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
			m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];

		inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
			m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];

		inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
			m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];

		inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
			m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];

		inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
			m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];

		inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
			m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];

		inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
			m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];

		inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
			m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];

		inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
			m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];

		inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
			m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];

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

		for (i = 0; i < 16; i++) {
			out[i] = inv[i] * det;
		}

		return out;
	},

	transpose: function (m) {
		let out = [];

		let row, column, row_offset;

		row_offset = 0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			for (column = 0; column < 4; ++column) {
				out[row_offset + column] = m[row + column * 4];
			}
		}
		return out;
	},

	multiply: function (m1, m2) {
		// Perform matrix product  { out = m1 * m2;}
		let out = [];

		let row, column, row_offset;

		row_offset = 0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			for (column = 0; column < 4; ++column) {
				out[row_offset + column] =
					(m1[row_offset + 0] * m2[column + 0]) +
					(m1[row_offset + 1] * m2[column + 4]) +
					(m1[row_offset + 2] * m2[column + 8]) +
					(m1[row_offset + 3] * m2[column + 12]);
			}
		}
		return out;
	},

	MakeTranslate: function (position) {

		let out = this.identity();

		out[12] = position.x;
		out[13] = position.y;
		out[14] = position.z;
		return out;
	},

	MakeRotate: function (quaternion) {

		let x = quaternion.x;
		let y = quaternion.y;
		let z = quaternion.z;
		let w = quaternion.w;

		return [1 - 2 * (y * y + z * z), 2 * (x * y + w * z), 2 * (x * z - w * y), 0,
				2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x), 0,
				2 * (x * z + w * y), 2 * (y * z - w * x), 1 - 2 * (x * x + y * y), 0,
				0, 0, 0, 1];

	},

	MakeScale: function (scale) {

		let out = this.identity();

		out[0] = scale.x;
		out[5] = scale.y;
		out[10] = scale.z;

		return out;
	},

	MakeWorld: function (position, scale, rotation) {

		let R = this.MakeRotate(rotation);
		let S = this.MakeScale(scale);
		let T = this.MakeTranslate(position);
		let out;

		out = this.multiply(S, R);
		out = this.multiply(out, T);

		return out;
	},

	MakePerspective: function (fov, aspect, near, far) {

		let perspective = this.identity();

		let focalLength = 1.0 / Math.tan(utils.degToRad(fov) / 2);

		perspective[0] = focalLength / aspect;
		perspective[5] = focalLength;
		perspective[10] = (far + near) / (near - far);
		perspective[11] = -1.0;
		perspective[14] = 2.0 * far * near / (near - far);
		perspective[15] = 0.0;

		return perspective;
	},

	MakeLookAt: function (position, target, up) {
		let zAxis = utils.subtract(position, target).normalize();
		let xAxis = utils.crossProduct(up, zAxis).normalize();
		let yAxis = utils.crossProduct(zAxis, xAxis).normalize();

		return [
			xAxis.x, xAxis.y, xAxis.z, 0,
			yAxis.x, yAxis.y, yAxis.z, 0,
			zAxis.x, zAxis.y, zAxis.z, 0,
			position.x,
			position.y,
			position.z,
			1,
		];
	}
};
