/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2014 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/writer */

var Iconv = require('iconv').Iconv,
    qtdatastream = require('./qtdatastream'),
    T = qtdatastream.Types,
    QVariant = qtdatastream.QVariant,
    QString = qtdatastream.QString,
    QMap = qtdatastream.QMap,
    QList = qtdatastream.QList,
    QUInt = qtdatastream.QUInt,
    QBool = qtdatastream.QBool;

/**
 * @class
 * @classdesc Class to generate a buffer from a Javascript object
 * @param {Object} obj Javascript object
 * @example
 * var w = new Writer(obj);
 * var buffer = w.getBuffer(); //Buffer ready to be sent to a socket !
 */
var Writer = function(obj) {
    this.bufs = [];
    this.size = 0;
    this.type = null;
    this.parse(obj);
};

/**
 * Converts an UTF-8 string to an UTF-16 buffer
 * @param {Buffer} msg An UTF-8 string
 * @returns {Buffer} An UTF-16 Buffer
 */
Writer.conv = function(msg) {
    var ic = new Iconv("UTF-8", "UTF-16BE//TRANSLIT");
    return ic.convert(msg);
};

/**
 * Get the buffer without prefixing it by its size.
 * @returns {Buffer}
 */
Writer.prototype.getRawBuffer = function() {
    return Buffer.concat(this.bufs);
};

/**
 * Get the buffer representation of the object.
 * It is prefixed by the packet size as defined in Qt framework.
 * @returns {Buffer} A Qt styled buffer ready to be sent through a socket
 */
Writer.prototype.getBuffer = function(){
    var tempBuf = Buffer.concat(this.bufs);
    this.size = this.size+5; // because we add a QVariant in the end
    
    // The first block is the size of the data sent
    var bsize = new Buffer(4);
    bsize.writeUInt32BE(this.size, 0); 
    // Write QVariant type
    var bqvariant = new Buffer(4);
    var bqvariantisnull = new Buffer(1);
    bqvariant.writeUInt32BE(this.type, 0, true);
    if (this.bufs.length > 0) {
        bqvariantisnull.writeInt8(0, 0);
    } else {
        bqvariantisnull.writeInt8(1, 0);
    }
    
    // generate final Buffer
    var buf = Buffer.concat([bsize, bqvariant, bqvariantisnull, tempBuf]);
    
    return buf;
};

/**
 * Should not be called directly, it is better to call new Writer(...)
 * with the object as parameter
 * @param {*} obj
 */
Writer.prototype.parse = function(obj){
    this.type = this._parse(obj);
};

/**
 * Parses next element of the buffer
 * @protected
 * @param {*} obj
 * @returns {Number} Type as defined in {@link module:qtdatastream.Types}
 */
Writer.prototype._parse = function(obj){
    if (typeof obj === 'undefined') return;
    if (typeof obj === 'object') {
        var type = Object.prototype.toString.call(obj);
        if (obj instanceof QVariant) {
            this._parse_qvariant(obj);
            return obj.type;
        } else if (obj instanceof QString) {
            this._parse_qstring(obj);
            return T.STRING;
        } else if (obj instanceof QMap) {
            this._parse_qmap(obj);
            return T.MAP;
        } else if (obj instanceof QList) {
            this._parse_qlist(obj);
            return T.LIST;
        } else if (type === '[object Array]') {
            this._parse_qlist(new QList(obj));
            return T.LIST;
        } else if (obj instanceof QUInt) {
            this._parse_quint(obj);
            return T.UINT;
        } else if (obj instanceof QBool) {
            this._parse_bool(obj);
            return T.BOOL;
        }
        this._parse_qmap(new QMap(obj));
        return T.MAP;
    } else if (typeof obj === 'string') {
        this._parse_qstring(new QString(obj));
        return T.STRING;
    } else if (typeof obj === 'number') {
        this._parse_quint(new QUInt(obj));
        return T.UINT;
    } else if (typeof obj === 'boolean') {
        this._parse_bool(new QBool(obj));
        return T.BOOL;
    }
};

/**
 * @param {QUInt} obj
 * @protected
 */
Writer.prototype._parse_quint = function(obj){
    this.writeUInt(obj.obj);
    return;
};

