/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2014 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/reader */

var Iconv = require('iconv').Iconv,
    T = require('./qtdatastream').Types;

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
        case T.INT:
            // TODO
            break;
        case T.UINT:
            return this.getUInt();
        case T.MAP:
            return this.getMap();
        case T.LIST:
            return this.getList();
        case T.STRING:
            return this.getString();
        case T.STRINGLIST:
            // TODO
            break;
        case T.BYTEARRAY:
            // TODO
            break;
        default:
            return null;
    }
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
