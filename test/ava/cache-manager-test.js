import test from 'ava'
import _ from 'lodash'
import {getCacheManager} from '../../src'

test('cacheManager', async t => {
  const key = 'thing1'
  const cacheManager = await getCacheManager(
    {
      [key]: {
        max: 1,
        init: cache => {
          t.truthy(cache)
          cache.set('thing1.1', {hello: 'world'})
        },
        get: key => {
          return _.isString(key) && {hello: key}
        }
      }
    }
  )
  t.truthy(cacheManager)
  const cache = cacheManager.get(key)
  t.truthy(cache)
  t.deepEqual(cache.stats(), {key, hits: 0, misses: 0, missing: 0, items: 1})
  t.deepEqual(await cache.get('thing1.1'), {hello: 'world'})
  t.deepEqual(await cache.get('thing1.2'), {hello: 'thing1.2'})
  t.falsy(await cache.get(1))
  t.deepEqual(cache.stats(), {key, hits: 1, misses: 2, missing: 1, items: 1})
})

test('cacheManager: change', async t => {
  const cacheManager = await getCacheManager({thing1: {max: 1}})
  t.truthy(cacheManager)
  const cache = cacheManager.get('thing1')
  t.truthy(cache)
  cache.set({key: 'thing1.1', value: {foo: 'bar'}})
  const thing = await cache.get('thing1.1')
  t.truthy(thing)
  thing.foo = 'baz'
  const _thing = await cache.get('thing1.1')
  t.truthy(_thing)
  t.deepEqual(_thing, {foo: 'baz'})
})

test('cacheManager: null', async t => {
  const cacheManager = await getCacheManager({thing1: {}})
  t.truthy(cacheManager)
  const cache = cacheManager.get('thing1')
  t.falsy(cache)
})
