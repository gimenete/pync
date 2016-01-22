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
      results.splice(0, 1)
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
