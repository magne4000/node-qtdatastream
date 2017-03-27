/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

const { socket } = require('../index');
const stream = require('stream');

function equalBuffers(test, x, y) {
  if (x.compare(y) === 0) {
    return test.ok(true);
  }
  return test.ok(false, `${x.inspect()} !== ${y.inspect()}`);
}

class DummyDuplex extends stream.Duplex {
  constructor(buffer, options) {
    super(options);
    this.buffer = buffer;
  }

  _write(chunk, encoding, callback) {
    this.emit('written', chunk);
    this.push(this.buffer);
    callback();
  }

  _read(_size) {}
}

exports.socket = {
  setUp: function(done) {
    this.in_writer = 1;
    this.out_writer = Buffer.from([ 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01 ]);
    this.in_reader = Buffer.from([ 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x02 ]);
    this.expected = 2;
    this.dummy = new DummyDuplex(this.in_reader);
    this.socket = new socket.Socket(this.dummy);
    done();
  },
  'no args': function(test) {
    test.expect(2);

    this.dummy.on('written', (chunk) => {
      equalBuffers(test, this.out_writer, chunk);
    });

    this.socket.on('data', (x) => {
      test.equals(this.expected, x);
      process.nextTick(() => test.done());
    });

    this.socket.write(this.in_writer);
  }
};
