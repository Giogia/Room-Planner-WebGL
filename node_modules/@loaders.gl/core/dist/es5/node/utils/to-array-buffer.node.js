"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArrayBuffer = toArrayBuffer;

function toArrayBuffer(buffer) {
  if (Buffer.isBuffer(buffer)) {
    var typedArray = new Uint8Array(buffer);
    return typedArray.buffer;
  }

  return buffer;
}
//# sourceMappingURL=to-array-buffer.node.js.map