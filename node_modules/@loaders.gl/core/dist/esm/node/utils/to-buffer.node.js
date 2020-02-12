import { assert } from '@loaders.gl/loader-utils';
export default function toBuffer(binaryData) {
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

  return assert(false);
}
//# sourceMappingURL=to-buffer.node.js.map