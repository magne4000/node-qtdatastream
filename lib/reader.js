/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2014 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/reader */

var qtdatastream = require('./qtdatastream'),
    util = require('./util'),
    T = qtdatastream.Types,
    logger = require('debug')('qtdatastream:reader'),
    Int64 = require('int64-buffer').Int64BE,
    UInt64 = require('int64-buffer').Uint64BE,
    debug = qtdatastream.debug,
    Iterator = require('./iterator');

/**
 * @class
 * @classdesc Class to read and parse a given Qt buffer
 * @param {Buffer} b Qt formatted buffer
 * @example
 * var r = new Reader(buffer);
 * var parsed = r.parse();
 * 
 * // parsed = {
 * //   "AString": "BString",
 * //   "CString": ["DString", 1, 4, true],
 * //   "EString": ""
 * // };
 */
var Reader = function (b) {
    this.buffer = b.slice(0, 4);
    this.pos = 0;
    this.parsed = null;
    try {
        this.size = this.getUInt();
    } catch (e) {
        logger("Error while fetching buffer size", e.message);
        this.size = 0;
    }
    if (debug) {
        logger("buffer size : " + this.size);
    }
    this.buffer = b.slice(0, this.size+4);
    if (debug) {
        logger("buffer length : " + this.buffer.length);
    }
    this.remaining = b.slice(this.size+4);
    if (debug) {
        logger("remaining length : " + this.remaining.length);
    }
};

Reader.prototype.getUserTypeIterator = function(key) {
    return new Iterator(qtdatastream.getUserType(key), this.getQVariantByType, this);
};

/**
 * Converts an UTF-16 buffer to an UTF-8 buffer
 * @param {Buffer} msg An UTF-16 Buffer
 * @returns {Buffer} An UTF-8 Buffer
 */
Reader.conv = function(msg) {
    return qtdatastream.toggleEndianness(msg).toString("ucs2");
};

/**
 * Parse buffer
 * @returns {Object} buffer converted to a Javascript object
 */
Reader.prototype.parse = function(){
    this.parsed = this.getQVariant();
    return this.parsed;
};

/**
 * @param {Number} type A QVariant Type as defined in {@link module:qtdatastream.Types}
 * @param {string} [userType] Can specify userType in case of encapsulated userTypes
 * @returns {*} Corresponding QVariant result corresponding to the given type
 */
Reader.prototype.getQVariantByType = function(type, userType){
    switch(type) {
        case T.INVALID:
            return undefined;
        case T.BOOL:
            return this.getBool();
        case T.SHORT:
            return this.getShort();
        case T.INT:
            return this.getInt();
        case T.UINT:
            return this.getUInt();
        case T.INT64:
            return this.getInt64();
        case T.UINT64:
            return this.getUInt64();
        case T.DOUBLE:
            return this.getDouble();
        case T.MAP:
            return this.getMap();
        case T.LIST:
            return this.getList();
        case T.STRING:
            return this.getString();
        case T.CHAR:
            return this.getChar();
        case T.STRINGLIST:
            return this.getStringList();
        case T.BYTEARRAY:
            return this.getByteArray();
        case T.TIME:
            return this.getTime();
        case T.DATETIME:
            return this.getDateTime();
        case T.USERTYPE:
            var userTypeName = "";
            if (userType) {
                userTypeName = userType;
            } else {
                var t = this.getByteArray();
                userTypeName = util.str(t);
            }
            if (qtdatastream.isUserTypeComplex(userTypeName)) {
                var iter = this.getUserTypeIterator(userTypeName), ret = {};
                while(iter.hasNext()){
                    var item = iter.next();
                    ret[item.key] = item.value;
                }
                return ret;
            }
            var qvtype = qtdatastream.getUserType(userTypeName);
            if (qvtype) {
                return this.getQVariantByType(qvtype);
            } else {
                throw "Unhandled userType " + userTypeName;
            }
        default:
            throw "Unhandled type " + type;
    }
};

/**
 * @returns {number} Current QTime (milliseconds since midnight)
 */
Reader.prototype.getTime = function(){
    return this.getUInt();
};

/**
 * @returns {Date} Current QDateTime as string
 */
