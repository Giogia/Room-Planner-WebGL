"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _workerPool = _interopRequireDefault(require("./worker-pool"));

var DEFAULT_MAX_CONCURRENCY = 5;

var WorkerFarm = function () {
  (0, _createClass2["default"])(WorkerFarm, null, [{
    key: "isSupported",
    value: function isSupported() {
      return typeof Worker !== 'undefined';
    }
  }]);

  function WorkerFarm(_ref) {
    var _ref$maxConcurrency = _ref.maxConcurrency,
        maxConcurrency = _ref$maxConcurrency === void 0 ? DEFAULT_MAX_CONCURRENCY : _ref$maxConcurrency,
        onMessage = _ref.onMessage,
        _ref$onDebug = _ref.onDebug,
        onDebug = _ref$onDebug === void 0 ? function () {} : _ref$onDebug;
    (0, _classCallCheck2["default"])(this, WorkerFarm);
    this.maxConcurrency = maxConcurrency;
    this.onMessage = onMessage;
    this.onDebug = onDebug;
    this.workerPools = new Map();
  }

  (0, _createClass2["default"])(WorkerFarm, [{
    key: "setProps",
    value: function setProps(props) {
      if ('maxConcurrency' in props) {
        this.maxConcurrency = props.maxConcurrency;
      }

      if ('onDebug' in props) {
        this.onDebug = props.onDebug;
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.workerPools.forEach(function (workerPool) {
        return workerPool.destroy();
      });
    }
  }, {
    key: "process",
    value: function () {
      var _process = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(workerSource, workerName, data) {
        var workerPool;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                workerPool = this._getWorkerPool(workerSource, workerName);
                return _context.abrupt("return", workerPool.process(data));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function process(_x, _x2, _x3) {
        return _process.apply(this, arguments);
      }

      return process;
    }()
  }, {
    key: "_getWorkerPool",
    value: function _getWorkerPool(workerSource, workerName) {
      var workerPool = this.workerPools.get(workerName);

      if (!workerPool) {
        workerPool = new _workerPool["default"]({
          source: workerSource,
          name: workerName,
          onMessage: this.onMessage,
          maxConcurrency: this.maxConcurrency,
          onDebug: this.onDebug
        });
        this.workerPools.set(workerName, workerPool);
      }

      return workerPool;
    }
  }]);
  return WorkerFarm;
}();

exports["default"] = WorkerFarm;
//# sourceMappingURL=worker-farm.js.map