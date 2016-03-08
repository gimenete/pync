/* global describe it */
'use strict'

const assert = require('assert')
const pync = require('../')

var status = null
var iterations = 0
const arr = [0, 1, 2, 3]
const timeout = (value) => {
  return new Promise((resolve, reject) => {
    if (value > 0) {
      assert.equal(status, `finishing ${value - 1}`)
    }
    status = `starting ${value}`
    setTimeout(() => {
      status = `finishing ${value}`
      iterations++
      resolve(`result ${value}`)
    }, 10)
  })
}

describe('Pync', () => {
  it('#series', () => {
    status = null
    iterations = 0
    return pync.series(arr, (value) => timeout(value))
      .then(() => assert.equal(iterations, arr.length))
  })

  it('#map', () => {
    status = null
    iterations = 0
    return pync.map(arr, (value) => timeout(value))
      .then((results) => {
        assert.equal(iterations, arr.length)
        assert.deepEqual(results, arr.map((value) => `result ${value}`))
      })
  })

  it('#series with empty array', () => {
    status = null
    iterations = 0
    return pync.series([], (value) => timeout(value))
      .then(() => assert.equal(iterations, 0))
  })

  it('#map with empty array', () => {
    status = null
    iterations = 0
    return pync.map([], (value) => timeout(value))
      .then((results) => {
        assert.deepEqual(results, [])
        assert.equal(iterations, 0)
      })
  })

  it('#dict', () => {
    return pync.dict(['foo', 'bar'], (value) => value + value)
      .then((results) => {
        assert.deepEqual(results, {
          foo: 'foofoo',
          bar: 'barbar'
        })
      })
  })
})
