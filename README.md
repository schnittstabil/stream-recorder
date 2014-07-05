# stream-recorder [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-recorder.svg)](https://gemnasium.com/schnittstabil/stream-recorder) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-recorder.svg)](https://travis-ci.org/schnittstabil/stream-recorder) [![Coverage Status](https://coveralls.io/repos/schnittstabil/stream-recorder/badge.png)](https://coveralls.io/r/schnittstabil/stream-recorder)

A stream, collecting all chunks passed through.

## Usage

Install using:

```bash
npm install --save
```

Then pipe through a recorder instance and retrieve the data:
```Javascript
var Recorder = require('stream-recorder'),
    PassThrough = require('stream').PassThrough,
    opts = {objectMode: true},
    pre = new PassThrough(opts),
    recorder = new Recorder(opts),
    post = new PassThrough(opts);

post.on('finish', function() {
  console.log(recorder.data);
});

pre.pipe(recorder).pipe(post);

pre.write('foo');
pre.write(1);
pre.write({ foobar: 'foobar', answer: 42 });
pre.write('bar');
pre.end();

// switch into flowing-mode
post.resume();

/*
 * Output:
 *
 * [ 'foo', 1, { foobar: 'foobar', answer: 42 }, 'bar' ]
 */
```

## API

### Class: StreamRecorder

Stream recorders are [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) streams.

#### new StreamRecorder([options])

* _options_ `Object` passed through [new stream.Transform([options])](http://nodejs.org/api/stream.html#stream_new_stream_transform_options)

#### StreamRecorder.data

Array of chunks (`Buffer | String | Object`) passed through, see [transform._transform](http://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback) for details.

## License

Copyright (c) 2014 Michael Mayer

Licensed under the MIT license.
