/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2014 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/writer */

var qtdatastream = require('./qtdatastream'),
    util = require('./util'),
    Iterator = require('./iterator'),
    Int64 = require('int64-buffer').Int64BE,
    UInt64 = require('int64-buffer').Uint64BE,
    T = qtdatastream.Types,
    QVariant = qtdatastream.QVariant,
    QString = qtdatastream.QString,
    QChar = qtdatastream.QChar,
    QMap = qtdatastream.QMap,
    QList = qtdatastream.QList,
    QUInt = qtdatastream.QUInt,
    QInt64 = qtdatastream.QInt64,
    QUInt64 = qtdatastream.QUInt64,
    QDouble = qtdatastream.QDouble,
    QBool = qtdatastream.QBool,
    QInt = qtdatastream.QInt,
    QShort = qtdatastream.QShort,
    QStringList = qtdatastream.QStringList,
    QUserType = qtdatastream.QUserType,
    QByteArray = qtdatastream.QByteArray,
    QTime = qtdatastream.QTime,
    QDateTime = qtdatastream.QDateTime,
    QInvalid = qtdatastream.QInvalid;

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
    this.type = null;
    this.parse(obj);
};

Writer.prototype.getUserTypeIterator = function(key) {
    return new Iterator(qtdatastream.getUserType(key));
};

/**
 * Converts an UTF-8 string to an UTF-16 buffer
 * @param {Buffer} msg An UTF-8 string
 * @returns {Buffer} An UTF-16 Buffer
 */
