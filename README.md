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

```
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

This means all promises are started at once. What if we want to run one after another? Pync solves that with these two methods:

# Pync.series(arr, func)

```javascript
var pync = require('pync')

const arr = [/* whatever */]
pync.series(arr, (value) => somethingAsync(value))
  .then(() => console.log('done'))
```

# Pync.map(arr, func)

```javascript
var pync = require('pync')

const arr = [/* whatever */]
pync.map(arr, (value) => somethingAsync(value))
  .then((results) => console.log('done', results))
```
