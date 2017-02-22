module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReadBuffer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * node-qtdatastream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://github.com/magne4000/node-qtdatastream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2017 Joël Charles
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _int64Buffer = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Wraps a buffer with an internal read pointer for sequential reads
 * @param {Buffer} buffer
 */
var ReadBuffer = exports.ReadBuffer = function () {
  function ReadBuffer(buffer) {
    _classCallCheck(this, ReadBuffer);

    this.buffer = buffer;
    this.read_offset = 0;
  }

  _createClass(ReadBuffer, [{
    key: 'remaining',
    value: function remaining() {
      if (this.read_offset >= this.buffer.length) return null;
      return this.buffer.slice(this.read_offset);
    }
  }, {
    key: 'readInt8',
    value: function readInt8() {
      var result = this.buffer.readInt8(this.read_offset);
      this.read_offset += 1;
      return result;
    }
  }, {
    key: 'readInt16BE',
    value: function readInt16BE() {
      var result = this.buffer.readInt16BE(this.read_offset);
      this.read_offset += 2;
      return result;
    }
  }, {
    key: 'readUInt16BE',
    value: function readUInt16BE() {
      var result = this.buffer.readUInt16BE(this.read_offset);
      this.read_offset += 2;
      return result;
    }
  }, {
    key: 'readInt32BE',
    value: function readInt32BE() {
      var result = this.buffer.readInt32BE(this.read_offset);
      this.read_offset += 4;
      return result;
    }
  }, {
    key: 'readUInt32BE',
    value: function readUInt32BE() {
      var result = this.buffer.readUInt32BE(this.read_offset);
      this.read_offset += 4;
      return result;
    }
  }, {
    key: 'readInt64BE',
    value: function readInt64BE() {
      var result = new _int64Buffer.Int64BE(this.buffer, this.read_offset).toNumber();
      this.read_offset += 8;
      return result;
    }
  }, {
    key: 'readUInt64BE',
    value: function readUInt64BE() {
      var result = new _int64Buffer.Uint64BE(this.buffer, this.read_offset).toNumber();
      this.read_offset += 8;
      return result;
    }
  }, {
    key: 'readDoubleBE',
    value: function readDoubleBE() {
      var result = this.buffer.readDoubleBE(this.read_offset);
      this.read_offset += 8;
      return result;
    }
  }, {
    key: 'slice',
    value: function slice(size) {
      var result = this.buffer.slice(this.read_offset, this.read_offset + size);
      this.read_offset += size;
      return result;
    }
  }]);

  return ReadBuffer;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WriteTransform = exports.ReadTransform = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = __webpack_require__(8);

var _buffer = __webpack_require__(0);

var _types = __webpack_require__(2);

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * node-qtdatastream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://github.com/magne4000/node-qtdatastream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (c) 2017 Joël Charles
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/** @module qtdatastream/transform */

var debuglib = __webpack_require__(4);
var loggerr = debuglib('qtdatastream:transform:read');
var debug = debuglib.enabled('qtdatastream:*');

/**
 * ReadTransform data event.
 *
 * @event ReadTransform#data
 * @property {*} data JS object or type
 */
/**
 * WriteTransform data event.
 *
 * @event WriteTransform#data
 * @property {Buffer} buffer Qt Buffer
 */

/**
 * Transform Qt buffers into JS objects
 * @extends stream.Transform
 * @fires ReadTransform#data
 * @example
 * const { ReadTransform } = require('qtdatastream').transform;
 *
 * const reader = new ReadTransform();
 *
 * reader.on('data', (data) => {
 *   // data === 1
 * });
 *
 * // Write a QDataStream
 * reader.write(Buffer.from([ 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01 ]));
 */

var ReadTransform = exports.ReadTransform = function (_Transform) {
  _inherits(ReadTransform, _Transform);

  function ReadTransform() {
    _classCallCheck(this, ReadTransform);

    var _this = _possibleConstructorReturn(this, (ReadTransform.__proto__ || Object.getPrototypeOf(ReadTransform)).call(this, Object.assign({ readableObjectMode: true, writableObjectMode: false })));

    _this.packet_no = 0;
    _this.data_state = { size: Infinity, data: [], recvd: 0 };
    return _this;
  }

  _createClass(ReadTransform, [{
    key: 'chunkify',
    value: function chunkify() {
      var out = [];
      while (true) {
        var ds = this.data_state;
        if (ds.size === Infinity && ds.recvd >= 4) {
          ds.size = ReadTransform.getsize(ds.data);
        }
        if (ds.size < Infinity && ds.size > 67108864) {
          // 64MB
          loggerr('Packets should not exceed 64MB (received %d bytes)', ds.size);
          throw new Error('oversized packet detected');
        }
        this.emit('progress', ds.recvd, ds.size);
        if (ds.size + 4 > ds.recvd) {
          if (debug) {
            loggerr('(%d/%d) Waiting for end of buffer', ds.recvd, ds.size + 4);
          }
          return out;
        }
        var buffer = new _buffer.ReadBuffer(Buffer.concat(ds.data, ds.recvd));
        var size = void 0;
        if (debug) {
          loggerr('(%d/%d) Received full buffer', ds.recvd, ds.size + 4);
        }
        try {
          size = types.QUInt.read(buffer);
        } catch (e) {
          throw new Error('Error while fetching buffer size');
        }
        if (debug) {
          loggerr('buffer size : %d', size);
        }
        var parsed = types.QVariant.read(buffer);
        if (debug) {
          loggerr('Received result: %O', parsed);
        }
        out.push(parsed);
        var remaining = buffer.remaining();
        if (remaining !== null) {
          this.data_state = {
            data: [remaining],
            recvd: remaining.length,
            size: Infinity
          };
        } else {
          this.data_state = { size: Infinity, data: [], recvd: 0 };
          return out;
        }
      }
    }
  }, {
    key: '_transform',
    value: function _transform(data, encoding, callback) {
      if (data !== null) {
        this.data_state.data.push(data);
        this.data_state.recvd += data.length;
      }
      var out = void 0;
      try {
        out = this.chunkify();
      } catch (e) {
        callback(e);
        return;
      }
      for (var i = 0; i < out.length; i++) {
        this.push(out[i]);
      }
      callback();
    }
  }, {
    key: '_flush',
    value: function _flush(callback) {
      if (this.data_state && this.data_state.recvd > 0) {
        callback('stream ended in the middle of a packet');
      }
    }
  }], [{
    key: 'getsize',
    value: function getsize(bufferlist) {
      // get 4 bytes
      var final_buffer = void 0;
      if (bufferlist[0] && bufferlist[0].length >= 4) {
        var _bufferlist = _slicedToArray(bufferlist, 1);

        final_buffer = _bufferlist[0];
      } else {
        var totallength = 0,
            i = 0;
        while (totallength < 4 && i < bufferlist.length) {
          totallength += bufferlist[i++].length;
        }
        if (totallength < 4) return Infinity;
        final_buffer = Buffer.concat(bufferlist.slice(0, i), totallength);
      }
      return final_buffer.readUInt32BE();
    }
  }]);

  return ReadTransform;
}(_stream.Transform);

/**
 * Transform JS types/objects into Qt buffers
 * @extends stream.Transform
 * @fires WriteTransform#data
 * @example
 * const { ReadTransform } = require('qtdatastream').transform;
 *
 * const writer = new WriteTransform();
 *
 * writer.on('data', (data) => {
 *   // data === Buffer <00 00 00 09 00 00 00 03 00 00 00 00 01>
 * });
 *
 * // Write an int
 * writer.write(1);
 */


var WriteTransform = exports.WriteTransform = function (_Transform2) {
  _inherits(WriteTransform, _Transform2);

  function WriteTransform() {
    _classCallCheck(this, WriteTransform);

    return _possibleConstructorReturn(this, (WriteTransform.__proto__ || Object.getPrototypeOf(WriteTransform)).call(this, Object.assign({ readableObjectMode: false, writableObjectMode: true })));
  }

  /**
   * Get the buffer representation of the object.
   * It is prefixed by the packet size as defined in Qt framework.
   * @static
   * @returns {Buffer} A Qt styled buffer ready to be sent through a socket
   */


  _createClass(WriteTransform, [{
    key: '_transform',
    value: function _transform(data, encoding, callback) {
      var buffer = WriteTransform.getBuffer(data);
      callback(null, buffer);
    }
  }], [{
    key: 'getBuffer',
    value: function getBuffer(data) {
      var buffer = types.QVariant.from(data).toBuffer();
      // Calculate size
      var totalSizeBuffer = types.QUInt.from(buffer.length).toBuffer();
      return Buffer.concat([totalSizeBuffer, buffer]);
    }
  }]);

  return WriteTransform;
}(_stream.Transform);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QVariant = exports.QUserType = exports.QMap = exports.QDateTime = exports.QStringList = exports.QList = exports.QString = exports.QByteArray = exports.QTime = exports.QChar = exports.QDouble = exports.QUInt64 = exports.QInt64 = exports.QUInt = exports.QInt = exports.QShort = exports.QBool = exports.QInvalid = exports.Types = exports.QClass = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * node-qtdatastream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://github.com/magne4000/node-qtdatastream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2017 Joël Charles
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

/** @module qtdatastream/types */

exports.qtype = qtype;

var _int64Buffer = __webpack_require__(5);

var _util = __webpack_require__(3);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract class that all Qt types must implement.
 * Subclasses are used to dictate how a value is represented
 * as a Buffer, and vice-versa.
 * @abstract
 * @param {*} obj underlying data that will be used by toBuffer() method
 */
var QClass = exports.QClass = function () {
  function QClass(obj) {
    _classCallCheck(this, QClass);

    this.obj = obj;
  }

  /**
   * @function from
   * @memberof module:qtdatastream/types.QClass
   * @abstract
   * @static
   * @param {*} subject
   * @returns {QClass}
   */


  _createClass(QClass, null, [{
    key: 'from',
    value: function from(subject) {
      if (subject instanceof QClass) {
        return subject;
      }
      return new this(subject);
    }
  }]);

  return QClass;
}();

/**
 * Decorator that affect QDatastream ID to classes.
 * Used for serialization and deserialization.
 * @example
 * // ES7
 * \@qtype(Types.QUInt)
 * class QUInt extends QClass {}
 * // ES6
 * class QUInt extends QClass {}
 * qtype(Types.QUInt)(QUInt);
 */


function qtype(qvarianttype) {
  return function (target) {
    if (!QClass.types) {
      QClass.types = new Map();
    }
    if (qvarianttype !== undefined) {
      QClass.types.set(qvarianttype, target);
    }
    target.qtype = qvarianttype;
  };
}

/**
 * Qt types contants
 * @readonly
 * @enum {number}
 * @name Types
 * @see {@link http://doc.qt.io/qt-4.8/qvariant.html#Type-enum|enum QVariant::Type}
 * @see {@link http://doc.qt.io/qt-4.8/datastreamformat.html|Serializing Qt Data Types}
 */
var Types = exports.Types = {
  INVALID: 0,
  BOOL: 1,
  INT: 2,
  UINT: 3,
  INT64: 4,
  UINT64: 5,
  DOUBLE: 6,
  CHAR: 7,
  MAP: 8,
  LIST: 9,
  STRING: 10,
  STRINGLIST: 11,
  BYTEARRAY: 12,
  TIME: 15,
  DATETIME: 16,
  USERTYPE: 127,
  SHORT: 133
};

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QInvalid = exports.QInvalid = function (_QClass) {
  _inherits(QInvalid, _QClass);

  function QInvalid() {
    _classCallCheck(this, QInvalid);

    return _possibleConstructorReturn(this, (QInvalid.__proto__ || Object.getPrototypeOf(QInvalid)).apply(this, arguments));
  }

  _createClass(QInvalid, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QInvalid
     * @inner
     * @returns {Buffer} Empty Buffer
     */
    value: function toBuffer() {
      return Buffer.alloc(0);
    }

    /**
     * Wraps subject into `QInvalid` object
     * @function from
     * @memberof module:qtdatastream/types.QInvalid
     * @static
     * @param {*} subject
     * @returns {QInvalid}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QInvalid
     * @static
     * @param {?Buffer} buffer
     * @returns {undefined} Always return `undefined`
     */
    value: function read(_buffer) {
      return undefined;
    }
  }]);

  return QInvalid;
}(QClass);

