import { assert } from '@loaders.gl/loader-utils';
import { toArrayBuffer as bufferToArrayBuffer } from '../node/utils/to-array-buffer.node';
export function toArrayBuffer(data) {
  if (bufferToArrayBuffer) {
    data = bufferToArrayBuffer(data);
  }

  if (data instanceof ArrayBuffer) {
    return data;
  }

  if (ArrayBuffer.isView(data)) {
    return data.buffer;
  }

  if (typeof data === 'string') {
    const text = data;
    const uint8Array = new TextEncoder().encode(text);
    return uint8Array.buffer;
  }

  return assert(false);
}
//# sourceMappingURL=binary-utils.js.map