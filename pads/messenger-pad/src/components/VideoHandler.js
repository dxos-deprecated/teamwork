//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

/**
 * Handles the video streams and the stream+metadata distribution over connected peers
 */
class VideoHandler {
  /**
   * @param {MediaStream} stream - The stream to distribute over connected peers
   */
  setStream (stream) {
    assert(!this._stream);
    this._stream = stream;
    this._publishStream();
  }

  /**
   * @param {MediaStream} stream - The screen share to distribute over connected peers
   */
  setScreenShare (shareStream) {
    assert(!this._shareStream);
    this._shareStream = shareStream;
    this._publishScreenShare();
  }

  /**
   * @param {Object} metaData - The meta data to distribute over connected peers
   */
  setMetaData (metaData) {
    this._metaData = metaData;
    this._publishMetaData();
  }

  /**
   * @param  {Object} connections - Connected peers that should receive the stream
   */
  setConnections (connections) {
    assert(connections);
    this._connections = connections;
    this._publishStream();
    this._publishMetaData();
    this._publishScreenShare();
  }

  stop () {
    this.clearStream();
    this.clearScreenShare();
  }

  clearStream () {
    this._clear(this._stream);
    this._stream = undefined;
  }

  clearScreenShare () {
    this._clear(this._shareStream);
    this._shareStream = undefined;
  }

  _clear (stream) {
    if (!stream) {
      return;
    }
    if (this._connections) {
      this._connections.forEach(connection => connection.peer.removeStream(stream));
    }
    stream.getTracks().forEach(track => track.stop());
  }

  _publish (stream) {
    if (!stream || !this._connections) {
      return;
    }
    this._connections.forEach(connection => {
      try {
        connection.peer.addStream(stream);
      } catch (err) {
        if (err.code !== 'ERR_SENDER_ALREADY_ADDED') {
          throw err;
        }
      }
    });
  }

  _publishStream () {
    this._publish(this._stream);
  }

  _publishScreenShare () {
    this._publish(this._shareStream);
  }

  _publishMetaData () {
    if (!this._metaData || !this._connections) {
      return;
    }
    this._connections.forEach(connection => {
      try {
        connection.peer.send(JSON.stringify(this._metaData));
      } catch (err) {
        console.error(`MetaData could not be send to connection ${connection.connectionId}`, err);
      }
    });
  }
}

export default VideoHandler;