qtype(Types.INVALID)(QInvalid);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QBool = exports.QBool = function (_QClass2) {
  _inherits(QBool, _QClass2);

  function QBool() {
    _classCallCheck(this, QBool);

    return _possibleConstructorReturn(this, (QBool.__proto__ || Object.getPrototypeOf(QBool)).apply(this, arguments));
  }

  _createClass(QBool, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QBool
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var buf = Buffer.alloc(1);
      buf.writeInt8(this.obj, 0);
      return buf;
    }

    /**
     * Wraps subject into `QBool` object
     * @function from
     * @memberof module:qtdatastream/types.QBool
     * @static
     * @param {*} subject
     * @returns {QBool}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QBool
     * @static
     * @param {Buffer} buffer
     * @returns {boolean} Buffer coerced to boolean
     */
    value: function read(buffer) {
      return Boolean(buffer.readInt8());
    }
  }]);

  return QBool;
}(QClass);

qtype(Types.BOOL)(QBool);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QShort = exports.QShort = function (_QClass3) {
  _inherits(QShort, _QClass3);

  function QShort() {
    _classCallCheck(this, QShort);

    return _possibleConstructorReturn(this, (QShort.__proto__ || Object.getPrototypeOf(QShort)).apply(this, arguments));
  }

  _createClass(QShort, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QShort
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var buf = Buffer.alloc(2);
      buf.writeUInt16BE(this.obj, 0, true);
      return buf;
    }

    /**
     * Wraps subject into `QShort` object
     * @function from
     * @memberof module:qtdatastream/types.QShort
     * @static
     * @param {*} subject
     * @returns {QShort}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QShort
     * @static
     * @param {Buffer} buffer
     * @returns {number} Buffer coerced to number
     */
    value: function read(buffer) {
      return buffer.readInt16BE();
    }
  }]);

  return QShort;
}(QClass);

