import test from 'ava'
import _ from 'lodash'
import {combine} from '../../src'

function plus(a, b) {
  return a + b
}
test('combine: basic', t => {
  const o = {a: 1, b: 2, c: 3}
  t.deepEqual(combine({first: o, second: o, operator: plus}), {a: 2, b: 4, c: 6})
})

test('combine: more in first', t => {
  const o = {a: 1, b: 2, c: 3}
  t.deepEqual(combine({first: {b: 2}, second: o, operator: plus}), {a: 1, b: 4, c: 3})
})

test('combine: more in second', t => {
  const o = {a: 1, b: 2, c: 3}
  t.deepEqual(combine({first: o, second: {b: 2}, operator: plus}), {a: 1, b: 4, c: 3})
})
