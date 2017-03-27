/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/serialization */

const { QUserType, QMap } = require('./types');

/**
 * A class using this decorator is serializable.
 * If usertype is not specified, objects from this class will be exported as QMap.
 * @static
 * @param {?string} usertype
 * @example
 * \@Serializable('Network::Server')
 * export class Server {
 *     \@serialize(QString, {in: 'HostIn', out: 'HostOut'))
 *     host;
 *
 *     \@serialize(QUInt, 'Port')
 *     port = 6667;
 *
 *     \@serialize(QUInt)
 *     sslVersion = 0;
 *
 *     constructor(args) {
 *         this.blob = true; // will not be serialized at export
 *         Object.assign(this, args);
 *     }
 * }
 *
 * @example
 * \@Serializable()
 * export class Server {
 *   x = 12;
 *
 *   _export() {
 *     return {
 *       'a': this.x
 *     };
 *   }
 * }
 */
function Serializable(usertype) {
  return function(aclass) {
    if (usertype) {
      Object.defineProperty(aclass, '__usertype', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: usertype
      });
    }

    aclass.prototype.export = function() {
      const self = typeof this._export === 'function' ? this._export : () => this;
      let subject = this.__serialize ? this._mapping_out() : self();
      subject = deepMap(subject, prepare);
      return (this.constructor.__usertype ? QUserType.get(this.constructor.__usertype) : QMap).from(subject);
    };

    aclass.prototype._mapping_out = function() {
      const ret = {};
      const keys = Object.keys(this.__serialize);
      for (let key of keys) {
        Object.defineProperty(ret, key, {
          enumerable: true,
          configurable: true,
          writable: false,
          value: this.__serialize[key](this)
        });
      }
      return ret;
    };

    aclass.from = function(obj) {
      return new this(obj);
    };
  };
}

/**
 * A class attribute using this decorator is serializable
 * @static
 * @param {QClass} qclass
 * @param {(?string|{in: string, out: string})} serializekey
 * @example
 * \@Serializable()
 * export class Server {
 *     \@serialize(QString, {in: 'HostIn', out: 'HostOut'))
 *     host;
 *
 *     \@serialize(QUInt, 'Port')
 *     port = 6667;
 *
 *     \@serialize(QUInt)
 *     sslVersion = 0;
 *
 *     constructor(args) {
 *         Object.assign(this, args);
 *     }
 * }
 */
function serialize(qclass, serializekey = {}) {
  if (typeof serializekey === 'string') {
    serializekey = {
      in: serializekey,
      out: serializekey
    };
  }

  return function(aclass, key, descriptor) {
    if (!('set' in descriptor)) {
      descriptor.writable = true;
    }
    if (!aclass.hasOwnProperty('__serialize')) {
      Object.defineProperty(aclass, '__serialize', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: {}
      });
    }
    // How to export
    Object.defineProperty(aclass.__serialize, serializekey.out || key, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: context => qclass.from(context[key])
    });
    // How to import
    if (serializekey.in !== undefined && serializekey.in !== key) {
      Object.defineProperty(aclass, serializekey.in, {
        enumerable: false,
        set: function(value) {
          this[key] = value;
        },
        get: function() {
          return this[key];
        }
      });
    }
    return descriptor;
  };
}

function prepare(obj) {
  return (obj !== undefined && obj !== null && typeof obj.export === 'function') ? obj.export() : obj;
}

function mapObject(obj, fn) {
  const keys = Object.keys(obj);
  for (let key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    Object.assign(descriptor, {
      value: fn(obj[key])
    });
    Object.defineProperty(obj, key, descriptor);
  }
  return obj;
}

function deepMap(obj, fn) {
  const deepMapper = val => (val !== null && typeof val === 'object') ? deepMap(val, fn) : fn(val);
  if (Array.isArray(obj)) {
    return obj.map(deepMapper);
  }
  if (obj !== null && typeof obj === 'object') {
    return mapObject(obj, deepMapper);
  }
  return obj;
}

module.exports = {
  Serializable,
  serialize
};