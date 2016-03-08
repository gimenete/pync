'use strict'

var pync = module.exports = {}

pync.map = function (arr, func) {
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

pync.series = function (arr, func) {
  let promise = Promise.resolve()
  arr.forEach((value) => {
    promise = promise.then(() => func(value))
  })
  return promise
}

pync.dict = function (keys, func) {
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
