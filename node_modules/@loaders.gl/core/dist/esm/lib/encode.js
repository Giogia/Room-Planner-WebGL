import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
export function encode(_x, _x2, _x3, _x4) {
  return _encode.apply(this, arguments);
}

function _encode() {
  _encode = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(data, writer, options, url) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!writer.encode) {
              _context.next = 4;
              break;
            }

            _context.next = 3;
            return writer.encode(data, options);

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
            if (!writer.encodeSync) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", writer.encodeSync(data, options));

          case 6:
            throw new Error('Writer could not encode data');

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _encode.apply(this, arguments);
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