qtype(Types.SHORT)(QShort);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QInt = exports.QInt = function (_QClass4) {
  _inherits(QInt, _QClass4);

  function QInt() {
    _classCallCheck(this, QInt);

    return _possibleConstructorReturn(this, (QInt.__proto__ || Object.getPrototypeOf(QInt)).apply(this, arguments));
  }

  _createClass(QInt, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QInt
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var buf = Buffer.alloc(4);
      buf.writeInt32BE(this.obj, 0, true);
      return buf;
    }

    /**
     * Wraps subject into `QInt` object
     * @function from
     * @memberof module:qtdatastream/types.QInt
     * @static
     * @param {*} subject
     * @returns {QInt}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QInt
     * @static
     * @param {Buffer} buffer
     * @returns {number} Buffer coerced to number
     */
    value: function read(buffer) {
      return buffer.readInt32BE();
    }
  }]);

  return QInt;
}(QClass);

qtype(Types.INT)(QInt);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QUInt = exports.QUInt = function (_QClass5) {
  _inherits(QUInt, _QClass5);

  function QUInt() {
    _classCallCheck(this, QUInt);

    return _possibleConstructorReturn(this, (QUInt.__proto__ || Object.getPrototypeOf(QUInt)).apply(this, arguments));
  }

  _createClass(QUInt, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QUInt
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var buf = Buffer.alloc(4);
      buf.writeUInt32BE(this.obj, 0, true);
      return buf;
    }

    /**
     * Wraps subject into `QUInt` object
     * @function from
     * @memberof module:qtdatastream/types.QUInt
     * @static
     * @param {*} subject
     * @returns {QUInt}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QUInt
     * @static
     * @param {Buffer} buffer
     * @returns {number} Buffer coerced to number
     */
    value: function read(buffer) {
      return buffer.readUInt32BE();
    }
  }]);

  return QUInt;
}(QClass);

