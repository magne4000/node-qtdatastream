/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

const { transform } = require('../index');

function equalBuffers(test, x, y) {
  if (x.compare(y) === 0) {
    return test.ok(true);
  }
  return test.ok(false, `${x.inspect()} !== ${y.inspect()}`);
}

exports.write_transform = {
  setUp: function(done) {
    this.wt = new transform.WriteTransform();
    this.in = 1;
    this.out = Buffer.from([ 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01 ]);
    done();
  },
  'no args': function(test) {
    this.wt.on('data', (chunk) => {
      equalBuffers(test, this.out, chunk);
      test.done();
    });
    this.wt.write(this.in);
  }
};

exports.read_transform = {
  setUp: function(done) {
    this.rt = new transform.ReadTransform();
    this.in = Buffer.from([ 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01 ]);
    this.out = 1;
    done();
  },
  'no args': function(test) {
    this.rt.on('data', (chunk) => {
      test.equals(this.out, chunk);
      test.done();
    });
    this.rt.write(this.in);
  }
};
