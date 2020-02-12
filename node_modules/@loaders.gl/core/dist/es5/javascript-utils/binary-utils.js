"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArrayBuffer = toArrayBuffer;

var _loaderUtils = require("@loaders.gl/loader-utils");

var _toArrayBuffer = require("../node/utils/to-array-buffer.node");

function toArrayBuffer(data) {
  if (_toArrayBuffer.toArrayBuffer) {
    data = (0, _toArrayBuffer.toArrayBuffer)(data);
  }

  if (data instanceof ArrayBuffer) {
    return data;
  }

  if (ArrayBuffer.isView(data)) {
    return data.buffer;
  }

  if (typeof data === 'string') {
    var text = data;
    var uint8Array = new TextEncoder().encode(text);
    return uint8Array.buffer;
  }

  return (0, _loaderUtils.assert)(false);
}
//# sourceMappingURL=binary-utils.js.map