qtype(Types.UINT)(QUInt);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QInt64 = exports.QInt64 = function (_QClass6) {
  _inherits(QInt64, _QClass6);

  function QInt64() {
    _classCallCheck(this, QInt64);

    return _possibleConstructorReturn(this, (QInt64.__proto__ || Object.getPrototypeOf(QInt64)).apply(this, arguments));
  }

  _createClass(QInt64, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QInt64
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      return new _int64Buffer.Int64BE(this.obj).toBuffer();
    }

    /**
     * Wraps subject into `QInt64` object
     * @function from
     * @memberof module:qtdatastream/types.QInt64
     * @static
     * @param {*} subject
     * @returns {QInt64}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QInt64
     * @static
     * @param {Buffer} buffer
     * @returns {number} Buffer coerced to number
     */
    value: function read(buffer) {
      return buffer.readInt64BE();
    }
  }]);

  return QInt64;
}(QClass);

qtype(Types.INT64)(QInt64);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QUInt64 = exports.QUInt64 = function (_QClass7) {
  _inherits(QUInt64, _QClass7);

  function QUInt64() {
    _classCallCheck(this, QUInt64);

    return _possibleConstructorReturn(this, (QUInt64.__proto__ || Object.getPrototypeOf(QUInt64)).apply(this, arguments));
  }

  _createClass(QUInt64, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QUInt64
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      return new _int64Buffer.Uint64BE(this.obj).toBuffer();
    }

    /**
     * Wraps subject into `QUInt64` object
     * @function from
     * @memberof module:qtdatastream/types.QUInt64
     * @static
     * @param {*} subject
     * @returns {QUInt64}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QUInt64
     * @static
     * @param {Buffer} buffer
     * @returns {number} Buffer coerced to number
     */
    value: function read(buffer) {
      return buffer.readUInt64BE();
    }
  }]);

  return QUInt64;
}(QClass);

qtype(Types.UINT64)(QUInt64);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QDouble = exports.QDouble = function (_QClass8) {
  _inherits(QDouble, _QClass8);

  function QDouble() {
    _classCallCheck(this, QDouble);

    return _possibleConstructorReturn(this, (QDouble.__proto__ || Object.getPrototypeOf(QDouble)).apply(this, arguments));
  }

  _createClass(QDouble, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QDouble
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var buf = Buffer.alloc(8);
      buf.writeDoubleBE(this.obj, 0, true);
      return buf;
    }

    /**
     * Wraps subject into `QDouble` object
     * @function from
     * @memberof module:qtdatastream/types.QDouble
     * @static
     * @param {*} subject
     * @returns {QDouble}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QDouble
     * @static
     * @param {Buffer} buffer
     * @returns {number} Buffer coerced to number
     */
    value: function read(buffer) {
      return buffer.readDoubleBE();
    }
  }]);

  return QDouble;
}(QClass);

qtype(Types.DOUBLE)(QDouble);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QChar = exports.QChar = function (_QClass9) {
  _inherits(QChar, _QClass9);

  function QChar(obj) {
    _classCallCheck(this, QChar);

    if (typeof obj !== 'string') throw new Error(obj + ' is not a string');
    if (obj.length !== 1) throw new Error(obj + ' length must equal 1');
    return _possibleConstructorReturn(this, (QChar.__proto__ || Object.getPrototypeOf(QChar)).call(this, obj));
  }

  /**
   * @function read
   * @memberof module:qtdatastream/types.QChar
   * @static
   * @param {Buffer} buffer
   * @returns {string} Buffer coerced to string
   */


  _createClass(QChar, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QChar
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      return Buffer.from(this.obj, 'ucs2').swap16();
    }

    /**
     * Wraps subject into `QChar` object
     * @function from
     * @memberof module:qtdatastream/types.QChar
     * @static
     * @param {*} subject
     * @returns {QChar}
     */

  }], [{
    key: 'read',
    value: function read(buffer) {
      var stringBuffer = buffer.slice(2);
      return stringBuffer.swap16().toString('ucs2');
    }
  }]);

  return QChar;
}(QClass);

qtype(Types.CHAR)(QChar);

/**
 * @extends module:qtdatastream/types.QUInt
 * @param {*} obj
 * @see {@link module:qtdatastream/types.QUInt}
 */

var QTime = exports.QTime = function (_QUInt) {
  _inherits(QTime, _QUInt);

  function QTime() {
    _classCallCheck(this, QTime);

    return _possibleConstructorReturn(this, (QTime.__proto__ || Object.getPrototypeOf(QTime)).apply(this, arguments));
  }

  return QTime;
}(QUInt);