Reader.prototype.getDateTime = function(){
    var julianDay = this.getUInt();
    var msecondsSinceMidnight = this.getUInt();
    var isUTC = this.getBool();
    var ret = new Date(((Number(julianDay) - 2440588) * 86400000) + msecondsSinceMidnight);
    // TODO handle timezone
    return ret;
};

/**
 * @returns {*} Corresponding QVariant result corresponding current QVariant type
 */
Reader.prototype.getQVariant = function(){
    var type = this.getQVariantType(),
        isNull = this.getBool();
    try {
        return this.getQVariantByType(type);
    } catch (e) {
        logger(e);
        return null;
    }
};

/**
 * @returns {Number} Current QVariant type as defined in {@link module:qtdatastream.Types}
 */
Reader.prototype.getQVariantType = function(){
    return this.getUInt();
};

/**
 * @returns {string} Current string
 */
Reader.prototype.getString = function(){
    var stringSize = this.getUInt();
    if (stringSize === 0 || stringSize === 0xffffffff) return "";
    
    var stringBuffer = this.buffer.slice(this.pos, this.pos+stringSize);
    var resultingString = Reader.conv(stringBuffer).toString();
    this.pos += stringSize;
    return resultingString;
};

/**
 * @returns {string} Current char
 */
Reader.prototype.getChar = function(){
    var charBuffer = this.buffer.slice(this.pos, this.pos+2);
    var resultingChar = Reader.conv(charBuffer).toString();
    this.pos += 2;
    return resultingChar;
};

/**
 * @returns {Buffer} Current ByteArray
 */
Reader.prototype.getByteArray = function(){
    var arraySize = this.getUInt();
    if (arraySize === 0 || arraySize === 0xffffffff) return null;
    var buffer = this.buffer.slice(this.pos, this.pos+arraySize);
    this.pos += arraySize;
    return buffer;
};

/**
 * @returns {Array} Current list
 */
Reader.prototype.getList = function(){
    var listSize = this.getUInt(), i, list = [], val;
    for (i=0; i<listSize; i++) {
        // get value
        val = this.getQVariant();
        list.push(val);
    }
    return list;
};

/**
 * @returns {Array<string>} Current list of string
 */
Reader.prototype.getStringList = function(){
    var listSize = this.getUInt(), i, list = [], val;
    for (i=0; i<listSize; i++) {
        // get value
        val = this.getString();
        list.push(val);
    }
    return list;
};

/**
 * @returns {Object} Current map
 */
Reader.prototype.getMap = function(){
    var mapSize = this.getUInt(), i, map = {}, key, val;
    for (i=0; i<mapSize; i++) {
        // get key
        key = this.getString();
        // get value
        val = this.getQVariant();
        map[key] = val;
    }
    return map;
};

/**
 * @returns {Number} Current short
 */
Reader.prototype.getShort = function(){
    var i = this.buffer.readInt16BE(this.pos);
    this.pos += 2;
    return i;
};

/**
 * @returns {Number} Current int
 */
Reader.prototype.getInt = function(){
    var i = this.buffer.readInt32BE(this.pos);
    this.pos += 4;
    return i;
};

/**
 * @returns {Number} Current uint
 */
Reader.prototype.getUInt = function(){
    var i = this.buffer.readUInt32BE(this.pos);
    this.pos += 4;
    return i;
};

/**
 * @returns {Number} Current int64
 */
Reader.prototype.getInt64 = function(){
    var i = Int64(this.buffer.slice(this.pos, this.pos+8)).toNumber();
    this.pos += 8;
    return i;
};

/**
 * @returns {Number} Current uint64
 */
Reader.prototype.getUInt64 = function(){
    var i = UInt64(this.buffer.slice(this.pos, this.pos+8)).toNumber();
    this.pos += 8;
    return i;
};

/**
 * @returns {Number} Current double
 */
Reader.prototype.getDouble = function(){
    var i = this.buffer.readDoubleBE(this.pos);
    this.pos += 8;
    return i;
};

/**
 * @returns {Number} Current boolean
 */
Reader.prototype.getBool = function(){
    var i = this.buffer.readInt8(this.pos);
    this.pos += 1;
    return i;
};

module.exports = Reader;