/**
 * @param {QBool} obj
 * @protected
 */
Writer.prototype._parse_bool = function(obj){
    this.writeBool(obj.obj);
    return;
};

/**
 * @param {QString} obj
 * @protected
 */
Writer.prototype._parse_qstring = function(obj){
    this.writeString(obj.obj);
    return;
};

/**
 * @param {QList} obj
 * @protected
 */
Writer.prototype._parse_qlist = function(obj){
    var size = 0, key;
    for (key in obj.obj) {
        if (obj.obj.hasOwnProperty(key)) size++;
    }
    this.writeUInt(size); // nb of elements in the map
    for (key in obj.obj) {
        if (obj.obj.hasOwnProperty(key)) {
            // Value
            if (obj.obj[key] instanceof QVariant) {
                this._parse(obj.obj[key]);
            } else {
                this._parse(new QVariant(obj.obj[key]));
            }
        }
    }
    return;
};

/**
 * @param {QMap} obj
 * @protected
 */
Writer.prototype._parse_qmap = function(obj){
    var size = 0, key;
    for (key in obj.obj) {
        if (obj.obj.hasOwnProperty(key)) size++;
    }
    this.writeUInt(size); // nb of elements in the map
    for (key in obj.obj) {
        if (obj.obj.hasOwnProperty(key)) {
            // Key
            this._parse(key);
            // Value
            if (obj.obj[key] instanceof QVariant) {
                this._parse(obj.obj[key]);
            } else {
                this._parse(new QVariant(obj.obj[key]));
            }
        }
    }
    return;
};

/**
 * @param {QVariant} obj
 * @protected
 */
Writer.prototype._parse_qvariant = function(obj){
    var isNull = 0;
    if (typeof obj.obj === 'undefined' || typeof obj.obj === 'null'){
        isNull = 1;
    }
    this.writeQVariant(obj.type, isNull);
    return this._parse(obj.obj);
};

/**
 * Add specified buffer to the internal buffer list, with its size
 * @param {Buffer} b
 * @param {Number} size
 * @returns {Writer}
 */
Writer.prototype.write = function(b, size){
    this.bufs.push(b);
    this.size += size;
    return this;
};

/**
 * Add a boolean buffer to the internal buffer list
 * @param {(Number|boolean)} bool
 * @returns {Writer}
 */
Writer.prototype.writeBool = function(bool){
    var b = new Buffer(1);
    b.writeInt8(bool, 0);
    this.write(b, 1);
    return this;
};

/**
 * Add a string buffer to the internal buffer list
 * @param {string} str
 * @returns {Writer}
 */
Writer.prototype.writeString = function(str) {
    if (str === null){
        // Special case for NULL QString
        this.writeUInt(0xffffffff);
    } else {
        var b = Writer.conv(str);
        this.writeUInt(b.length);
        this.write(b, b.length);
    }
    return this;
};

/**
 * Add a byteArray buffer to the internal buffer list
 * @param {Array} arr
 * @returns {Writer}
 */
Writer.prototype.writeByteArray = function(arr) {
    this.writeUInt(arr.length);
    var b = new Buffer(arr);
    this.size += arr.length;
    this.bufs.push(b);
};

/**
 * Add a uint32 buffer to the internal buffer list
 * @param {Number} i
 * @returns {Writer}
 */
Writer.prototype.writeUInt = function(i){
    var b = new Buffer(4);
    b.writeUInt32BE(i, 0, true);
    this.write(b, 4);
    return this;
};

/**
 * Add a uint16 buffer to the internal buffer list
 * @param {Number} i
 * @returns {Writer}
 */
Writer.prototype.writeShort = function(i){
    var b = new Buffer(2);
    b.writeUInt16BE(i, 0, true);
    this.write(b, 2);
    return this;
};

/**
 * Add a qvariant buffer to the internal buffer list
 * @param {Number} type Type as defined in {@link module:qtdatastream.Types}
 * @param {(Number|boolean)} nullFlag must be true or 1 if the following QVariant is null
 * @returns {Writer}
 */
Writer.prototype.writeQVariant = function(type, nullFlag) {
    this.writeUInt(type);
    this.writeBool(nullFlag);
    return this;
};

module.exports = Writer;
