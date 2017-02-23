/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2016 Joël Charles
 * Licensed under the MIT license.
 */

const { types, buffer } = require('../index');

class TestData {
  constructor(aclass, original, buffer) {
    this.aclass = aclass;
    this.original = original;
    this.expected = original;
    this.buffer = buffer;
  }
}

class ElaboratedTestData extends TestData {
  constructor(aclass, original, buffer, expected) {
    super(aclass, original, buffer);
    this.expected = expected;
  }
}

function equalBuffers(test, x, y) {
  if (x.compare(y) === 0) {
    return test.ok(true);
  }
  return test.ok(false, `${x.inspect()} !== ${y.inspect()}`);
}

exports.simple_types = {
  setUp: function(done) {
    const d = new Date(2012, 1, 2, 1, 1, 1, 0);
    const utc = d.getTimezoneOffset() === 0 ? 0x01 : 0x00;
    this.data = [
      new TestData(types.QInvalid, undefined, Buffer.alloc(0)),
      new TestData(types.QBool, true, Buffer.from([ 0x01 ])),
      new TestData(types.QBool, false, Buffer.from([ 0x00 ])),
      new TestData(types.QShort, 12, Buffer.from([ 0x00, 0x0c ])),
      new TestData(types.QInt, -1, Buffer.from([ 0xff, 0xff, 0xff, 0xff ])),
      new TestData(types.QUInt, 1, Buffer.from([ 0x00, 0x00, 0x00, 0x01 ])),
      new TestData(types.QInt64, -1, Buffer.from([ 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff ])),
      new TestData(types.QUInt64, 1, Buffer.from([ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01 ])),
      new TestData(types.QDouble, -12.684, Buffer.from([ 0xc0, 0x29, 0x5e, 0x35, 0x3f, 0x7c, 0xed, 0x91 ])),
      new TestData(types.QChar, '≡', Buffer.from([ 0x61, 0x22 ])),
      new TestData(types.QString, '田中さんにあげて下さい', Buffer.from([ 0x00, 0x00, 0x00, 0x16, 0x30, 0x75, 0x2d, 0x4e, 0x55, 0x30, 0x93, 0x30, 0x6b, 0x30, 0x42, 0x30, 0x52, 0x30, 0x66, 0x30, 0x0b, 0x4e, 0x55, 0x30, 0x44, 0x30 ])),
      new TestData(types.QStringList, [ '≡', '田' ], Buffer.from([ 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x02, 0x61, 0x22, 0x00, 0x00, 0x00, 0x02, 0x30, 0x75 ])),
      new TestData(types.QTime, 3600000, Buffer.from([ 0x00, 0x36, 0xee, 0x80 ])),
      new TestData(types.QDateTime, d, Buffer.from([ 0x00, 0x25, 0x79, 0x98, 0x00, 0x37, 0xdc, 0xc8, utc ])),
      new ElaboratedTestData(types.QByteArray, '123456789', Buffer.from([ 0x00, 0x00, 0x00, 0x09, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39 ]), Buffer.from([ 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39 ])),
    ];
    done();
  },
  'no args': function(test) {
    test.expect(this.data.length * 2);

    let buf, ori;
    for (let testdata of this.data) {
      buf = new buffer.ReadBuffer(testdata.aclass.from(testdata.original).toBuffer());
      ori = testdata.aclass.read(buf);

      equalBuffers(test, testdata.buffer, buf.buffer);
      test.deepEqual(testdata.expected, ori, 'Decoded objects and expected are not the same.');
    }

    test.done();
  }
};

exports.qvariant = {
  setUp: function(done) {
    const d = new Date(2012, 1, 2, 1, 1, 1, 0);
    const utc = d.getTimezoneOffset() === 0 ? 0x01 : 0x00;
    this.data = [
      new ElaboratedTestData(types.QVariant, new types.QVariant('田'), Buffer.from([ 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x02, 0x30, 0x75 ]), '田'),
      new ElaboratedTestData(types.QVariant, new types.QVariant(new types.QString('田')), Buffer.from([ 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x02, 0x30, 0x75 ]), '田'),
      new ElaboratedTestData(types.QVariant, new types.QVariant(undefined), Buffer.from([ 0x00, 0x00, 0x00, 0x00, 0x01 ]), undefined),
      new ElaboratedTestData(types.QVariant, new types.QVariant(d), Buffer.from([ 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x25, 0x79, 0x98, 0x00, 0x37, 0xdc, 0xc8, utc ]), d),
    ];
    done();
  },
  'no args': function(test) {
    test.expect(this.data.length * 2);

    let buf, ori;
    for (let testdata of this.data) {
      buf = new buffer.ReadBuffer(testdata.aclass.from(testdata.original).toBuffer());
      ori = testdata.aclass.read(buf);

      equalBuffers(test, testdata.buffer, buf.buffer);
      test.deepEqual(testdata.expected, ori, 'Decoded objects and expected are not the same.');
    }

    test.done();
  }
};

