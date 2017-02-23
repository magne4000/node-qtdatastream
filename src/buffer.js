/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/buffer */

const { Int64BE, Uint64BE } = require('int64-buffer');

/**
 * Wraps a buffer with an internal read pointer for sequential reads
 * @param {Buffer} buffer
 */
class ReadBuffer {
  constructor(buffer) {
    this.buffer = buffer;
    this.read_offset = 0;
  }

  remaining() {
    if (this.read_offset >= this.buffer.length) return null;
    return this.buffer.slice(this.read_offset);
  }

  readInt8() {
    const result = this.buffer.readInt8(this.read_offset);
    this.read_offset += 1;
    return result;
  }

  readInt16BE() {
    const result = this.buffer.readInt16BE(this.read_offset);
    this.read_offset += 2;
    return result;
  }

  readUInt16BE() {
    const result = this.buffer.readUInt16BE(this.read_offset);
    this.read_offset += 2;
    return result;
  }

  readInt32BE() {
    const result = this.buffer.readInt32BE(this.read_offset);
    this.read_offset += 4;
    return result;
  }

  readUInt32BE() {
    const result = this.buffer.readUInt32BE(this.read_offset);
    this.read_offset += 4;
    return result;
  }

  readInt64BE() {
    const result = (new Int64BE(this.buffer, this.read_offset)).toNumber();
    this.read_offset += 8;
    return result;
  }

  readUInt64BE() {
    const result = (new Uint64BE(this.buffer, this.read_offset)).toNumber();
    this.read_offset += 8;
    return result;
  }

  readDoubleBE() {
    const result = this.buffer.readDoubleBE(this.read_offset);
    this.read_offset += 8;
    return result;
  }

  slice(size) {
    const result = this.buffer.slice(this.read_offset, this.read_offset + size);
    this.read_offset += size;
    return result;
  }
}

module.exports = {
  ReadBuffer
};
