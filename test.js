'use strict';
var Recorder = require('./index'),
    assert = require('assert'),
    gulp = require('gulp');

function Getter(name) {
  return function getter(obj) {
    return obj[name];
  };
}

describe('String streams', function() {
  var input = ['foo', '\uD834\uDF06', 'bar'];

  it('should be recorded', function() {
    var sut = new Recorder();
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.end();
    sut.resume();
    assert.strictEqual(sut.data.toString(), input.join(''));
  });

  it('should be recorded with callback, but w/o options', function(done) {
    var sut = new Recorder(function(err, data){
      assert.ifError(err);
      assert.strictEqual(data.toString(), input.join(''));
      done();
    });
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.end();
  });

  it('should be recorded with decodeStrings:false option', function(done) {
    var sut = new Recorder({decodeStrings: false}, function(err, data){
      assert.ifError(err);
      assert.strictEqual(data.toString(), input.join(''));
      done();
    });
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.end();
  });
});

describe('Erroneous streams', function() {
  var input = ['foo', 'bar'];
  it('done Callbac should be called', function(done) {
    var sut = new Recorder.obj(function(err, data){
      assert.ok(err);
      assert.strictEqual(err.length, 1);
      assert.strictEqual(data.join(''), input.join(''));
      done();
    });
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.emit('error', new Error('I\'m soooo bad!'));
    sut.end();
    sut.resume();
  });
});


describe('String object streams', function() {
  var input = ['foo', 'bar'];
  it('should be recorded', function() {
    var sut = new Recorder({objectMode: true});
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.end();
    sut.resume();
    assert.deepEqual(sut.data, input);
  });
});

describe('Mixed object streams', function() {
  // no null (!)
  var input = ['foo', 1, { foobar: 'foobar', answer: 42 }, {}, 'bar',
        undefined];
  it('should be recorded', function() {
    var sut = Recorder.obj();
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.end();
    sut.resume();
    assert.deepEqual(sut.data, input);
  });
});

describe('Gulp streams', function() {
  it('paths should be recorded', function(done) {
    var sut = new Recorder({objectMode: true});
    gulp.src(__filename)
      .pipe(sut)
      .on('error', done)
      .on('finish', function() {
        assert.deepEqual(sut.data.map(new Getter('path')), [__filename]);
        done();
      });
  });
});

describe('StreamRecorder constructor', function() {
  it('should return new instance w/o new', function() {
    var sut = Recorder,
        instance = sut();
    assert.strictEqual(instance instanceof Recorder, true);
  });
});
