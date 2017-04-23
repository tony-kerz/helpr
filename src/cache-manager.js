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
  const cache = getCache(opts.opts)
  opts.init && await opts.init(cache)

  return {
    stats: () => {
      return {hits, misses, missing}
    },
    get: async key => {
      let val = cache.get(key)
      if (val) {
        hits++
      } else {
        misses++
        val = await opts.get(key)
        if (!val) {
          missing++
        }
        cache.set(key, val)
      }
      return val
    },
    set: ({key, value}) => cache.set(key, value)
  }
}
