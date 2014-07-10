'use strict';
var Transform = require('stream').Transform,
    inherits = require('util').inherits;

function noop() {}

function sanitizeArguments(options, done){
  if (done) {
    // both args
    return [options, done];
  }

  if (!options) {
    // no args
    return [{}, noop];
  }

  // one arg
  if (typeof options === 'function') {
    return [{}, options];
  }
  return [options, noop];
}

function StreamRecorder(/* [options], [done] */) {
  if (!(this instanceof StreamRecorder)) {
    return new StreamRecorder(arguments[0], arguments[1]);
  }

  var args = sanitizeArguments.apply(null, arguments),
      options = args[0],
      done = args[1];

  Transform.call(this, options);
  this.objectMode = options.objectMode;

  if (this.objectMode) {
    this.data = [];
  } else {
    this.data = new Buffer('', options.encoding);
  }

  var self = this;

  this.on('finish', function(){
    done.call(done, self.data);
  });
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

StreamRecorder.obj = function (/* [options], [done] */) {
  var args = sanitizeArguments.apply(null, arguments);
  args[0].objectMode = true;
  return StreamRecorder.apply(null, args);
};

module.exports = StreamRecorder;
