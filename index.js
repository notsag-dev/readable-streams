const { createReadStream } = require('fs');
const { Readable } = require('stream');

// Using on data event strategy for reading files. No much control
// on the data flow as when the event is called the chunk is
// automatically consumed.
function readFile(filename) {
  const stream = createReadStream(filename);

  stream.on('data', (chunk) => {
    console.log(chunk);
  });
}
readFile('./rfc793_TCP.txt');

// Polling strategy for reading files (recommended over previous
// approach). More control on the data flow as it's up to the consumer
// if read() is called or not. When read is called the chunk is
// consumed from the stream.
function readFilePolling(filename) {
  const stream = createReadStream(filename);

  stream.on('readable', () => {
    let data;
    while ((data = stream.read()) !== null) {
      console.log(data);
    }
  });
}
readFilePolling('./rfc793_TCP.txt');

// Another polling strategy that looks quite elegant and readable:
// async iterators.
async function readFileAsyncIterator(filename) {
  let chunk;
  for await (chunk of createReadStream(filename)) {
    console.log(chunk);
  }
}
readFileAsyncIterator('./rfc793_TCP.txt');

// Now, instead of reading from a file, let's use a generator to
// generate the data.
function* generate() {
  for (let i = 0; i <= 30; i++) {
    yield i;
  }
}

// Create readable stream from generator and read it using the
// "on data" read strategy.
const streamGenerator = Readable.from(generate());
streamGenerator.on('data', console.log);

// Create readable stream from generator and read it using the
// "on readable" read strategy.
const streamGeneratorReadable = Readable.from(generate());
streamGeneratorReadable.on('readable', () => {
  let chunk;
  while ((chunk = streamGeneratorReadable.read()) !== null) {
    console.log(chunk);
  }
});

// Create stream from generator and read it using an async iterator.
async function readStreamFromAsyncIterator() {
  const stream = Readable.from(generate());
  let chunk;
  for await (chunk of stream) {
    console.log(chunk);
  }
}
readStreamFromAsyncIterator();

// Note: Readable.from can receive any iterable object as parameter.

// Let's now use async generators, which will make it even easier to
// iterate over the chunks. In this case is not necessary to
// explicitly create a readable stream from the generator as it can be
// iterated over directly.
async function* asyncGenerate() {
  for (let i = 0; i <= 10; i++) {
    yield i;
  }
}
async function readAsyncGenerator() {
  for await (const chunk of asyncGenerate()) {
    console.log(chunk);
  }
}
readAsyncGenerator();

// DON'Ts
// - Don't use async functions as strams callbacks.
// - Don't mix stream consume strategies. E.g. if you use "on data",
//   don't mix it with "on readable" or async iterators.
//
// Resources:
//  https://nodejs.org/api/stream.html#stream_event_readable
//  https://www.youtube.com/watch?v=aTEDCotcn20
