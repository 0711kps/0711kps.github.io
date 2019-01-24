const { rangeIn, calcNextPos, positionConflict } = require('../asset/mylib.js')
const { deepStrictEqual, strictEqual } = require('assert')

// rangeIn
deepStrictEqual(rangeIn(-2, 1), [-2, -1, 0, 1], 'rangeIn not returning array of numbers between min and max')

// calcNextpos
let positionArray = [
  { x: 0, y: 0 },
  { x: 1, y: 0 }
]
deepStrictEqual(Object.keys(calcNextPos(positionArray)), ['x', 'y']
  , 'return value should be in {x: number, y: number} format')
strictEqual(Object.values(calcNextPos(positionArray))
  .every(v => (typeof v === 'number')), true)

// positionConflict
let newPosition = { x: 0, y: 0 }
strictEqual(positionConflict(positionArray, newPosition), true)

console.log('all good!')