exports.qmap = {
  setUp: function(done) {
    // corresponds to { a: '1', b: 1 }
    const buffer = Buffer.from([
      0x00, 0x00, 0x00, 0x02, // number of elements in the map
      // first QString key
      0x00, 0x00, 0x00, 0x02, // length 2
      0x00, 0x61, // value
      // first QVariant value
      0x00, 0x00, 0x00, 0x0a, // type (QString)
      0x00, // is not null
      // QString inside first QVariant value
      0x00, 0x00, 0x00, 0x02, // length 2
      0x00, 0x31, // value

      // second QString key
      0x00, 0x00, 0x00, 0x02, // length 2
      0x00, 0x62, // value
      // second QVariant value
      0x00, 0x00, 0x00, 0x03, // type (QUInt)
      0x00, // is not null
      0x00, 0x00, 0x00, 0x01 // value
    ]);
    this.data = [
      new TestData(types.QMap, { a: '1', b: 1 }, buffer),
      new ElaboratedTestData(types.QMap, new Map([[ 'a', '1' ], [ 'b', 1 ]]), buffer, { a: '1', b: 1 }),
    ];

    done();
  },
  'no args': function(test) {
    test.expect(this.data.length * 2);

    let buf, ori;
    for (let testdata of this.data) {
      buf = new buffer.ReadBuffer(testdata.aclass.from(testdata.original).toBuffer());
      equalBuffers(test, testdata.buffer, buf.buffer);

      ori = testdata.aclass.read(buf);
      test.deepEqual(testdata.expected, ori, 'Decoded objects and expected are not the same.');
    }

    test.done();
  }
};

exports.qusertype_simple = {
  setUp: function(done) {
    types.QUserType.register('NetworkId', types.Types.INT);

    this.networkId = new types.QVariant(new types.QUserType('NetworkId', 4000));
    this.networkIdBuffer = Buffer.from([
      // QVariant
      0x00, 0x00, 0x00, 0x7f, // QVariant type
      0x00, // is not null
      // QUserType identifier
      0x00, 0x00, 0x00, 0x09, // length 9
      0x4e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x49, 0x64, // value

      // QUserType value
      0x00, 0x00, 0x0f, 0xa0 // QUInt
    ]);
    this.networkIdExpected = 4000;

    done();
  },
  'no args': function(test) {
    const buf = new buffer.ReadBuffer(this.networkId.toBuffer());
    equalBuffers(test, this.networkIdBuffer, buf.buffer);

    const ori = types.QVariant.read(buf);
    test.deepEqual(this.networkIdExpected, ori, 'Decoded objects and expected are not the same.');

    test.done();
  }
};


exports.qusertype_elaborated = {
  setUp: function(done) {
    types.QUserType.register('NWI', types.Types.INT);
    types.QUserType.register('BufferInfo', [
      { type: types.Types.SHORT },
      { name: types.Types.BYTEARRAY },
      { ni1: 'NWI' },
      { ni2: 'NWI' }
    ]);

    this.bufferInfo = new types.QVariant(new types.QUserType('BufferInfo', {
      type: 5,
      name: 'BufferInfo2',
      ni1: new types.QUserType('NWI', 4000),
      ni2: 4000
    }));
    this.bufferInfoBuffer = Buffer.from([
      // QVariant
      0x00, 0x00, 0x00, 0x7f, // QVariant type
      0x00, // is not null
      // QUserType identifier
      0x00, 0x00, 0x00, 0x0a, // length 10
      0x42, 0x75, 0x66, 0x66, 0x65, 0x72, 0x49, 0x6e, 0x66, 0x6f, // value

      // QUserType object
      0x00, 0x05, // QShort
      // QByteArray
      0x00, 0x00, 0x00, 0x0b, // length 11
      0x42, 0x75, 0x66, 0x66, 0x65, 0x72, 0x49, 0x6e, 0x66, 0x6f, 0x32, //value
      0x00, 0x00, 0x0f, 0xa0, // QUserType NetworkId as QInt
      0x00, 0x00, 0x0f, 0xa0 // QUserType NetworkId as QInt
    ]);
    this.bufferInfoExpected = {
      type: 5,
      name: Buffer.from([ 0x42, 0x75, 0x66, 0x66, 0x65, 0x72, 0x49, 0x6e, 0x66, 0x6f, 0x32 ]),
      ni1: 4000,
      ni2: 4000
    };

    done();
  },
  'no args': function(test) {
    const buf = new buffer.ReadBuffer(this.bufferInfo.toBuffer());
    equalBuffers(test, this.bufferInfoBuffer, buf.buffer);

    const ori = types.QVariant.read(buf);
    test.deepEqual(this.bufferInfoExpected, ori, 'Decoded objects and expected are not the same.');

    test.done();
  }
};