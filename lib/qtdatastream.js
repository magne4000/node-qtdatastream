/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2016 Joël Charles
 * Licensed under the MIT license.
 */

var EventEmitter = require('events').EventEmitter,
    NetSocket = require('net').Socket,
    debuglib = require('debug'),
    logger = debuglib('qtdatastream:main'),
    loggerw = debuglib('qtdatastream:main-write'),
    util = require('util'),
    debug = !!process.env.QTDSDEBUG || debuglib.enabled("qtdatastream:*");
    
/** @module qtdatastream */

/**
 * Qt types list
 * @readonly
 * @enum {number}
 */
exports.Types = {
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

if (debug && !debuglib.enabled("qtdatastream:*")) {
    debuglib.enable("qtdatastream:*");
}

exports.QTDATASTREAMCLASS = "__QTDATASTREAMCLASS__";

exports.userTypes = {};

exports.toggleEndianness = function(buffer) {
    buffer.swap16();
    return buffer;
};

/**
 * Qt compliant Socket overload.
 * 'data' event is triggered only when full buffer is received.
 * 'error', 'close' and 'end' event are not altered.
 * @class
 * @param {net.Socket} socket
 */
exports.Socket = function Socket(socket, readCallback, writeCallback) {
    if (!(socket instanceof NetSocket)) {
        throw "Socket must be an instance of net.Socket";
    }
    var self = this;
    self.socket = socket;
    self.data_state = null;
    self.readCallback = readCallback;
    self.writeCallback = writeCallback;
    
    self.updateSocket(socket, readCallback, writeCallback);
};
util.inherits(exports.Socket, EventEmitter);

/**
 * Write data to the socket
 * @param {*} data Data that will be written using Writer
 */
exports.Socket.prototype.write = function(data) {
    var Writer = require('./writer');
    var writer = new Writer(data);
    var buffer = writer.getBuffer();
    var self = this;
    if (typeof this.writeCallback === 'function') {
        this.writeCallback(buffer, function(err, buffer2) {
            if (!err) {
                if (debug) {
                    loggerw(buffer2);
                }
                self.socket.write(buffer2);
            } else {
                logger(err);
            }
        });
    } else {
        if (debug) {
            loggerw(buffer);
        }
        this.socket.write(buffer);
    }
};

/**
 * Update the socket (for example to promote it to SSL stream)
 * @param {Stream} socket object implementing Stream interface
 */
exports.Socket.prototype.updateSocket = function(socket) {
    var Reader = require('./reader');
    var self = this;

    this.socket.removeAllListeners();

    this.socket = socket;

    this.socket.on('data', function(data) {
        if (typeof self.readCallback === 'function') {
            self.readCallback(data, handleData);
        } else {
            handleData(null, data);
        }
    });

    function getsize(bufferlist) {
        // get 4 bytes
        var final_buffer;
        if (bufferlist[0] && bufferlist[0].length >= 4) {
            final_buffer = bufferlist[0];
        } else {
            var totallength = 0, i = 0;
            while(totallength < 4 && i < bufferlist.length) {
                totallength += bufferlist[i++].length;
            }
            if (totallength < 4) return Infinity;
            final_buffer = Buffer.concat(bufferlist.slice(0,i), totallength);
        }
        var reader = new Reader(final_buffer);
        return reader.size;
    }

    function handleData(err, data) {
        var reader;
        if (!err) {
            var stop = false;
            while (!stop) {
                if (!self.data_state) {
                    self.data_state = {size: Infinity, data: [], recvd: 0};
                }
                var ds = self.data_state;
                if (data !== null) {
                    ds.data.push(data);
                    ds.recvd += data.length;
                }
                if (ds.size == Infinity && ds.recvd >= 4) {
                    ds.size = getsize(ds.data);
                }
                self.emit('progress', ds.recvd, ds.size);
                if (ds.size > ds.recvd) {
                    if (debug) {
                        logger("(%d/%d) Waiting for end of buffer", ds.recvd, ds.size);
                    }
                    stop = true;
                } else {
                    reader = new Reader(Buffer.concat(ds.data, ds.recvd));
                    if (debug) {
                        logger("(%d/%d) Received full buffer", ds.recvd, ds.size);
                    }
                    reader.parse();
                    if (debug) {
                        logger('Received result');
                        logger(reader.parsed);
                    }
                    if (reader.remaining && reader.remaining.length > 0) {
                        self.data_state = {
                            data: [reader.remaining],
                            recvd: reader.remaining.length,
                            size: Infinity
                        };
                        stop = false;
                    } else {
                        self.data_state = null;
                        stop = true;
                    }
                    self.emit('data', reader.parsed);
                }
                if (!stop) {
                    data = null;
                }
            }
        } else {
            logger(err);
        }
    }
    
    this.socket.on('error', function(e) {
        if (debug) {
            logger('ERROR');
        }
        self.emit('error', e);
    });
    
    this.socket.on('close', function() {
        if (debug) {
            logger('Connection closed');
        }
        self.emit('close');
    });
    
    this.socket.on('end', function() {
        if (debug) {
            logger('END');
        }
        self.emit('end');
    });
};

/**
 * Register a new QUserType.
 * @param {string} key
 * @param {number} type
 */
exports.registerUserType = function(key, type) {
    exports.userTypes[key] = type;
};

/**
 * Get the QUserType definition
 * @param {string} key
 * @returns {*}
 */
exports.getUserType = function(key) {
    return exports.userTypes[key];
};

/**
 * Return true if the QUserType specified by key contains multiple fields
 * @param {string} key
 * @returns {*}
 */
exports.isUserTypeComplex = function(key) {
    return Object.prototype.toString.call(exports.getUserType(key)) === '[object Array]';
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QVariant for the Writer
 * @class
 * @name QVariant
 * @param {*} obj
 * @example
 * new Writer("a string"); // will be written as QString
 * new Writer(new QVariant("a string")); // will be written as QVariant<QString>
 */
exports.QVariant = function QVariant(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
    if (typeof obj === 'object') {
        var jstype = Object.prototype.toString.call(obj);
        if (obj instanceof exports.QString) {
            this.type = exports.Types.STRING;
        } else if (obj instanceof exports.QChar) {
            this.type = exports.Types.CHAR;
        } else if (obj instanceof exports.QMap) {
            this.type = exports.Types.MAP;
        } else if (obj instanceof exports.QList) {
            this.type = exports.Types.LIST;
        } else if (jstype === '[object Array]') {
            this.type = exports.Types.LIST;
        } else if (obj instanceof exports.QUInt) {
            this.type = exports.Types.UINT;
        } else if (obj instanceof exports.QBool) {
            this.type = exports.Types.BOOL;
        } else if (obj instanceof exports.QShort) {
            this.type = exports.Types.SHORT;
        } else if (obj instanceof exports.QInt) {
            this.type = exports.Types.INT;
        } else if (obj instanceof exports.QInt64) {
            this.type = exports.Types.INT64;
        } else if (obj instanceof exports.QUInt64) {
            this.type = exports.Types.UINT64;
        } else if (obj instanceof exports.QDouble) {
            this.type = exports.Types.DOUBLE;
        } else if (obj instanceof exports.QStringList) {
            this.type = exports.Types.STRINGLIST;
        } else if (obj instanceof exports.QTime) {
            this.type = exports.Types.TIME;
        } else if (obj instanceof exports.QDateTime) {
            this.type = exports.Types.DATETIME;
        } else if (jstype === '[object Date]') {
            this.type = exports.Types.DATETIME;
        } else if (obj instanceof exports.QUserType) {
            this.type = exports.Types.USERTYPE;
        } else if (obj instanceof exports.QByteArray) {
            this.type = exports.Types.BYTEARRAY;
        } else if (obj instanceof exports.QInvalid) {
            this.type = exports.Types.INVALID;
        } else {
            this.type = exports.Types.MAP;
        }
    } else if (typeof obj === 'string') {
        this.type = exports.Types.STRING;
    } else if (typeof obj === 'number') {
        this.type = exports.Types.UINT;
    } else if (typeof obj === 'boolean') {
        this.type = exports.Types.BOOL;
    }
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QTime for the Writer.
 * @class
 * @name QTime
 * @param {*} obj
 */
exports.QTime = function QTime(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QDateTime for the Writer.
 * @class
 * @name QDateTime
 * @param {*} obj
 */
exports.QDateTime = function QDateTime(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QString for the Writer.
 * Javascript string are converted to QString objects internally.
 * When parsed from reader, QString objects are converted back to Javascript string
 * @class
 * @name QString
 * @param {*} obj
 * @example
 * new Writer(new QString(null)); // will be written as a null QString
 */
exports.QString = function QString(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QChar for the Writer.
 * @class
 * @name QChar
 * @param {*} obj
 */
exports.QChar = function QChar(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QMap for the Writer.
 * @class
 * @name QMap
 * @param {*} obj
 */
exports.QMap = function QMap(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QList for the Writer.
 * Javascript Array are converted to QList objects internally.
 * When parsed from reader, QList objects are converted back to Javascript Array
 * @class
 * @name QList
 * @param {*} obj
 */
exports.QList = function QList(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QStringList for the Writer.
 * @class
 * @name QStringList
 * @param {*} obj
 */
exports.QStringList = function QStringList(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QUInt for the Writer.
 * Javascript number are converted to QUInt objects internally.
 * When parsed from reader, QUInt objects are converted back to Javascript number
 * @class
 * @name QUInt
 * @param {*} obj
 */
exports.QUInt = function QUInt(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QBool for the Writer.
 * Javascript boolean are converted to QBool objects internally.
 * When parsed from reader, QBool objects are converted to Javascript number
 * @class
 * @name QBool
 * @param {*} obj
 */
exports.QBool = function QBool(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QInt for the Writer.
 * @class
 * @name QInt
 * @param {*} obj
 */
exports.QInt = function QInt(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QInt64 for the Writer.
 * @class
 * @name QInt64
 * @param {*} obj
 */
exports.QInt64 = function QInt64(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QUInt64 for the Writer.
 * @class
 * @name QUInt64
 * @param {*} obj
 */
exports.QUInt64 = function QUInt64(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QShort for the Writer.
 * @class
 * @name QShort
 * @param {*} obj
 */
exports.QShort = function QShort(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QDouble for the Writer.
 * @class
 * @name QDouble
 * @param {*} obj
 */
exports.QDouble = function QDouble(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};


/**
 * This class allow users to force a specific object to be recognized as
 * a QByteArray for the Writer.
 * @class
 * @name QByteArray
 * @param {*} obj
 */
exports.QByteArray = function QByteArray(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QInvalid for the Writer.
 * @class
 * @name QInvalid
 * @param {*} obj
 */
exports.QInvalid = function QInvalid(){
    this.obj = undefined;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QUserType for the Writer.
 * @class
 * @name QUserType
 * @param {string} name
 * @param {*} obj
 */
exports.QUserType = function QUserType(name, obj){
    this.obj = obj;
    this._qusertype_name = name;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * Get user defined type name
 */
exports.QUserType.prototype.getName = function() {
    return this._qusertype_name;
};

exports.Writer = require('./writer');

exports.Reader = require('./reader');

exports.util = require('./util');

exports.Class = function(type, value) {
    switch(type) {
        case exports.Types.INVALID:
            return new exports.QInvalid(value);
        case exports.Types.BOOL:
            return new exports.QBool(value);
        case exports.Types.INT:
            return new exports.QInt(value);
        case exports.Types.UINT:
            return new exports.QUInt(value);
        case exports.Types.INT64:
            return new exports.QInt64(value);
        case exports.Types.UINT64:
            return new exports.QUInt64(value);
        case exports.Types.DOUBLE:
            return new exports.QDouble(value);
        case exports.Types.MAP:
            return new exports.QMap(value);
        case exports.Types.LIST:
            return new exports.QList(value);
        case exports.Types.STRING:
            return new exports.QString(value);
        case exports.Types.CHAR:
            return new exports.QChar(value);
        case exports.Types.STRINGLIST:
            return new exports.QStringList(value);
        case exports.Types.BYTEARRAY:
            return new exports.QByteArray(value);
        case exports.Types.TIME:
            return new exports.QTime(value);
        case exports.Types.DATETIME:
            return new exports.QDateTime(value);
        case exports.Types.USERTYPE:
            return new exports.QUserType(value);
        case exports.Types.SHORT:
            return new exports.QShort(value);
    }
};

