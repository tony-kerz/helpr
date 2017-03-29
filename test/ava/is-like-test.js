import test from 'ava'
import {isLike, isLikeHooks} from '../../src'

test('isLike: identical objects', t => {
  const expected = {a: 1}
  const actual = expected
  t.true(isLike({expected, actual}))
})

test('isLike: actual object has extra keys', t => {
  const expected = {a: 1}
  const actual = Object.assign({}, expected, {b: 2})
  t.true(isLike({expected, actual}))
})

test('isLike: actual object is missing key', t => {
  const expected = {a: 1}
  const actual = {b: 1}
  t.false(isLike({expected, actual}))
})

test('isLike: actual object value is not identical', t => {
  const expected = {a: 1}
  const actual = {a: '1'}
  t.false(isLike({expected, actual}))
})

test('isLike: identical nested objects', t => {
  const expected = {a: {b: 1}}
  const actual = expected
  t.true(isLike({expected, actual}))
})

test('isLike: identical arrays', t => {
  const expected = [{a: 1}]
  const actual = expected
  t.true(isLike({expected, actual}))
})

test('isLike: actual array has more values', t => {
  const expected = [{a: 1}]
  const actual = [...expected, {b: 2}]
  t.false(isLike({expected, actual}))
})

test('isLike: expected array has more values', t => {
  const actual = [{a: 1}]
  const expected = [{b: 2}]
  t.false(isLike({expected, actual}))
})

test('isLike: expected assert basic', t => {
  // console.log('hooks=%o', hooks)
  const actual = [{a: 1}]
  const expected = [{a: 'assert(actual == 1)'}]
  t.true(isLike({expected, actual, hooks: [isLikeHooks.assert]}))
})

test('isLike: expected assert type', t => {
  const actual = [{a: new Date()}]
  const expected = [{a: 'assert(actual.constructor.name == "Date")'}]
  t.true(isLike({expected, actual, hooks: [isLikeHooks.assert]}))
})
