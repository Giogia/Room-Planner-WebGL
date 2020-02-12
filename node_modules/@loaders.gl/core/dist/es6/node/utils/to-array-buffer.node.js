export function toArrayBuffer(buffer) {
  if (Buffer.isBuffer(buffer)) {
    const typedArray = new Uint8Array(buffer);
    return typedArray.buffer;
  }

  return buffer;
}
//# sourceMappingURL=to-array-buffer.node.js.map