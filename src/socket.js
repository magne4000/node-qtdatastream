/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/socket */

const events = require('events');
const debuglib = require('debug');
const transform = require('./transform');
const logger = debuglib('qtdatastream:socket');
let debug = Boolean(process.env.QTDSDEBUG) || debuglib.enabled('qtdatastream:*');

if (debug && !debuglib.enabled('qtdatastream:*')) {
  debuglib.enable('qtdatastream:*');
}

/**
 * Qt compliant Socket overload.
 * `data` event is triggered only when full buffer is parsed.
 * `error`, `close` and `end` event are not altered.
 * @extends events.EventEmitter
 * @static
 * @param {*} socket Underlying socket
 * @example
 * const { Socket } = require('qtdatastream').socket;
 *
 * // socket can be a net.Socket or a websocket
 * const qtsocket = new Socket(socket);
 * qtsocket.on('read', (data) => {
 *   console.log(data);
 * });
 * qtsocket.write('Hello');
 */
class Socket extends events.EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    this.data_state = null;
    this.write_stream = new transform.WriteTransform();
    this.read_stream = new transform.ReadTransform();
    this.read_stream.on('data', (data) => {
      process.nextTick(() => this.emit('data', data));
    });

    if (socket) this.setSocket(socket);
  }

  /**
   * Transforms and write data to underlying socket
   * @function module:qtdatastream/socket.Socket#write
   * @param {*} data
   */
  write(data) {
    this.write_stream.write(data);
  }

  /**
   * Detach underlying socket
   * @function module:qtdatastream/socket.Socket#detachSocket
   * @returns {stream.Duplex} underlying socket that has been detached
   */
  detachSocket() {
    if (debug) {
      logger('removing socket');
    }
    const { socket } = this;
    this.write_stream.unpipe(socket);
    socket.unpipe(this.read_stream);
    this.socket = null;
    return socket;
  }

  /**
   * Update the socket (for example to promote it to SSL stream)
   * @function module:qtdatastream/socket.Socket#setSocket
   * @param {stream.Duplex} socket
   */
  setSocket(socket) {
    if (this.socket !== null) {
      this.detachSocket();
    }

    if (debug) {
      logger('updating socket');
    }

    this.socket = socket;
    this.write_stream.pipe(this.socket).pipe(this.read_stream);

    this.socket.on('error', (e) => {
      if (debug) {
        logger('ERROR', e);
      }
      this.emit('error', e);
    });

    this.socket.on('close', () => {
      if (debug) {
        logger('Connection closed');
      }
      this.emit('close');
    });

    this.socket.on('end', () => {
      if (debug) {
        logger('END');
      }
      this.emit('end');
    });
  }

  /**
   * @see {@link module:qtdatastream/socket.Socket#setSocket}
   * @deprecated
   */
  updateSocket(socket) {
    return this.setSocket(socket);
  }
}

module.exports = {
  Socket
};