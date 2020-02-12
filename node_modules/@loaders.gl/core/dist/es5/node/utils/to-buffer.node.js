"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = toBuffer;

var _loaderUtils = require("@loaders.gl/loader-utils");

function toBuffer(binaryData) {
  if (ArrayBuffer.isView(binaryData)) {
    binaryData = binaryData.buffer;
  }

  if (typeof Buffer !== 'undefined' && binaryData instanceof ArrayBuffer) {
    var buffer = new Buffer(binaryData.byteLength);
    var view = new Uint8Array(binaryData);

    for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }

    return buffer;
  }

  return (0, _loaderUtils.assert)(false);
}
//# sourceMappingURL=to-buffer.node.js.map