qtype(Types.TIME)(QTime);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QByteArray = exports.QByteArray = function (_QClass10) {
  _inherits(QByteArray, _QClass10);

  function QByteArray() {
    _classCallCheck(this, QByteArray);

    return _possibleConstructorReturn(this, (QByteArray.__proto__ || Object.getPrototypeOf(QByteArray)).apply(this, arguments));
  }

  _createClass(QByteArray, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QByteArray
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      if (this.obj === null) {
        return QUInt.from(0xffffffff).toBuffer();
      }
      var buf = Buffer.from(this.obj);
      var buflength = QUInt.from(buf.length).toBuffer();
      return Buffer.concat([buflength, buf]);
    }

    /**
     * Wraps subject into `QByteArray` object
     * @function from
     * @memberof module:qtdatastream/types.QByteArray
     * @static
     * @param {*} subject
     * @returns {QByteArray}
     */

  }], [{
    key: 'read',

    /**
     * Use {@link module:qtdatastream/util.str} to convert the returned Buffer
     * to a string.
     * @function read
     * @memberof module:qtdatastream/types.QByteArray
     * @static
     * @param {Buffer} buffer
     * @returns {Buffer}
     */
    value: function read(buffer) {
      var arraySize = QUInt.read(buffer);
      if (arraySize === 0 || arraySize === 0xffffffff) return null;

      return buffer.slice(arraySize);
    }
  }]);

  return QByteArray;
}(QClass);

qtype(Types.BYTEARRAY)(QByteArray);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QString = exports.QString = function (_QClass11) {
  _inherits(QString, _QClass11);

  function QString() {
    _classCallCheck(this, QString);

    return _possibleConstructorReturn(this, (QString.__proto__ || Object.getPrototypeOf(QString)).apply(this, arguments));
  }

  _createClass(QString, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QString
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      if (this.obj === null) {
        return QUInt.from(0xffffffff).toBuffer();
      }
      var bufstring = Buffer.from(this.obj, 'ucs2');
      bufstring.swap16();
      var buflength = QUInt.from(bufstring.length).toBuffer();
      return Buffer.concat([buflength, bufstring]);
    }

    /**
     * Wraps subject into `QString` object
     * @function from
     * @memberof module:qtdatastream/types.QString
     * @static
     * @param {*} subject
     * @returns {QString}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QString
     * @static
     * @param {Buffer} buffer
     * @returns {string} Buffer coerced to string
     */
    value: function read(buffer) {
      var stringSize = QUInt.read(buffer);
      if (stringSize === 0 || stringSize === 0xffffffff) return '';

      var stringBuffer = buffer.slice(stringSize);
      return stringBuffer.swap16().toString('ucs2');
    }
  }]);

  return QString;
}(QClass);

qtype(Types.STRING)(QString);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QList = exports.QList = function (_QClass12) {
  _inherits(QList, _QClass12);

  function QList() {
    _classCallCheck(this, QList);

    return _possibleConstructorReturn(this, (QList.__proto__ || Object.getPrototypeOf(QList)).apply(this, arguments));
  }

  _createClass(QList, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QList
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var bufs = [];
      // nb of elements in the list
      bufs.push(QUInt.from(this.obj.length).toBuffer());
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;

          // Values are QVariant
          bufs.push(QVariant.from(el).toBuffer());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return Buffer.concat(bufs);
    }

    /**
     * Wraps subject into `QList` object
     * @function from
     * @memberof module:qtdatastream/types.QList
     * @static
     * @param {*} subject
     * @returns {QList}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QList
     * @static
     * @param {Buffer} buffer
     * @returns {Array} Buffer coerced to an array
     */
    value: function read(buffer) {
      var listSize = QUInt.read(buffer),
          l = Array(listSize);
      for (var i = 0; i < listSize; i++) {
        l[i] = QVariant.read(buffer);
      }
      return l;
    }
  }]);

  return QList;
}(QClass);

qtype(Types.LIST)(QList);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QStringList = exports.QStringList = function (_QClass13) {
  _inherits(QStringList, _QClass13);

  function QStringList() {
    _classCallCheck(this, QStringList);

    return _possibleConstructorReturn(this, (QStringList.__proto__ || Object.getPrototypeOf(QStringList)).apply(this, arguments));
  }

  _createClass(QStringList, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QStringList
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var bufs = [];
      // nb of elements in the list
      bufs.push(QUInt.from(this.obj.length).toBuffer());
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.obj[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var el = _step2.value;

          // Values are QString
          bufs.push(QString.from(el).toBuffer());
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return Buffer.concat(bufs);
    }

    /**
     * Wraps subject into `QStringList` object
     * @function from
     * @memberof module:qtdatastream/types.QStringList
     * @static
     * @param {*} subject
     * @returns {QStringList}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QStringList
     * @static
     * @param {Buffer} buffer
     * @returns {Array.<string>} Buffer coerced to an array of strings
     */
    value: function read(buffer) {
      var listSize = QUInt.read(buffer),
          l = Array(listSize);
      for (var i = 0; i < listSize; i++) {
        l[i] = QString.read(buffer);
      }
      return l;
    }
  }]);

  return QStringList;
}(QClass);

