# pync

Utilities for promises pync ~= promise + async

`Promise.all()` is very useful but it runs all promises in parallel. Pync solves that.

For example we have a function like this:

```javascript
function somethingAsync(value) {
  return new Promise((resolve, reject) => {
    console.log('starting', value)
    setTimeout(() => {
      console.log('finishing', value)
      resolve(`result ${value}`)
    }, 100)
  })
}
```

Then we use `Promise.all()`:

```javascript
Promise.all([1, 2, 3].map((value) => somethingAsync(value)))
  .then((results) => console.log('done', results))
```

We will see:

```
starting 1
starting 2
starting 3
finishing 1
finishing 2
finishing 3
done [ 'result 1', 'result 2', 'result 3' ]
```

This means all promises are started at once. What if we want to run one after another? Imagine you have an array of URLs and you want to download the files pointed by them. You probably don't want to download all at once. `pync` solves that with these two methods:

## pync.series(arr, func)

```javascript
const pync = require('pync')

const arr = [1, 2, 3]
pync.series(arr, (value) => somethingAsync(value))
  .then(() => console.log('done'))
```

This is the output:

```
starting 1
finishing 1
starting 2
finishing 2
starting 3
finishing 3
done
```

## pync.map(arr, func)

```javascript
const pync = require('pync')

const arr = [1, 2, 3]
pync.map(arr, (value) => somethingAsync(value))
  .then((results) => console.log('done', results))
```

This is the output:

```
starting 1
finishing 1
starting 2
finishing 2
starting 3
finishing 3
done [ 'result 1', 'result 2', 'result 3' ]
```

## pync.dict(arr, func)

Given an array of strings it will call `func` for each string and finally construct an object with all the keys mapped to the values returned by `func`.

```javascript
const pync = require('pync')

const arr = ['foo.txt', 'bar.txt']
pync.dict(arr, (filename) => readFileAsync(filename))
  .then((results) => console.log('done', results))
```

This is the output:

```
done { 'foo.txt': 'contents of foo.txt', 'bar.txt': 'contents of bar.txt' }
```

## pync.whilst(test, func[, initialValue])

It executes a given function `func` whilst a given function `test` returns a truly value. The `test` function must be synchronous and it's always evaluated before `func`. You can pass an initial value, in which case both the `test` and `func` functions will receive it as an argument. Then, the value returned by `func` will be passed to the next iteration, so both `test` and `func` will receive it. And when finally `test` returns a falsy value, the latest value returned by `func` will be returned by `pync.whilst()`

```javascript
const pync = require('pync')

const test = (totalAffectedRows) => totalAffectedRows < 1000
const func = (totalAffectedRows) => db.someBatchUpdate().then((result) => result.affectedRows + totalAffectedRows)
pync.whilst(test, func, 0)
  .then((totalAffectedRows) => console.log('total affected rows', totalAffectedRows))
```

# Installing

```bash
npm install pync --save
```
