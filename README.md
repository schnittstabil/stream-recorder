# stream-recorder [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-recorder.svg)](https://gemnasium.com/schnittstabil/stream-recorder) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-recorder.svg)](https://travis-ci.org/schnittstabil/stream-recorder) [![Coverage Status](https://coveralls.io/repos/schnittstabil/stream-recorder/badge.png)](https://coveralls.io/r/schnittstabil/stream-recorder)

A Duplex stream which collects all chunks passed through.

```bash
npm install stream-recorder --save
```

## Usage

### Streams of strings

Then pipe through a recorder instance and retrieve the buffer:

```Javascript
var Recorder = require('stream-recorder'),
    streamFromArray = require('stream-from-array'), // npm install stream-from-array
    input = ['foo', 'bar'];

streamFromArray(input)
  .pipe(Recorder(function(buffer){
    // it's not an object stream, so buffer is a node buffer
    console.log(buffer.toString()); // output: foobar
  }))
  .resume(); // switch into flowing-mode (!)
```


### Test your [Gulpplugins](http://gulpjs.com/) with _stream-recorder_

Gulp files are [vinyl](https://github.com/wearefractal/vinyl) files:

```bash
npm install vinyl
```

```Javascript
var streamFromValue = require('stream-from-value');

var File = require('vinyl');

var helloFile = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/world.js',
      contents: new Buffer('console.log("Hello world!");')
    });

describe('yourAwsomeGulpPlugin', function() {
  it('should process gulp (vinyl) files', function(done) {

    streamFromValue.obj(helloFile)
      .pipe(yourAwsomeGulpPlugin())
      .pipe(Recorder.obj(function(buffer) {
        // it's an object stream, so buffer is an array - of gulp files
        console.log(buffer[0].contents); // dunno what yourAwsomeGulpPlugin does :-)
        done();
      }))
      .resume(); // switch into flowing-mode (!)

  });
});
```

## API

### Class: StreamRecorder

Stream recorders are [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) streams.

#### new StreamRecorder([options], [finishCallback])

* _options_ `Object` passed through [new stream.Transform([options])](http://nodejs.org/api/stream.html#stream_new_stream_transform_options)
* _finishCallback_ `Function (buffer)` This Callback is called during the `finish` event of StreamRecorder

Note: The `new` operator can be omitted.

#### StreamRecorder.buffer

* In `objectMode` it is the array of JavaScript values (`number | object | string | ... `) passed through
* Otherwise it is a node Buffer which contains the values of `string`s and `buffer`s passed through

#### StreamRecorder#obj([options], [finishCallback])

A convenience wrapper for `new StreamRecorder({objectMode: true, ...}, finishCallback)`.

## License

Copyright (c) 2014 Michael Mayer

Licensed under the MIT license.
