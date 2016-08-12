'use strict'

var pync = module.exports = {}

pync.map = (arr, func) => {
  let results = []
  let promise = Promise.resolve()
  arr.forEach((value) => {
    promise = promise.then((result) => {
      results.push(result)
      return func(value)
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
  arr.forEach((value) => {
    promise = promise.then(() => func(value))
  })
  return promise
}

pync.dict = (keys, func) => {
  let result = {}
  let promise = Promise.resolve()
  keys.forEach((key) => {
    promise = promise.then(() => func(key))
      .then((res) => {
        result[key] = res
      })
  })
  return promise.then(() => result)
}

pync.whilst = (test, func, initial) => {
  let next = (value) => Promise.resolve().then(() => func(value)).then((val) => test(val) ? next(val) : val)
  return next(initial)
}
