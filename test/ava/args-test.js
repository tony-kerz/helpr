import test from 'ava'
import _ from 'lodash'
import {setArgDefault, getArg, clearArgDefault, clearArgDefaults, getJsonArg} from '../../src'

test('setArgDefault', t => {
  const name = 'foo'
  let foo = getArg(name)
  t.falsy(foo)
  setArgDefault({key: name, value: 'bar'})
  foo = getArg(name)
  t.is(foo, 'bar')
  clearArgDefault(name)
  foo = getArg(name)
  t.falsy(foo)
})

test('clearArgDefaults', t => {
  const name = 'foo'
  let foo = getArg(name)
  t.falsy(foo)
  setArgDefault({key: name, value: 'bar'})
  foo = getArg(name)
  t.is(foo, 'bar')
  clearArgDefaults()
  foo = getArg(name)
  t.falsy(foo)
})

test('getJsonArg', t => {
  const name = 'foo'
  let foo = getJsonArg(name)
  t.deepEqual(foo, {})
  setArgDefault({key: name, value: '{"foo": "bar"}'})
  foo = getJsonArg(name)
  t.deepEqual(foo, {foo: 'bar'})
})