qtype(Types.STRINGLIST)(QStringList);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QDateTime = exports.QDateTime = function (_QClass14) {
  _inherits(QDateTime, _QClass14);

  function QDateTime() {
    _classCallCheck(this, QDateTime);

    return _possibleConstructorReturn(this, (QDateTime.__proto__ || Object.getPrototypeOf(QDateTime)).apply(this, arguments));
  }

  _createClass(QDateTime, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QDateTime
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var bufs = [];
      var milliseconds = (this.obj.getTime() - this.obj.getTimezoneOffset() * 60000) % 86400000;
      var julianday = (0, _util.dateToJulianDay)(this.obj);
      bufs.push(QUInt.from(julianday).toBuffer());
      bufs.push(QUInt.from(milliseconds).toBuffer());
      bufs.push(QBool.from(this.obj.getTimezoneOffset() === 0).toBuffer());
      return Buffer.concat(bufs);
    }

    /**
     * Wraps subject into `QDateTime` object
     * @function from
     * @memberof module:qtdatastream/types.QDateTime
     * @static
     * @param {*} subject
     * @returns {QDateTime}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QDateTime
     * @static
     * @param {Buffer} buffer
     * @returns {Date} Buffer coerced to a Date
     */
    value: function read(buffer) {
      var julianDay = QUInt.read(buffer);
      var msecondsSinceMidnight = QUInt.read(buffer);
      var _isUTC = QBool.read(buffer);
      var dateAtMidnight = (0, _util.julianDayToDate)(julianDay);
      dateAtMidnight.setMilliseconds(msecondsSinceMidnight);
      return dateAtMidnight;
    }
  }]);

  return QDateTime;
}(QClass);

qtype(Types.DATETIME)(QDateTime);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QMap = exports.QMap = function (_QClass15) {
  _inherits(QMap, _QClass15);

  function QMap() {
    _classCallCheck(this, QMap);

    return _possibleConstructorReturn(this, (QMap.__proto__ || Object.getPrototypeOf(QMap)).apply(this, arguments));
  }

  _createClass(QMap, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QMap
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var bufs = [];
      // keys are all QString
      // values are all QVariant
      if (this.obj instanceof Map) {
        // Map number of elements
        bufs.push(QUInt.from(this.obj.size).toBuffer());
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.obj[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _ref = _step3.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var value = _ref2[1];

            // write key
            bufs.push(QString.from(key).toBuffer());
            // write value
            bufs.push(QVariant.from(value).toBuffer());
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } else {
        var keys = Object.keys(this.obj);
        // Map number of elements
        bufs.push(QUInt.from(keys.length).toBuffer());
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = keys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _key = _step4.value;

            // write key
            bufs.push(QString.from(_key).toBuffer());
            // write value
            bufs.push(QVariant.from(this.obj[_key]).toBuffer());
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
      return Buffer.concat(bufs);
    }

    /**
     * Wraps subject into `QMap` object
     * @function from
     * @memberof module:qtdatastream/types.QMap
     * @static
     * @param {*} subject
     * @returns {QMap}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QMap
     * @static
     * @param {Buffer} buffer
     * @returns {Object} Buffer coerced to an Object
     */
    value: function read(buffer) {
      var mapSize = QUInt.read(buffer);
      var map = {},
          key = void 0,
          value = void 0;
      for (var i = 0; i < mapSize; i++) {
        key = QString.read(buffer);
        value = QVariant.read(buffer);
        map[key] = value;
      }
      return map;
    }
  }]);

  return QMap;
}(QClass);

