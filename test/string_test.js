'use strict';
var Recorder = require('../index'),
    expect = require('expect.js'),
    gulp = require('gulp');

describe('String streams', function() {
  var input = ['foo', '\uD834\uDF06', 'bar'];

  it('should be recorded', function() {
    var sut = new Recorder();
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.end();
    sut.resume();
    expect(sut.data.toString()).to.be(input.join(''));
  });

  it('should be recorded with decodeStrings:false option', function() {
    var sut = new Recorder({decodeStrings: false});
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.end();
    sut.resume();
    expect(sut.data.toString()).to.be(input.join(''));
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
    expect(sut.data).to.eql(input);
  });
});

describe('Mixed object streams', function() {
  // no null (!)
  var input = ['foo', 1, { foobar: 'foobar', answer: 42 }, {}, 'bar',
        undefined];
  it('should be recorded', function() {
    var sut = new Recorder({objectMode: true});
    input.forEach(function(i) {
      sut.write(i);
    }, sut);
    sut.end();
    sut.resume();
    expect(sut.data).to.eql(input);
  });
});

function Getter(name) {
  return function getter(obj) {
    return obj[name];
  };
}

describe('Gulp streams', function() {
  it('paths should be recorded', function(done) {
    var sut = new Recorder({objectMode: true});
    gulp.src(__filename)
      .pipe(sut)
      .on('error', done)
      .on('finish', function() {
        expect(sut.data.map(new Getter('path'))).to.eql([__filename]);
        expect(sut.data.length).to.be(1);
        done();
      });
  });
});

describe('StreamRecorder constructor', function() {
  it('should return new instance w/o new', function() {
    var sut = Recorder,
        instance = sut();
    expect(instance).to.be.a(Recorder);
  });
});
