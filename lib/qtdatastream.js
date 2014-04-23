/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2014 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream */

/**
 * Qt types list
 * @readonly
 * @enum {number}
 */
exports.Types = {
    BOOL: 1,
    INT: 2,
    UINT: 3,
    MAP: 8,
    LIST: 9,
    STRING: 10,
    STRINGLIST: 11,
    BYTEARRAY: 12,
    USERTYPE: 127,
    SHORT: 133
};

exports.QTDATASTREAMCLASS = "__QTDATASTREAMCLASS__";

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
exports.QVariant = function(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
    if (typeof obj === 'object') {
        var jstype = Object.prototype.toString.call(obj);
        if (obj instanceof exports.QString) {
            this.type = exports.Types.STRING;
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
        } else if (obj instanceof exports.QStringList) {
            this.type = exports.Types.STRINGLIST;
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
 * a QString for the Writer.
 * Javascript string are converted to QString objects internally.
 * When parsed from reader, QString objects are converted back to Javascript string
 * @class
 * @name QString
 * @param {*} obj
 * @example
 * new Writer(new QString(null)); // will be written as a null QString
 */
exports.QString = function(obj){
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
exports.QMap = function(obj){
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
exports.QList = function(obj){
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
exports.QStringList = function(obj){
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
exports.QUInt = function(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QBool for the Writer.
 * Javascript boolean are converted to QBool objects internally.
 * When parsed from reader, QBool objects are converted to Javascript number (0 or 1)
 * @class
 * @name QBool
 * @param {*} obj
 */
exports.QBool = function(obj){
    this.obj = obj?1:0;
    this._qclass = exports.QTDATASTREAMCLASS;
};

/**
 * This class allow users to force a specific object to be recognized as
 * a QInt for the Writer.
 * @class
 * @name QInt
 * @param {*} obj
 */
exports.QInt = function(obj){
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
exports.QShort = function(obj){
    this.obj = obj;
    this._qclass = exports.QTDATASTREAMCLASS;
};

exports.Writer = require('./writer');

exports.Reader = require('./reader');
