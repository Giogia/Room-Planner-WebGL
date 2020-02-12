export async function encode(data, writer, options, url) {
  if (writer.encode) {
    return await writer.encode(data, options);
  }

  if (writer.encodeSync) {
    return writer.encodeSync(data, options);
  }

  throw new Error('Writer could not encode data');
}
export function encodeSync(data, writer, options, url) {
  if (writer.encodeSync) {
    return writer.encodeSync(data, options);
  }

  throw new Error('Writer could not synchronously encode data');
}
export function encodeInBatches(data, writer, options, url) {
  if (writer.encodeInBatches) {
    return writer.encodeInBatches(data, options);
  }

  throw new Error('Writer could not encode data in batches');
}
//# sourceMappingURL=encode.js.map