Writer.conv = function(msg) {
    return qtdatastream.toggleEndianness(new Buffer(msg, "ucs2"));
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
    // Create QVariant type
    var bqvariant = new Buffer(4);
    var bqvariantisnull = new Buffer(1);
    bqvariant.writeUInt32BE(this.type, 0, true);
    if (this.bufs.length > 0) {
        bqvariantisnull.writeInt8(0, 0);
    } else {
        bqvariantisnull.writeInt8(1, 0);
    }
    
    // Calculate size
    var bsize = new Buffer(4);
    bsize.writeUInt32BE(bqvariant.length + bqvariantisnull.length + tempBuf.length, 0);
    return Buffer.concat([bsize, bqvariant, bqvariantisnull, tempBuf]);
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
        } else if (obj instanceof QInvalid) {
            this._parse_qinvalid();
            return T.INVALID;
        } else if (obj instanceof QChar) {
            this._parse_qchar(obj);
            return T.CHAR;
        } else if (obj instanceof QMap) {
            this._parse_qmap(obj);
            return T.MAP;
        } else if (obj instanceof QList) {
            this._parse_qlist(obj);
            return T.LIST;
        } else if (obj instanceof QStringList) {
            this._parse_qstringlist(obj);
            return T.STRINGLIST;
        } else if (type === '[object Array]') {
            this._parse_qlist(new QList(obj));
            return T.LIST;
        } else if (obj instanceof QUInt) {
            this._parse_quint(obj);
            return T.UINT;
        } else if (obj instanceof QInt) {
            this._parse_qint(obj);
            return T.INT;
        } else if (obj instanceof QInt64) {
            this._parse_qint64(obj);
            return T.INT;
        } else if (obj instanceof QUInt64) {
            this._parse_quint64(obj);
            return T.INT;
        } else if (obj instanceof QDouble) {
            this._parse_qdouble(obj);
            return T.INT;
        } else if (obj instanceof QBool) {
            this._parse_bool(obj);
            return T.BOOL;
        } else if (obj instanceof QShort) {
            this._parse_qshort(obj);
            return T.SHORT;
        } else if (obj instanceof QByteArray) {
            this._parse_qbytearray(obj);
            return T.BYTEARRAY;
        } else if (obj instanceof QTime) {
            this._parse_quint(obj);
            return T.TIME;
        } else if (obj instanceof QDateTime) {
            this._parse_qdatetime(obj);
            return T.DATETIME;
        } else if (type === '[object Date]') {
            this._parse_qdatetime(new QDateTime(obj));
            return T.DATETIME;
        } else if (obj instanceof QUserType) {
            this._parse_qusertype(obj);
            return T.USERTYPE;
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
 * @protected
 */
Writer.prototype._parse_qinvalid = function(){
    // Actually do nothing
    return;
};

/**
 * @param {QDateTime} obj
 * @protected
 */
Writer.prototype._parse_qdatetime = function(obj){
    this.writeDateTime(obj.obj);
    return;
};

/**
 * @param {QShort} obj
 * @protected
 */
Writer.prototype._parse_qshort = function(obj){
    this.writeShort(obj.obj);
    return;
};

/**
 * @param {QInt} obj
 * @protected
 */
Writer.prototype._parse_qint = function(obj){
    this.writeInt(obj.obj);
    return;
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
 * @param {QInt64} obj
 * @protected
 */
Writer.prototype._parse_qint64 = function(obj){
    this.writeInt64(obj.obj);
    return;
};

/**
 * @param {QUInt64} obj
 * @protected
 */
Writer.prototype._parse_quint64 = function(obj){
    this.writeUInt64(obj.obj);
    return;
};

/**
 * @param {QDouble} obj
 * @protected
 */
Writer.prototype._parse_qdouble = function(obj){
    this.writeDouble(obj.obj);
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
 * @param {QChar} obj
 * @protected
 */
Writer.prototype._parse_qchar = function(obj){
    this.writeChar(obj.obj);
    return;
};

/**
 * @param {QByteArray} obj
 * @protected
 */
Writer.prototype._parse_qbytearray = function(obj){
    this.writeByteArray(obj.obj);
    return;
};

/**
 * @param {QUserType} obj
 * @protected
 */
Writer.prototype._parse_qusertype = function(obj){
    if (qtdatastream.isUserTypeComplex(obj.getName())) {
        var iter = this.getUserTypeIterator(obj.getName());
        while (iter.hasNext()) {
            var item = iter.next();
            if (item.value.length > 1) { //QUserType
                if (obj.obj[item.key] instanceof QUserType) {
                    this._parse(obj.obj[item.key]);
                } else {
                    this._parse(new QUserType(item.value[1], obj.obj[item.key]));
                }
            } else {
                this._parse(new qtdatastream.Class(item.value[0], obj.obj[item.key]));
            }
        }
    } else {
        var type = qtdatastream.getUserType(obj.getName());
        this._parse(new qtdatastream.Class(type, obj.obj));
    }
};

/**
 * If obj[key] is not of class newclass, instanciate it.
 * Then call _parse().
 * @param {*} obj
 * @param {*} key
 * @param {*} newclass
 * @protected
 */
Writer.prototype._parse_class = function(obj, key, newclass){
    if (obj.obj[key] instanceof newclass) {
        this._parse(obj.obj[key]);
    } else {
        this._parse(new newclass(obj.obj[key]));
    }
};

/**
 * @param {QStringList} obj
 * @protected
 */
Writer.prototype._parse_qstringlist = function(obj){
    var size = 0, key;
    for (key in obj.obj) {
        if (obj.obj.hasOwnProperty(key)) size++;
    }
    this.writeUInt(size); // nb of elements in the list
    for (key in obj.obj) {
        if (obj.obj.hasOwnProperty(key)) {
            // Value
            this._parse_class(obj, key, QString);
        }
    }
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
    this.writeUInt(size); // nb of elements in the list
    for (key in obj.obj) {
        if (obj.obj.hasOwnProperty(key)) {
            // Value
            this._parse_class(obj, key, QVariant);
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
            this._parse_class(obj, key, QVariant);
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
    if (obj.obj instanceof QUserType) {
        this.writeByteArray(obj.obj.getName());
    }
    return this._parse(obj.obj);
};

/**
 * Add specified buffer to the internal buffer list
 * @param {Buffer} b
 * @returns {Writer}
 */
Writer.prototype.write = function(b){
    this.bufs.push(b);
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
    this.write(b);
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
        this.write(b);
    }
    return this;
};

/**
 * Add a char buffer to the internal buffer list
 * @param {string} str
 * @returns {Writer}
 */
Writer.prototype.writeChar = function(str) {
    var b = Writer.conv(str);
    this.write(b);
    return this;
};

/**
 * Add a byteArray buffer to the internal buffer list
 * @param {(Array|string)} arr
 * @returns {Writer}
 */
Writer.prototype.writeByteArray = function(arr) {
    if (arr === null){
        this.writeUInt(0xffffffff);
    } else {
        var b = new Buffer(arr);
        this.writeUInt(b.length);
        this.write(b);
    }
    return this;
};

/**
 * Add a int32 buffer to the internal buffer list
 * @param {Number} i
 * @returns {Writer}
 */
Writer.prototype.writeInt = function(i){
    var b = new Buffer(4);
    b.writeInt32BE(i, 0, true);
    this.write(b);
    return this;
};

/**
 * Add a uint32 buffer to the internal buffer list
 * @param {Number} i
 * @returns {Writer}
 */
Writer.prototype.writeUInt = function(i){
    var b = new Buffer(4);
    b.writeUInt32BE(i, 0, true);
    this.write(b);
    return this;
};

/**
 * Add a int64 buffer to the internal buffer list
 * @param {Number} i
 * @returns {Writer}
 */
Writer.prototype.writeInt64 = function(i){
    var b = Int64(i).toBuffer();
    this.write(b);
    return this;
};

/**
 * Add a uint64 buffer to the internal buffer list
 * @param {Number} i
 * @returns {Writer}
 */
Writer.prototype.writeUInt64 = function(i){
    var b = UInt64(i).toBuffer();
    this.write(b);
    return this;
};

/**
 * Add a double buffer to the internal buffer list
 * @param {Number} i
 * @returns {Writer}
 */
Writer.prototype.writeDouble = function(i){
    var b = new Buffer(8);
    b.writeDoubleBE(i, 0, true);
    this.write(b);
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
    this.write(b);
    return this;
};

/**
 * Add a QDateTime buffer to the internal buffer list.
 * <uint32 julian day><uint32 milliseconds since midnight><bool isUTC>
 * @param {Date} i
 * @returns {Writer}
 */
Writer.prototype.writeDateTime = function(datetime){
    var milliseconds = ((+datetime) % 86400000) - (datetime.getTimezoneOffset() * 60000);
    var julianday = util.dateToJulianDay(datetime);
    this.writeUInt(julianday);
    this.writeUInt(milliseconds);
    this.writeBool(datetime.getTimezoneOffset() === 0);
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
