export default async function fetchProgress(response, onProgress, onDone = () => {}, onError = () => {}) {
  response = await response;

  if (!response.ok) {
    return response;
  }

  if (!response.body) {
    return response;
  }

  const contentLength = response.headers.get('content-length');
  const totalBytes = contentLength && parseInt(contentLength, 10);

  if (!(contentLength > 0)) {
    return response;
  }

  if (typeof ReadableStream === 'undefined') {
    return response;
  }

  const progressStream = new ReadableStream({
    start(controller) {
      const reader = response.body.getReader();
      read(controller, reader, 0, totalBytes, onProgress, onDone, onError);
    }

  });
  return new Response(progressStream);
}

async function read(controller, reader, loadedBytes, totalBytes, onProgress, onDone, onError) {
  try {
    const {
      done,
      value
    } = await reader.read();

    if (done) {
      onDone();
      controller.close();
      return;
    }

    loadedBytes += value.byteLength;
    const percent = Math.round(loadedBytes / totalBytes * 100);
    onProgress(percent, {
      loadedBytes,
      totalBytes
    });
    controller.enqueue(value);
    await read(controller, reader, loadedBytes, totalBytes, onProgress, onDone, onError);
  } catch (error) {
    controller.error(error);
    onError(error);
  }
}
//# sourceMappingURL=fetch-progress.js.map