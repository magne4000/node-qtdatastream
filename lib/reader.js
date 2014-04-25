/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2014 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/reader */

var Iconv = require('iconv').Iconv,
    qtdatastream = require('./qtdatastream'),
    T = qtdatastream.Types,
    Iterator = require('./iterator');

//Fix for Buffer.toString function
Buffer.prototype.str = function() {
    if (this[this.length-1] === 0x00) { // \0 char must be deleted
        return this.slice(0, this.length-1).toString();
    }
    this.toString();
};

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
    this.buffer = b;
    this.pos = 0;
    this.parsed = null;
    this.size = this.getUInt();
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
    var ic = new Iconv("UTF-16BE//TRANSLIT", "UTF-8");
    return ic.convert(msg);
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
 * @param {Number} A QVariant Type as defined in {@link module:qtdatastream.Types}
 * @returns {*} Corresponding QVariant result corresponding to the given type
 */
Reader.prototype.getQVariantByType = function(type){
    switch(type) {
        case T.BOOL:
            return this.getBool();
        case T.SHORT:
            return this.getShort();
        case T.INT:
            return this.getInt();
        case T.UINT:
            return this.getUInt();
        case T.MAP:
            return this.getMap();
        case T.LIST:
            return this.getList();
        case T.STRING:
            return this.getString();
        case T.STRINGLIST:
            return this.getStringList();
        case T.BYTEARRAY:
            return this.getByteArray();
        case T.DATETIME:
            return this.getDateTime();
        case T.USERTYPE:
            var userTypeName = this.getByteArray().str();
            if (qtdatastream.isUserTypeComplex(userTypeName)) {
                var iter = this.getUserTypeIterator(userTypeName), ret = {};
                for (var item = iter.first(); iter.hasNext(); item = iter.next()) {
                    ret[item.key] = item.value;
                }
                return ret;
            }
            return this.getQVariantByType(qtdatastream.getUserType(userTypeName));
        default:
            throw "Unhandled type " + type;
    }
};

/**
 * @returns {Date} Current QDateTime as string
 */
Reader.prototype.getDateTime = function(){
    var julianDay = this.getUInt();
    var secondsSinceMidnight = this.getUInt() / 1000;
    var isUTC = this.getBool();
    var ret = new Date(((Number(julianDay) - 2440587.5) * 86400000) + secondsSinceMidnight);
    // TODO handle timezone
    return ret;
};

/**
 * @returns {*} Corresponding QVariant result corresponding current QVariant type
 */
Reader.prototype.getQVariant = function(){
    var type = this.getQVariantType(),
        isNull = this.getBool();
    if (!isNull){
        return this.getQVariantByType(type);
    }
    return null;
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
 * @returns {Number} Current uint
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
 * @returns {boolean} Current boolean
 */
Reader.prototype.getBool = function(){
    var i = this.buffer.readInt8(this.pos);
    this.pos += 1;
    return i===0?false:true;
};

module.exports = Reader;
