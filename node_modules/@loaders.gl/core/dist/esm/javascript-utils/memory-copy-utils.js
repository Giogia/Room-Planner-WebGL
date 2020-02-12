export function concatenateArrayBuffers(source1, source2) {
  var sourceArray1 = source1 instanceof ArrayBuffer ? new Uint8Array(source1) : source1;
  var sourceArray2 = source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2;
  var temp = new Uint8Array(sourceArray1.byteLength + sourceArray2.byteLength);
  temp.set(sourceArray1, 0);
  temp.set(sourceArray2, sourceArray1.byteLength);
  return temp;
}
//# sourceMappingURL=memory-copy-utils.js.map