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
Reader.userTypes = {};
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
 * Register a new UserType.
 * When key is found on a QMap, the value will be
 * handled as defined by type
 * @param {string} key
 * @param {number} type
 */
Reader.registerUserType = function(key, type) {
    Reader.userTypes[key] = type;
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
        case T.USERTYPE:
            var a = this.getByteArray();
            var s = a.toString();
            if (!(s in Reader.userTypes)){
                throw "UserType not defined for '"+s+"'. Register it with Reader.registerUserType";
            }
            if (Object.prototype.toString.call(Reader.userTypes[s]) === '[object Array]') {
                var len = Reader.userTypes[s].length, i, ret = {};
                for (i=0; i<len; i++) {
                    var key = Object.keys(Reader.userTypes[s][i])[0];
                    var valType = Reader.userTypes[s][i][key];
                    var val = this.getQVariantByType(valType);
                    ret[key] = val;
                }
                return ret;
            }
            return this.getQVariantByType(Reader.userTypes[s]);
        default:
            throw "Unhandled type " + type;
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
 * @returns {Buffer} Current ByteArray
 */
Reader.prototype.getByteArray = function(){
    var arraySize = this.getUInt();
    if (arraySize === 0 || arraySize === 0xffffffff) return null;
    var buffer = this.buffer.slice(this.pos, this.pos+arraySize-1);
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
