/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/transform */

const { Transform } = require('stream');
const debuglib = require('debug');

const { ReadBuffer } = require('./buffer');
const types = require('./types');

const loggerr = debuglib('qtdatastream:transform:read');
const loggerw = debuglib('qtdatastream:transform:write');
const debug = debuglib.enabled('qtdatastream:*');

/**
 * ReadTransform data event.
 *
 * @event ReadTransform#data
 * @property {*} data JS object or type
 */
/**
 * WriteTransform data event.
 *
 * @event WriteTransform#data
 * @property {Buffer} buffer Qt Buffer
 */

/**
 * Transform Qt buffers into JS objects
 * @static
 * @extends stream.Transform
 * @fires ReadTransform#data
 * @example
 * const { ReadTransform } = require('qtdatastream').transform;
 *
 * const reader = new ReadTransform();
 *
 * reader.on('data', (data) => {
 *   // data === 1
 * });
 *
 * // Write a QDataStream
 * reader.write(Buffer.from([ 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01 ]));
 */
class ReadTransform extends Transform {
  constructor() {
    super(Object.assign({ readableObjectMode: true, writableObjectMode: false }));
    this.packet_no = 0;
    this.data_state = { size: Infinity, data: [], recvd: 0 };
  }

  static getsize(bufferlist) {
    // get 4 bytes
    let final_buffer;
    if (bufferlist[0] && bufferlist[0].length >= 4) {
      [ final_buffer ] = bufferlist;
    } else {
      let totallength = 0, i = 0;
      while (totallength < 4 && i < bufferlist.length) {
        totallength += bufferlist[i++].length;
      }
      if (totallength < 4) return Infinity;
      final_buffer = Buffer.concat(bufferlist.slice(0, i), totallength);
    }
    return final_buffer.readUInt32BE(0);
  }

  chunkify() {
    const out = [];
    while (true) {
      const ds = this.data_state;
      if (ds.size === Infinity && ds.recvd >= 4) {
        ds.size = ReadTransform.getsize(ds.data);
      }
      if (ds.size < Infinity && ds.size > 67108864) { // 64MB
        loggerr('Packets should not exceed 64MB (received %d bytes)', ds.size);
        throw new Error('oversized packet detected');
      }
      this.emit('progress', ds.recvd, ds.size);
      if (ds.size + 4 > ds.recvd) {
        if (debug) {
          loggerr('(%d/%d) Waiting for end of buffer', ds.recvd, ds.size + 4);
        }
        return out;
      }
      const buffer = new ReadBuffer(Buffer.concat(ds.data, ds.recvd));
      let size;
      if (debug) {
        loggerr('(%d/%d) Received full buffer', ds.recvd, ds.size + 4);
      }
      try {
        size = types.QUInt.read(buffer);
      } catch (e) {
        throw new Error('Error while fetching buffer size');
      }
      if (debug) {
        loggerr('buffer size : %d', size);
      }
      const parsed = types.QVariant.read(buffer);
      if (debug) {
        loggerr('Received result: %O', parsed);
      }
      out.push(parsed);
      const remaining = buffer.remaining();
      if (remaining !== null) {
        this.data_state = {
          data: [ remaining ],
          recvd: remaining.length,
          size: Infinity
        };
      } else {
        this.data_state = { size: Infinity, data: [], recvd: 0 };
        return out;
      }
    }
  }

  _transform(data, encoding, callback) {
    if (data !== null) {
      this.data_state.data.push(data);
      this.data_state.recvd += data.length;
    }
    let out;
    try {
      out = this.chunkify();
    } catch (e) {
      callback(e);
      return;
    }
    for (let i = 0; i < out.length; i++) {
      this.push(out[i]);
    }
    callback();
  }

  _flush(callback) {
    if (this.data_state && this.data_state.recvd > 0) {
      callback('stream ended in the middle of a packet');
    }
  }
}

/**
 * Transform JS types/objects into Qt buffers
 * @static
 * @extends stream.Transform
 * @fires WriteTransform#data
 * @example
 * const { ReadTransform } = require('qtdatastream').transform;
 *
 * const writer = new WriteTransform();
 *
 * writer.on('data', (data) => {
 *   // data === Buffer <00 00 00 09 00 00 00 03 00 00 00 00 01>
 * });
 *
 * // Write an int
 * writer.write(1);
 */
class WriteTransform extends Transform {
  constructor() {
    super(Object.assign({ readableObjectMode: false, writableObjectMode: true }));
  }

  /**
   * Get the buffer representation of the object.
   * It is prefixed by the packet size as defined in Qt framework.
   * @static
   * @returns {Buffer} A Qt styled buffer ready to be sent through a socket
   */
  static getBuffer(data){
    const buffer = types.QVariant.from(data).toBuffer();
    // Calculate size
    const totalSizeBuffer = types.QUInt.from(buffer.length).toBuffer();
    return Buffer.concat([ totalSizeBuffer, buffer ]);
  }

  _transform(data, encoding, callback) {
    loggerw(data);
    const buffer = WriteTransform.getBuffer(data);
    callback(null, buffer);
  }
}

module.exports = {
  ReadTransform,
  WriteTransform
};
