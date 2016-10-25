/* global describe it */
'use strict'

const assert = require('assert')
const pync = require('../')

var status = null
var iterations = 0
const arr = [0, 1, 2, 3]
const timeout = (value, i) => {
  assert.equal(iterations, i)
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
    return pync.series(arr, (value, i) => timeout(value, i))
      .then(() => assert.equal(iterations, arr.length))
  })

  it('#map', () => {
    status = null
    iterations = 0
    return pync.map(arr, (value, i) => timeout(value, i))
      .then((results) => {
        assert.equal(iterations, arr.length)
        assert.deepEqual(results, arr.map((value) => `result ${value}`))
      })
  })

  it('#series with empty array', () => {
    status = null
    iterations = 0
    return pync.series([], (value, i) => timeout(value, i))
      .then(() => assert.equal(iterations, 0))
  })

  it('#map with empty array', () => {
    status = null
    iterations = 0
    return pync.map([], (value, i) => timeout(value, i))
      .then((results) => {
        assert.deepEqual(results, [])
        assert.equal(iterations, 0)
      })
  })

  it('#dict', () => {
    iterations = 0
    return pync.dict(['foo', 'bar'], (value, i) => {
      assert.equal(i, iterations++)
      return value + value
    })
      .then((results) => {
        assert.deepEqual(results, {
          foo: 'foofoo',
          bar: 'barbar'
        })
      })
  })

  it('#whilst', function () {
    this.timeout(10000)
    var n = 0
    var max = 10 // Test it with 1,000,000
    iterations = 0
    var initialValue = []
    const test = (val) => {
      assert.equal(val, initialValue)
      return ++n < max
    }
    const func = (val, i) => {
      assert.equal(i, iterations)
      assert.equal(val, initialValue)
      iterations++
      return val
    }
    return pync.whilst(test, func, initialValue)
      .then((val) => {
        assert.equal(val, initialValue)
        assert.equal(iterations, max)
      })
  })
})
