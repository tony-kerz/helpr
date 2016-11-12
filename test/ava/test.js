import test from 'ava'
import debug from 'debug'
import {
  isZip5,
  isZip,
  isNumber,
  isFloat,
  containsChar,
  isEmpty,
  isBoolean,
  parseBoolean,
  getKey,
  getKeyArray,
  compress,
  decompress,
  COMPRESSION
} from '../../src'

const dbg = debug('app:helpr')

test('isZip5', t => {
  t.true(isZip5('12345'))
  t.false(isZip5('123456'))
  t.false(isZip('foo'))
})

test('isZip', t => {
  t.true(isZip('12345'))
  t.true(isZip('123451234'))
  t.false(isZip('foo'))
})

test('isNumber', t => {
  t.true(isNumber('1'))
  t.true(isNumber('1.1'))
  t.true(isNumber('0'))
  t.true(isNumber(0))
  t.false(isNumber(''))
  t.false(isNumber(' '))
  t.false(isNumber('foo'))
  t.false(isNumber(null))
  t.false(isNumber(undefined))
})

test('isFloat', t => {
  t.true(isFloat('1.1'))
  t.false(isFloat('1'))
  t.false(isFloat('0'))
  t.false(isFloat(0))
  t.false(isFloat(''))
  t.false(isFloat(' '))
  t.false(isFloat('foo'))
  t.false(isFloat(null))
  t.false(isFloat(undefined))
})

test('containsChar', t => {
  t.true(containsChar('a.b', '.'))
  t.true(containsChar('.', '.'))
  t.false(containsChar('foo', '.'))
  t.false(containsChar(0, '.'))
})

test('isEmpty', t => {
  t.true(isEmpty(''))
  t.true(isEmpty(' '))
  t.true(isEmpty(null))
  t.true(isEmpty(undefined))
  t.false(isEmpty(0))
  t.false(isEmpty('foo'))
})

test('isBoolean', t => {
  t.true(isBoolean('true'))
  t.true(isBoolean('false'))
  t.true(isBoolean(true))
  t.true(isBoolean(false))
  t.false(isBoolean('0'))
  t.false(isBoolean(0))
  t.false(isBoolean(''))
  t.false(isBoolean(' '))
  t.false(isBoolean('foo'))
  t.false(isBoolean(null))
  t.false(isBoolean(undefined))
})

test('parseBoolean', t => {
  t.true(parseBoolean('true'))
  t.true(parseBoolean(true))
  t.false(parseBoolean('false'))
  t.false(parseBoolean(false))
  t.false(parseBoolean('0'))
  t.false(parseBoolean(0))
  t.false(parseBoolean(1))
  t.false(parseBoolean(''))
  t.false(parseBoolean(' '))
  t.false(parseBoolean('foo'))
  t.false(parseBoolean(null))
  t.false(parseBoolean(undefined))
})

test('getKey', (t)=>{
  t.truthy(getKey('foo', 'bar'), 'foo:bar')
})

test('getKeyArray', t => {
  t.deepEqual(getKeyArray('foo'), ['foo'])
  t.deepEqual(getKeyArray('foo', 'bar'), ['foo', ':', 'bar'])
  t.deepEqual(getKeyArray('foo', ['bar']), ['foo', ':', 'bar'])
  t.deepEqual(getKeyArray(['foo'], 'bar'), ['foo', ':', 'bar'])
  t.deepEqual(getKeyArray(['foo', 'bar']), ['foo', ':', 'bar'])
  t.deepEqual(getKeyArray(['foo', ['bar', ':', 'baz']]), ['foo', ':', 'bar', ':', 'baz'])
  t.deepEqual(getKeyArray([['foo', ':', 'bar'], 'baz']), ['foo', ':', 'bar', ':', 'baz'])
})

test('compress', t => {
  const s = '1:1245208719:2668376872:87 MURRAY GUARD DR:JACKSON:TN:383053775'
  const _s = compress(s)
  dbg('compress: uncompressed=[%s]', s)
  dbg('compress: encoding=%s', COMPRESSION)
  dbg('compress: compressed=[%s]', _s)
  dbg(
    'compress: uncompressed-length=%o, compressed-length=%o, ratio=%o',
    s.length, _s.length, _s.length/s.length
  )
  t.is(s, decompress(_s))
})
