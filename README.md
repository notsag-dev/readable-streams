# readable-streams
Playing with some readable streams and async iterators examples and creating this for tomorrow when I have probably forgotten everything already.

## Reading files
### Read with `on data`
```JS
function readFile(filename) {
  const stream = createReadStream(filename);

  stream.on('data', (chunk) => {
    console.log(chunk);
  });
}
```

### Read with `on readable`
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


### Read with `async iterators`
```JS
async function readFileAsyncIterator(filename) {
  let chunk;
  for await (chunk of createReadStream(filename)) {
    console.log(chunk);
  }
}
```

## Read generators
Generator example:
```JS
function* generate() {
  for (let i = 0; i <= 30; i++) {
    yield i;
  }
}
```

### Read with `async iterators`
```JS
async function readStreamFromAsyncIterator() {
  const stream = Readable.from(generate());
  let chunk;
  for await (chunk of stream) {
    console.log(chunk);
  }
}
```

## Read async generators
Async generator example:
```JS
function* generate() {
  for (let i = 0; i <= 30; i++) {
    yield i;
  }
}

```
### Read with `async iterators`
```JS
async function readAsyncGenerator() {
  for await (const chunk of asyncGenerate()) {
    console.log(chunk);
  }
}
```
