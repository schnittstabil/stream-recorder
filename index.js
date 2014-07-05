'use strict';
var Transform = require('readable-stream/transform'),
    inherits = require('util').inherits;

function StreamRecorder(options) {
  if (!(this instanceof StreamRecorder)) {
    return new StreamRecorder(options);
  }
  options = options || {};

  Transform.call(this, options);
  this.objectMode = options.objectMode;

  if (this.objectMode) {
    this.data = [];
  } else {
    this.data = new Buffer('', options.encoding);
  }
}
inherits(StreamRecorder, Transform);

StreamRecorder.prototype._transform = function(chunk, encoding, done) {
  if (this.objectMode) {
    this.data.push(chunk);
  } else {
    if (typeof chunk === 'string') {
      chunk = new Buffer(chunk, encoding);
    }
    this.data = Buffer.concat([this.data, chunk]);
  }
  this.push(chunk, encoding);
  done();
};

StreamRecorder.obj = function (options) {
  options = options || {};
  options.objectMode = true;
  return new StreamRecorder(options);
};

module.exports = StreamRecorder;
