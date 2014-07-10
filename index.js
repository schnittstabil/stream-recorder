'use strict';
var Transform = require('stream').Transform,
    inherits = require('util').inherits;

function noop() {}

function sanitizeArguments(/* [options], [done] */){
  var options = {},
      done = noop;

  if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      done = arguments[0];
    } else {
      options = arguments[0];
    }
  } else if (arguments.length > 1) {
    if (arguments[0]) {
      options = arguments[0];
    }
    done = arguments[1];
  }
  return [options, done];
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

  this.errors = [];

  var self = this;
  this.on('error', function(err){
    self.errors.push(err);
  });

  this.on('finish', function(){
    var errors = self.errors.length > 0 ? self.errors : null;
    done.call(done, errors, self.data);
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
