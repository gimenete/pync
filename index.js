'use strict'

var pync = module.exports = {}

pync.map = (arr, func) => {
  let results = []
  let promise = Promise.resolve()
  arr.forEach((value, i) => {
    promise = promise.then((result) => {
      results.push(result)
      return func(value, i)
    })
  })
  return promise
    .then((value) => {
      results.push(value)
      results.shift()
      return results
    })
}

pync.series = (arr, func) => {
  let promise = Promise.resolve()
  arr.forEach((value, i) => {
    promise = promise.then(() => func(value, i))
  })
  return promise
}

pync.dict = (keys, func) => {
  let result = {}
  let promise = Promise.resolve()
  keys.forEach((key, i) => {
    promise = promise.then(() => func(key, i))
      .then((res) => {
        result[key] = res
      })
  })
  return promise.then(() => result)
}

pync.whilst = (test, func, initial) => {
  let i = 0
  let next = (value) => Promise.resolve().then(() => func(value, i++)).then((val) => test(val) ? next(val) : val)
  return next(initial)
}
