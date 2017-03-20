/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/types */

const { Int64BE, Uint64BE } = require('int64-buffer');
const { dateToJulianDay, julianDayToDate, str: bstr } = require('./util');

/**
 * Abstract class that all Qt types must implement.
 * Subclasses are used to dictate how a value is represented
 * as a Buffer, and vice-versa.
 * @abstract
 * @static
 * @param {*} obj underlying data that will be used by toBuffer() method
 */
class QClass {
  constructor(obj) {
    this.obj = (obj !== undefined && obj !== null && typeof obj.export === 'function') ? obj.export() : obj;
  }

  /**
   * @function from
   * @memberof module:qtdatastream/types.QClass
   * @abstract
   * @static
   * @param {*} subject
   * @returns {QClass}
   */
  static from(subject) {
    if (subject instanceof this) {
      return subject;
    }
    return new this(subject);
  }
}

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
  return function(target) {
    if (!QClass.types) {
      QClass.types = new Map;
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
 * @static
 * @enum {number}
 * @name Types
 * @see {@link http://doc.qt.io/qt-4.8/qvariant.html#Type-enum|enum QVariant::Type}
 * @see {@link http://doc.qt.io/qt-4.8/datastreamformat.html|Serializing Qt Data Types}
 */
const Types = {
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
 * Abstract class that custom classes should implement
 * in order to use @exportas decorator.
 * @abstract
 * @static
 */
class Exportable {

  ['export']() {
    const self = typeof this._export === 'function' ? this._export : () => this;
    const subject = this.__exportas ? this._mapping() : self();
    return (this.__usertype ? QUserType.get(this.__usertype) : QMap).from(subject);
  }

  _mapping() {
    const ret = {};
    const keys = Object.keys(this.__exportas);
    for (let key of keys) {
      Object.defineProperty(ret, key, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: this.__exportas[key](this)
      });
    }
    return ret;
  }
}

function usertype(susertype) {
  return function(target) {
    Object.defineProperty(target, '__usertype', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: susertype
    });
  };
}

function exportas(qclass, exportkey) {
  return function(target, key, descriptor) {
    if (!('set' in descriptor)) {
      descriptor.writable = true;
    }
    if (!target.hasOwnProperty('__exportas')) {
      Object.defineProperty(target, '__exportas', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: {}
      });
    }
    Object.defineProperty(target.__exportas, exportkey || key, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: (context) => qclass.from(context[key])
    });
    return descriptor;
  };
}

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QInvalid extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QInvalid
   * @static
   * @param {?Buffer} buffer
   * @returns {undefined} Always return `undefined`
   */
  static read(_buffer) {
    return undefined;
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QInvalid
   * @inner
   * @returns {Buffer} Empty Buffer
   */
  toBuffer() {
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
}
qtype(Types.INVALID)(QInvalid);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QBool extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QBool
   * @static
   * @param {Buffer} buffer
   * @returns {boolean} Buffer coerced to boolean
   */
  static read(buffer) {
    return Boolean(buffer.readInt8());
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QBool
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const buf = Buffer.alloc(1);
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
}
qtype(Types.BOOL)(QBool);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QShort extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QShort
   * @static
   * @param {Buffer} buffer
   * @returns {number} Buffer coerced to number
   */
  static read(buffer) {
    return buffer.readInt16BE();
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QShort
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const buf = Buffer.alloc(2);
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
}
qtype(Types.SHORT)(QShort);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QInt extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QInt
   * @static
   * @param {Buffer} buffer
   * @returns {number} Buffer coerced to number
   */
  static read(buffer) {
    return buffer.readInt32BE();
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QInt
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const buf = Buffer.alloc(4);
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
}
qtype(Types.INT)(QInt);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QUInt extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QUInt
   * @static
   * @param {Buffer} buffer
   * @returns {number} Buffer coerced to number
   */
  static read(buffer) {
    return buffer.readUInt32BE();
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QUInt
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const buf = Buffer.alloc(4);
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
}
qtype(Types.UINT)(QUInt);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QInt64 extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QInt64
   * @static
   * @param {Buffer} buffer
   * @returns {number} Buffer coerced to number
   */
  static read(buffer) {
    return buffer.readInt64BE();
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QInt64
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    return (new Int64BE(this.obj)).toBuffer();
  }

  /**
   * Wraps subject into `QInt64` object
   * @function from
   * @memberof module:qtdatastream/types.QInt64
   * @static
   * @param {*} subject
   * @returns {QInt64}
   */
}
qtype(Types.INT64)(QInt64);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QUInt64 extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QUInt64
   * @static
   * @param {Buffer} buffer
   * @returns {number} Buffer coerced to number
   */
  static read(buffer) {
    return buffer.readUInt64BE();
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QUInt64
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    return (new Uint64BE(this.obj)).toBuffer();
  }

  /**
   * Wraps subject into `QUInt64` object
   * @function from
   * @memberof module:qtdatastream/types.QUInt64
   * @static
   * @param {*} subject
   * @returns {QUInt64}
   */
}
qtype(Types.UINT64)(QUInt64);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QDouble extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QDouble
   * @static
   * @param {Buffer} buffer
   * @returns {number} Buffer coerced to number
   */
  static read(buffer) {
    return buffer.readDoubleBE();
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QDouble
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const buf = Buffer.alloc(8);
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
}
qtype(Types.DOUBLE)(QDouble);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QChar extends QClass {
  constructor(obj){
    super(obj);
    if (typeof this.obj !== 'string') throw new Error(`${this.obj} is not a string`);
    if (this.obj.length !== 1) throw new Error(`${this.obj} length must equal 1`);
  }

  /**
   * @function read
   * @memberof module:qtdatastream/types.QChar
   * @static
   * @param {Buffer} buffer
   * @returns {string} Buffer coerced to string
   */
  static read(buffer) {
    const stringBuffer = buffer.slice(2);
    return stringBuffer.swap16().toString('ucs2');
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QChar
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
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
}
qtype(Types.CHAR)(QChar);

/**
 * @extends module:qtdatastream/types.QUInt
 * @static
 * @param {*} obj
 * @see {@link module:qtdatastream/types.QUInt}
 */
class QTime extends QUInt {}
qtype(Types.TIME)(QTime);


/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QByteArray extends QClass {
  /**
   * Use {@link module:qtdatastream/util.str} to convert the returned Buffer
   * to a string.
   * @function read
   * @memberof module:qtdatastream/types.QByteArray
   * @static
   * @param {Buffer} buffer
   * @returns {Buffer}
   */
  static read(buffer) {
    const arraySize = QUInt.read(buffer);
    if (arraySize === 0 || arraySize === 0xffffffff) return null;

    return buffer.slice(arraySize);
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QByteArray
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    if (this.obj === null) {
      return QUInt.from(0xffffffff).toBuffer();
    }
    const buf = Buffer.from(this.obj);
    const buflength = QUInt.from(buf.length).toBuffer();
    return Buffer.concat([ buflength, buf ]);
  }

  /**
   * Wraps subject into `QByteArray` object
   * @function from
   * @memberof module:qtdatastream/types.QByteArray
   * @static
   * @param {*} subject
   * @returns {QByteArray}
   */
}
qtype(Types.BYTEARRAY)(QByteArray);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QString extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QString
   * @static
   * @param {Buffer} buffer
   * @returns {string} Buffer coerced to string
   */
  static read(buffer) {
    const stringSize = QUInt.read(buffer);
    if (stringSize === 0 || stringSize === 0xffffffff) return '';

    const stringBuffer = buffer.slice(stringSize);
    return stringBuffer.swap16().toString('ucs2');
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QString
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    if (this.obj === null) {
      return QUInt.from(0xffffffff).toBuffer();
    }
    let bufstring;
    if (typeof this.obj === 'number') {
      bufstring = Buffer.from(String(this.obj), 'ucs2');
    } else {
      bufstring = Buffer.from(this.obj, 'ucs2');
    }
    bufstring.swap16();
    const buflength = QUInt.from(bufstring.length).toBuffer();
    return Buffer.concat([ buflength, bufstring ]);
  }

  /**
   * Wraps subject into `QString` object
   * @function from
   * @memberof module:qtdatastream/types.QString
   * @static
   * @param {*} subject
   * @returns {QString}
   */
}
qtype(Types.STRING)(QString);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QList extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QList
   * @static
   * @param {Buffer} buffer
   * @returns {Array} Buffer coerced to an array
   */
  static read(buffer) {
    const listSize = QUInt.read(buffer), l = Array(listSize);
    for (let i=0; i<listSize; i++) {
      l[i] = QVariant.read(buffer);
    }
    return l;
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QList
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const bufs = [];
    // nb of elements in the list
    bufs.push(QUInt.from(this.obj.length).toBuffer());
    for (let el of this.obj) {
      // Values are QVariant
      bufs.push(QVariant.from(el).toBuffer());
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
}
qtype(Types.LIST)(QList);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QStringList extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QStringList
   * @static
   * @param {Buffer} buffer
   * @returns {Array.<string>} Buffer coerced to an array of strings
   */
  static read(buffer) {
    const listSize = QUInt.read(buffer), l = Array(listSize);
    for (let i=0; i<listSize; i++) {
      l[i] = QString.read(buffer);
    }
    return l;
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QStringList
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const bufs = [];
        // nb of elements in the list
    bufs.push(QUInt.from(this.obj.length).toBuffer());
    for (let el of this.obj) {
            // Values are QString
      bufs.push(QString.from(el).toBuffer());
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
}
qtype(Types.STRINGLIST)(QStringList);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QDateTime extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QDateTime
   * @static
   * @param {Buffer} buffer
   * @returns {Date} Buffer coerced to a Date
   */
  static read(buffer) {
    const julianDay = QUInt.read(buffer);
    const msecondsSinceMidnight = QUInt.read(buffer);
    const _isUTC = QBool.read(buffer);
    const dateAtMidnight = julianDayToDate(julianDay);
    dateAtMidnight.setMilliseconds(msecondsSinceMidnight);
    return dateAtMidnight;
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QDateTime
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const bufs = [];
    const milliseconds = (this.obj.getTime() - (this.obj.getTimezoneOffset() * 60000)) % 86400000;
    const julianday = dateToJulianDay(this.obj);
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
}
qtype(Types.DATETIME)(QDateTime);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QMap extends QClass {
  /**
   * @function read
   * @memberof module:qtdatastream/types.QMap
   * @static
   * @param {Buffer} buffer
   * @returns {Object} Buffer coerced to an Object
   */
  static read(buffer) {
    const mapSize = QUInt.read(buffer);
    let map = {}, key, value;
    for (let i=0; i<mapSize; i++) {
      key = QString.read(buffer);
      value = QVariant.read(buffer);
      map[key] = value;
    }
    return map;
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QMap
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const bufs = [];
    // keys are all QString
    // values are all QVariant
    if (this.obj instanceof Map) {
      // Map number of elements
      bufs.push(QUInt.from(this.obj.size).toBuffer());
      for (let [ key, value ] of this.obj) {
        // write key
        bufs.push(QString.from(key).toBuffer());
        // write value
        bufs.push(QVariant.from(value).toBuffer());
      }
    } else {
      const keys = Object.keys(this.obj);
      // Map number of elements
      bufs.push(QUInt.from(keys.length).toBuffer());
      for (let key of keys) {
        // write key
        bufs.push(QString.from(key).toBuffer());
        // write value
        bufs.push(QVariant.from(this.obj[key]).toBuffer());
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
}
qtype(Types.MAP)(QMap);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QUserType extends QClass {
  constructor(name, obj) {
    super(obj);
    this.name = name;
  }

  static from(subject) {
    if (subject instanceof QUserType) {
      return subject;
    }
    return new this(subject);
  }

  /**
   * @function createComplexUserType
   * @memberof module:qtdatastream/types.QUserType
   * @static
   * @protected
   * @param {String} name
   * @param {*} value
   * @returns {QUserType} a new class that extends QUserType
   */
  static createComplexUserType(name, value) {
    const compiled = [];
    let key, keys, type;
    for (type of value) {
      [ key ] = Object.keys(type);
      keys = { key };
      if (typeof type[key] === 'string') {
        // It's a QUserType
        keys.quserclassname = type[key];
        keys.quserclass = QUserType.usertypes.get(type[key]);
      } else {
        keys.quserclass = QClass.types.get(type[key]);
      }
      if (!keys.quserclass) {
        throw new Error(`Type ${type[key]} does not exists`);
      }
      compiled.push(keys);
    }

    return class extends QUserType {
      constructor(obj) {
        super(name, obj);
      }

      static read(buffer) {
        const obj = {};
        for (let elt of compiled) {
          Object.defineProperty(obj, elt.key, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: elt.quserclass.read(buffer, keys.quserclassname)
          });
        }
        return obj;
      }

      toBuffer(skipname = false) {
        const bufs = [ this._getNameBuffer(skipname) ];
        for (let elt of compiled) {
          bufs.push(elt.quserclass.from(this.obj[elt.key]).toBuffer(true));
        }
        return Buffer.concat(bufs);
      }
    };
  }

  /**
   * @function createUserType
   * @memberof module:qtdatastream/types.QUserType
   * @static
   * @protected
   * @param {String} name
   * @param {*} value
   * @returns {QUserType} a new class that extends QUserType
   */
  static createUserType(name, value) {
    if (Array.isArray(value)) {
      return QUserType.createComplexUserType(name, value);
    }
    const qclass = QClass.types.get(value);

    return class extends QUserType {
      constructor(obj) {
        super(name, obj);
      }

      static read(buffer) {
        return qclass.read(buffer);
      }

      toBuffer(skipname = false) {
        const bufs = [ this._getNameBuffer(skipname), qclass.from(this.obj).toBuffer(true) ];
        return Buffer.concat(bufs);
      }
    };
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
  static register(name, value) {
    if (!QUserType.usertypes) {
      QUserType.usertypes = new Map;
    }
    QUserType.usertypes.set(name, QUserType.createUserType(name, value));
  }

  /**
   * Get a previously registered usertype
   * @function get
   * @memberof module:qtdatastream/types.QUserType
   * @static
   * @param {string} name
   */
  static get(name) {
    return QUserType.usertypes.get(name);
  }

  /**
   * @function read
   * @memberof module:qtdatastream/types.QUserType
   * @static
   * @param {Buffer} buffer
   * @param {string} name name with which the usertype has been registered
   * @returns {*} Buffer coerced to whatever have been registered
   */
  static read(buffer, name) {
    if (!name) {
      const bname = QByteArray.read(buffer);
      name = bstr(bname);
    }
    const usertype = QUserType.usertypes.get(name);
    if (!usertype) {
      throw new Error(`Unregistered usertype ${name}`);
    }
    return usertype.read(buffer);
  }

  _getNameBuffer(skipname) {
    if (!this.name) {
      throw new Error('Abstract QUserType cannot be converted to a buffer');
    }
    if (!skipname) {
      return QByteArray.from(this.name).toBuffer();
    }
    return Buffer.alloc(0);
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QUserType
   * @inner
   * @returns {Buffer}
   */
  toBuffer(skipname = false) {
    const bufs = [ this._getNameBuffer(skipname), QUserType.usertypes.get(this.name).from(this.obj).toBuffer(true) ];
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
}
qtype(Types.USERTYPE)(QUserType);

/**
 * @extends module:qtdatastream/types.QClass
 * @static
 * @param {*} obj
 */
class QVariant extends QClass {
  /**
   * By default, numbers are coerced to QUInt (unsigned 32bit ints).
   * This method allows to change this default behavior to coerce numbers
   * to any other QClass by default
   * @function coerceNumbersTo
   * @memberof module:qtdatastream/types.QVariant
   * @static
   * @param {Types} type
   * @example
   * const { QVariant, Types } = require('qtdatastream').types;
   * QVariant.coerceNumbersTo(Types.DOUBLE);
   */
  static coerceNumbersTo(type) {
    const qclass = QClass.types.get(type);
    if (qclass === undefined) {
      throw new Error(`undefined type ${type}`);
    }
    QVariant.coerceNumbersClass = qclass;
  }

  /**
   * @function read
   * @memberof module:qtdatastream/types.QVariant
   * @static
   * @param {Buffer} buffer
   * @returns {*} Buffer coerced to underlying QVariant type
   */
  static read(buffer){
    const type = QUInt.read(buffer);
    const _isNull = QBool.read(buffer);
    return QClass.types.get(type).read(buffer);
  }

  /**
   * @function toBuffer
   * @memberof module:qtdatastream/types.QVariant
   * @inner
   * @returns {Buffer}
   */
  toBuffer() {
    const isNull = (this.obj === undefined || this.obj === null);
    const typeofobj = typeof this.obj;
    let qclass;
    if (this.obj === undefined) {
      qclass = QInvalid;
    } else if (this.obj instanceof QUserType) {
      qclass = QUserType;
    } else if (this.obj instanceof QVariant) {
      throw new Error(`Can't nest QVariant`);
    } else if (this.obj instanceof QClass) {
      qclass = this.obj.constructor;
    } else if (typeofobj === 'string') {
      qclass = QString;
    } else if (typeofobj === 'number') {
      qclass = QVariant.coerceNumbersClass;
    } else if (typeofobj === 'boolean') {
      qclass = QBool;
    } else if (this.obj instanceof Date) {
      qclass = QDateTime;
    } else if (this.obj instanceof Array) {
      qclass = QList;
    } else {
      qclass = QMap;
    }
    if (!qclass) {
      throw new Error(`Undefined class ${qclass} from QVariant`);
    }
    const bufqvarianttype = QUInt.from(qclass.qtype).toBuffer();
    const bufqvariantisnull = QBool.from(isNull).toBuffer();
    const bufs = [ bufqvarianttype, bufqvariantisnull ];
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
}
QVariant.coerceNumbersClass = QUInt;

module.exports = {
  qtype,
  Types,
  QClass,
  QInvalid,
  QBool,
  QShort,
  QInt,
  QUInt,
  QInt64,
  QUInt64,
  QDouble,
  QChar,
  QTime,
  QByteArray,
  QString,
  QList,
  QStringList,
  QDateTime,
  QMap,
  QUserType,
  QVariant,
  Exportable,
  exportas,
  usertype
};
