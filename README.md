# readable-streams
Playing with some readable streams and async iterators examples and creating this for tomorrow when I have probably forgotten everything already.

## Reading files
### Read with `on data` strategy
Not great for buffering, there's no flow control. Data is read as quickly as possible.
```JS
function readFile(filename) {
  const stream = createReadStream(filename);

  stream.on('data', (chunk) => {
    console.log(chunk);
  });
}
```

### Read with `on readable` strategy
By using the `readable` event, the consumer has the freedom of deciding whether to read or not from the stream when the event is triggered.
```JS
function readFilePolling(filename) {
  const stream = createReadStream(filename);

  stream.on('readable', () => {
    let data;
    while ((data = stream.read()) !== null) {
      console.log(data);
    }
  });
}
```

### Read with `async iterators` strategy
A very elegant option to using the readable event is to use async iterators. The consumer still has control on how data is consumed and additionally it brings more readability.
```JS
async function readFileAsyncIterator(filename) {
  let chunk;
  for await (chunk of createReadStream(filename)) {
    console.log(chunk);
  }
}
```

## Reading from generators
Now, instead of reading information from files, let's read it from generators. This time let's just focus on the async iterators strategy.

Generator example:
```JS
function* generate() {
  for (let i = 0; i <= 30; i++) {
    yield i;
  }
}
```

Read with async iterator:

```JS
async function readStreamFromAsyncIterator() {
  const stream = Readable.from(generate());
  let chunk;
  for await (chunk of stream) {
    console.log(chunk);
  }
}
```

## Reading from async generators
Combining async generators and async iterators is a great option as it does not require to generate a readable stream from the generator in order to iterate over it.

Async generator example:
```JS
async function* asyncGenerate() {
  for (let i = 0; i <= 30; i++) {
    yield i;
  }
}

```

Read with async iterator:
```JS
async function readAsyncGenerator() {
  for await (const chunk of asyncGenerate()) {
    console.log(chunk);
  }
}
```

## Resources
- [Stream Into the Future (NodeJS Streams)](https://www.youtube.com/watch?v=aTEDCotcn20)
- [Node streams documentation](https://nodejs.org/api/stream.html)