qtype(Types.MAP)(QMap);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QUserType = exports.QUserType = function (_QClass16) {
  _inherits(QUserType, _QClass16);

  function QUserType(name, obj) {
    _classCallCheck(this, QUserType);

    if (!obj) {
      obj = name;
      name = undefined;
    }

    var _this17 = _possibleConstructorReturn(this, (QUserType.__proto__ || Object.getPrototypeOf(QUserType)).call(this, obj));

    _this17.name = name;
    return _this17;
  }

  /**
   * @function createComplexUserType
   * @memberof module:qtdatastream/types.QUserType
   * @static
   * @protected
   * @param {*} value
   * @returns {QUserType} a new class that extends QUserType
   */


  _createClass(QUserType, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QUserType
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var skipname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.name) {
        throw new Error('Abstract QUserType cannot be converted to a buffer');
      }
      var bufs = [];
      if (!skipname) {
        bufs.push(QByteArray.from(this.name).toBuffer());
      }
      bufs.push(QUserType.usertypes.get(this.name).from(this.obj).toBuffer());
      return Buffer.concat(bufs);
    }

    /**
     * Wraps subject into `QUserType` object
     * @function from
     * @memberof module:qtdatastream/types.QUserType
     * @static
     * @param {*} subject
     * @returns {QUserType}
     */

  }], [{
    key: 'createComplexUserType',
    value: function createComplexUserType(value) {
      var compiled = [];
      var key = void 0,
          keys = void 0,
          type = void 0;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = value[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          type = _step5.value;

          var _Object$keys = Object.keys(type);

          var _Object$keys2 = _slicedToArray(_Object$keys, 1);

          key = _Object$keys2[0];

          keys = { key: key };
          if (typeof type[key] === 'string') {
            // It's a QUserType
            keys.quserclassname = type[key];
            keys.quserclass = QUserType.usertypes.get(type[key]);
          } else {
            keys.quserclass = QClass.types.get(type[key]);
          }
          if (!keys.quserclass) {
            throw new Error('Type ' + type[key] + ' does not exists');
          }
          compiled.push(keys);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return function (_QUserType) {
        _inherits(_class, _QUserType);

        function _class() {
          _classCallCheck(this, _class);

          return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
          key: 'toBuffer',
          value: function toBuffer() {
            var bufs = [];
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = compiled[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var elt = _step6.value;

                bufs.push(elt.quserclass.from(this.obj[elt.key]).toBuffer(true));
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }

            return Buffer.concat(bufs);
          }
        }], [{
          key: 'read',
          value: function read(buffer) {
            var obj = {};
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = compiled[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var elt = _step7.value;

                Object.defineProperty(obj, elt.key, {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value: elt.quserclass.read(buffer, keys.quserclassname)
                });
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }

            return obj;
          }
        }]);

        return _class;
      }(QUserType);
    }

    /**
     * @function createUserType
     * @memberof module:qtdatastream/types.QUserType
     * @static
     * @protected
     * @param {*} value
     * @returns {QUserType} a new class that extends QUserType
     */

  }, {
    key: 'createUserType',
    value: function createUserType(value) {
      if (Array.isArray(value)) {
        return QUserType.createComplexUserType(value);
      }
      var qclass = QClass.types.get(value);

      return function (_QUserType2) {
        _inherits(_class2, _QUserType2);

        function _class2() {
          _classCallCheck(this, _class2);

          return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
        }

        _createClass(_class2, [{
          key: 'toBuffer',
          value: function toBuffer() {
            return qclass.from(this.obj).toBuffer();
          }
        }], [{
          key: 'read',
          value: function read(buffer) {
            return qclass.read(buffer);
          }
        }]);

        return _class2;
      }(QUserType);
    }

    /**
     * Register a custom usertype
     * @function register
     * @memberof module:qtdatastream/types.QUserType
     * @static
     * @param {string} name
     * @param {*} value
     * @example
     * const { QUserType } = require('qtdatastream').types;
     * QUserType.register('NWI', types.Types.INT);
     * QUserType.register('BufferInfo', [
     *   { type: types.Types.SHORT },
     *   { name: types.Types.BYTEARRAY },
     *   { ni1: 'NWI' },
     *   { ni2: 'NWI' }
     * ]);
     */

  }, {
    key: 'register',
    value: function register(name, value) {
      if (!QUserType.usertypes) {
        QUserType.usertypes = new Map();
      }
      QUserType.usertypes.set(name, QUserType.createUserType(value));
    }

    /**
     * @function read
     * @memberof module:qtdatastream/types.QUserType
     * @static
     * @param {Buffer} buffer
     * @param {string} name name with which the usertype has been registered
     * @returns {*} Buffer coerced to whatever have been registered
     */

  }, {
    key: 'read',
    value: function read(buffer, name) {
      if (!name) {
        var bname = QByteArray.read(buffer);
        name = (0, _util.str)(bname);
      }
      var usertype = QUserType.usertypes.get(name);
      if (!usertype) {
        throw new Error('Unregistered usertype ' + name);
      }
      return usertype.read(buffer);
    }
  }]);

  return QUserType;
}(QClass);

qtype(Types.USERTYPE)(QUserType);

/**
 * @extends module:qtdatastream/types.QClass
 * @param {*} obj
 */

var QVariant = exports.QVariant = function (_QClass17) {
  _inherits(QVariant, _QClass17);

  function QVariant() {
    _classCallCheck(this, QVariant);

    return _possibleConstructorReturn(this, (QVariant.__proto__ || Object.getPrototypeOf(QVariant)).apply(this, arguments));
  }

  _createClass(QVariant, [{
    key: 'toBuffer',


    /**
     * @function toBuffer
     * @memberof module:qtdatastream/types.QVariant
     * @inner
     * @returns {Buffer}
     */
    value: function toBuffer() {
      var isNull = this.obj === undefined || this.obj === null;
      var typeofobj = _typeof(this.obj);
      var type = void 0;
      if (this.obj === undefined) {
        type = Types.INVALID;
      } else if (this.obj instanceof QUserType) {
        type = Types.USERTYPE;
      } else if (this.obj instanceof QClass) {
        type = this.obj.constructor.qtype;
      } else if (typeofobj === 'string') {
        type = Types.STRING;
      } else if (typeofobj === 'number') {
        type = Types.UINT;
      } else if (typeofobj === 'boolean') {
        type = Types.BOOL;
      } else if (this.obj instanceof Date) {
        type = Types.DATETIME;
      } else if (this.obj instanceof Array) {
        type = Types.LIST;
      } else {
        type = Types.MAP;
      }
      var qclass = QClass.types.get(type);
      if (!qclass) {
        throw new Error('Undefined type ' + type + ' from QVariant');
      }
      var bufqvarianttype = QUInt.from(type).toBuffer();
      var bufqvariantisnull = QBool.from(isNull).toBuffer();
      var bufs = [bufqvarianttype, bufqvariantisnull];
      if (!isNull) {
        bufs.push(qclass.from(this.obj).toBuffer());
      }
      return Buffer.concat(bufs);
    }

    /**
     * Wraps subject into `QVariant` object
     * @function from
     * @memberof module:qtdatastream/types.QVariant
     * @static
     * @param {*} subject
     * @returns {QVariant}
     */

  }], [{
    key: 'read',

    /**
     * @function read
     * @memberof module:qtdatastream/types.QVariant
     * @static
     * @param {Buffer} buffer
     * @returns {*} Buffer coerced to underlying QVariant type
     */
    value: function read(buffer) {
      var type = QUInt.read(buffer);
      var isNull = QBool.read(buffer);
      return isNull ? undefined : QClass.types.get(type).read(buffer);
    }
  }]);

  return QVariant;
}(QClass);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.str = str;
exports.dateToJulianDay = dateToJulianDay;
exports.julianDayToDate = julianDayToDate;
/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/util */

