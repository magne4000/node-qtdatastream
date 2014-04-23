'use strict';

var qtdatastream = require('../lib/qtdatastream'),
    Writer = qtdatastream.Writer,
    Reader = qtdatastream.Reader,
    QStringList = qtdatastream.QStringList,
    QInt = qtdatastream.QInt,
    QShort = qtdatastream.QShort;

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

exports['pingpong'] = {
  setUp: function(done) {
    // Generate an object that will be converted
    // to buffer, and converted back to an object
    this.streamObj = {
        "AString": "BString",
        "CString": ["DString", 1, 4, true],
        "TestStringList" : new QStringList(["a", "b", "c"]),
        "TestInt" : new QInt(2),
        "TestShort" : new QShort(4),
        "EString": ""
    };
    this.streamObjRet = {
        "AString": "BString",
        "CString": ["DString", 1, 4, true],
        "TestStringList" : ["a", "b", "c"],
        "TestInt" : 2,
        "TestShort" : 4,
        "EString": ""
    };
    done();
  },
  'no args': function(test) {
    test.expect(1);
    var w = new Writer(this.streamObj);
    var r = new Reader(w.getBuffer());
    r.parse();
    test.deepEqual(r.parsed, this.streamObjRet, 'Original and computed objects are not the same.');
    test.done();
  }
};
