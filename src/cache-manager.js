import getCache from 'lru-cache'
import debug from 'debug'
import _ from 'lodash'

const dbg = debug('app:helpr:cache-manager')

// eslint-disable-next-line import/prefer-default-export
export async function getCacheManager(opts) {
  const cacheManager = {}
  // eslint-disable-next-line guard-for-in
  for (const key in opts) {
    cacheManager[key] = await _createCache(opts[key])
  }

  return {
    createCache: async ({key, opts}) => {
      cacheManager[key] = await _createCache(opts)
    },
    get: key => cacheManager[key]
  }
}

async function _createCache(opts) {
  dbg('init: opts=%j', opts)
  let hits = 0
  let misses = 0
  let missing = 0
  const cache = getCache(opts)
  opts.init && await opts.init(cache)

  return {
    stats: () => {
      return {hits, misses, missing, items: cache.itemCount}
    },
    get: async key => {
      let val = cache.get(key)
      if (val) {
        hits++
      } else {
        misses++
        val = opts.get && await opts.get(key)
        if (val) {
          cache.set(key, val)
        } else {
          missing++
        }
      }
      return val
    },
    set: ({key, value}) => cache.set(key, value),
    has: key => cache.has(key),
    del: key => cache.del(key),
    reset: () => cache.reset(),
    _cache: cache
  }
}
