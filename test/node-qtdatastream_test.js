/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2016 Joël Charles
 * Licensed under the MIT license.
 */

'use strict';

var qtdatastream = require('../lib/qtdatastream'),
    Writer = qtdatastream.Writer,
    Reader = qtdatastream.Reader,
    QStringList = qtdatastream.QStringList,
    QChar = qtdatastream.QChar,
    QInt = qtdatastream.QInt,
    QShort = qtdatastream.QShort,
    QByteArray = qtdatastream.QByteArray,
    QInt64 = qtdatastream.QInt64,
    QUInt64 = qtdatastream.QUInt64,
    QDouble = qtdatastream.QDouble,
    QInvalid = qtdatastream.QInvalid,
    QUserType = qtdatastream.QUserType;

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.pingpong = {
  setUp: function(done) {
    // Generate an object that will be converted
    // to buffer, and converted back to an object
    
    qtdatastream.registerUserType("NetworkId", qtdatastream.Types.INT);
    qtdatastream.registerUserType("BufferInfo", [
        {id: qtdatastream.Types.INT},
        {network: qtdatastream.Types.INT},
        {type: qtdatastream.Types.SHORT},
        {group: qtdatastream.Types.INT},
        {name: qtdatastream.Types.BYTEARRAY},
        {ni: "NetworkId"}
    ]);
    this.date1 = new Date('2016-06-29 06:00:00');
    this.date2 = new Date('2016-06-29 20:00:00');
    this.date3 = new Date();

    this.streamObj = {
        "AString": "BStringéàñ",
        "CharTest": new QChar("a"),
        "CString": ["DString", 1, 4, true],
        "TestStringList" : new QStringList(["a", "b", "c"]),
        "TestInt" : new QInt(2),
        "TestInt64": new QInt64(2),
        "TestUInt64": new QUInt64(2),
        "TestDouble": new QDouble(2.225),
        "TestByteArray" : new QByteArray("aaa"),
        "TestShort" : new QShort(4),
        "NetworkId": new QUserType("NetworkId", 32),
        "BufferInfo": new QUserType("BufferInfo", {
            id: 2,
            network: 4,
            type: 5,
            group: 1,
            name: "BufferInfo2",
            ni: new QUserType("NetworkId", 4000)
        }),
        "Date1": this.date1,
        "Date2": this.date2,
        "Date3": this.date3,
        "Invalid": new QInvalid(),
        "EString": ""
    };
    this.streamObjRet = {
        "AString": "BStringéàñ",
        "CharTest": "a",
        "CString": ["DString", 1, 4, 1],
        "TestStringList" : ["a", "b", "c"],
        "TestInt" : 2,
        "TestInt64": 2,
        "TestUInt64": 2,
        "TestDouble": 2.225,
        "TestByteArray" : new Buffer("aaa"),
        "TestShort" : 4,
        "NetworkId": 32,
        "BufferInfo": {
            id: 2,
            network: 4,
            type: 5,
            group: 1,
            name: new Buffer("BufferInfo2"),
            ni: 4000
        },
        "Date1": this.date1,
        "Date2": this.date2,
        "Date3": this.date3,
        "Invalid": undefined,
        "EString": ""
    };

    this.slist = [
        2,
        "BacklogManager",
        "",
        "requestBacklog",
        new QUserType("NetworkId", 5),
        new QUserType("NetworkId", -1),
        new QUserType("NetworkId", -1),
    ];

    this.slistRet = [
        2,
        "BacklogManager",
        "",
        "requestBacklog",
        5,
        -1,
        -1
    ];
    done();
  },
  'no args': function(test) {
    test.expect(2);
    var w = new Writer(this.streamObj);
    var r = new Reader(w.getBuffer());
    try {
        r.parse();
    } catch (e){
        console.trace(e);
    }
    test.deepEqual(r.parsed, this.streamObjRet, 'Original and computed objects are not the same.');

    w = new Writer(this.slist);
    r = new Reader(w.getBuffer());
    try {
        r.parse();
    } catch (e){
        console.trace(e);
    }
    test.deepEqual(r.parsed, this.slistRet, 'Original and computed objects are not the same.');
    
    test.done();
  }
};