/**
 * Apply `toString()` method on Buffer and remove NUL end char
 * @param {Buffer} obj
 * @returns {string}
 */
function str(obj) {
  var str = obj.toString();
  return str.replace('\0', '');
}

/**
 * Convert a Date object to a Julian day representation
 * @param {Date} d
 * @returns {number}
 */
function dateToJulianDay(d) {
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var a = Math.floor((14 - month) / 12);
  var y = Math.floor(year + 4800 - a);
  var m = month + 12 * a - 3;
  var jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jdn;
}

/**
 * Convert a Julian day representation to a Date object
 * @param {number} i
 * @returns {Date}
 */
function julianDayToDate(i) {
  var y = 4716;
  var v = 3;
  var j = 1401;
  var u = 5;
  var m = 2;
  var s = 153;
  var n = 12;
  var w = 2;
  var r = 4;
  var B = 274277;
  var p = 1461;
  var C = -38;
  var f = i + j + Math.floor(Math.floor((4 * i + B) / 146097) * 3 / 4) + C;
  var e = r * f + v;
  var g = Math.floor(e % p / r);
  var h = u * g + w;
  var D = Math.floor(h % s / u) + 1;
  var M = (Math.floor(h / s) + m) % n + 1;
  var Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n);
  return new Date(Y, M - 1, D);
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("int64-buffer");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/socket */

var events = __webpack_require__(7);
var debuglib = __webpack_require__(4);
var transform = __webpack_require__(1);
var logger = debuglib('qtdatastream:main');
var debug = Boolean(__webpack_require__.i({"NODE_ENV":"development"}).QTDSDEBUG) || debuglib.enabled('qtdatastream:*');

if (debug && !debuglib.enabled('qtdatastream:*')) {
  debuglib.enable('qtdatastream:*');
}

/**
 * Qt compliant Socket overload.
 * `data` event is triggered only when full buffer is parsed.
 * `error`, `close` and `end` event are not altered.
 * @extends events.EventEmitter
 * @param {*} socket Underlying socket
 * @example
 * const { Socket } = require('qtdatastream').socket;
 *
 * // socket can be a net.Socket or a websocket
 * const qtsocket = new Socket(socket);
 * qtsocket.on('read', (data) => {
 *   console.log(data);
 * });
 * qtsocket.write('Hello');
 */

var Socket = exports.Socket = function (_events$EventEmitter) {
  _inherits(Socket, _events$EventEmitter);

  function Socket(socket) {
    _classCallCheck(this, Socket);

    var _this = _possibleConstructorReturn(this, (Socket.__proto__ || Object.getPrototypeOf(Socket)).call(this));

    _this.socket = socket;
    _this.data_state = null;
    _this.write_stream = new transform.WriteTransform();
    _this.read_stream = new transform.ReadTransform();
    _this.read_stream.on('data', function (data) {
      process.nextTick(function () {
        return _this.emit('data', data);
      });
    });

    if (socket) _this.setSocket(socket);
    return _this;
  }

  /**
   * Transforms and write data to underlying socket
   * @function module:qtdatastream/socket.Socket#write
   * @param {*} data
   */


  _createClass(Socket, [{
    key: 'write',
    value: function write(data) {
      this.write_stream.write(data);
    }

    /**
     * Detach underlying socket
     * @function module:qtdatastream/socket.Socket#detachSocket
     * @returns {stream.Duplex} underlying socket that has been detached
     */

  }, {
    key: 'detachSocket',
    value: function detachSocket() {
      if (debug) {
        logger('removing socket');
      }
      var socket = this.socket;

      this.write_stream.unpipe(socket);
      socket.unpipe(this.read_stream);
      socket.removeAllListeners();
      this.socket = null;
      return socket;
    }

    /**
     * Update the socket (for example to promote it to SSL stream)
     * @function module:qtdatastream/socket.Socket#setSocket
     * @param {stream.Duplex} socket
     */

  }, {
    key: 'setSocket',
    value: function setSocket(socket) {
      var _this2 = this;

      if (this.socket !== null) {
        this.detachSocket();
      }

      if (debug) {
        logger('updating socket');
      }

      this.socket = socket;
      this.write_stream.pipe(this.socket).pipe(this.read_stream);

      this.socket.on('error', function (e) {
        if (debug) {
          logger('ERROR');
        }
        _this2.emit('error', e);
      });

      this.socket.on('close', function () {
        if (debug) {
          logger('Connection closed');
        }
        _this2.emit('close');
      });

      this.socket.on('end', function () {
        if (debug) {
          logger('END');
        }
        _this2.emit('end');
      });
    }
  }]);

  return Socket;
}(events.EventEmitter);

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.util = __webpack_require__(3);
exports.types = __webpack_require__(2);
exports.buffer = __webpack_require__(0);
exports.socket = __webpack_require__(6);
exports.transform = __webpack_require__(1);

/***/ })
/******/ ]);
//# sourceMappingURL=qtdatastream.js.map