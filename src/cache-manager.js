import getCache from 'lru-cache'
import debug from 'debug'
import Timer from 'tymer'
import _ from 'lodash'

/* eslint-disable guard-for-in */

const dbg = debug('app:helpr:cache-manager')

// eslint-disable-next-line import/prefer-default-export
export async function getCacheManager(opts) {
  const cacheManager = {}
  for (const key in opts) {
    cacheManager[key] = await _createCache({key, opts: opts[key]})
  }

  return {
    createCache: async ({key, opts}) => {
      cacheManager[key] = await _createCache({key, opts})
    },
    get: key => cacheManager[key],
    reset: async () => {
      for (const key in cacheManager) {
        cacheManager[key] && await cacheManager[key].reset()
      }
    },
    cleanup: async () => {
      for (const key in cacheManager) {
        cacheManager[key] && await cacheManager[key].cleanup()
      }
    }
  }
}

async function _createCache({key, opts = {}}) {
  dbg('init: key=%o, opts=%j', key, opts)
  let hits = 0
  let misses = 0
  let missing = 0
  const evictPromises = []
  const timer = new Timer(`${key}-get`)

  if (opts.onEvict) {
    opts.dispose = (key, value) => {
      dbg('dispose: key=%o, value=%j', key, value)
      evictPromises.push(opts.onEvict({key, value}))
    }
  }

  const cache = opts.max && getCache(opts)
  opts.max && opts.init && await opts.init(cache)

  return cache && {
    name: () => key,
    stats: () => {
      return {key, hits, misses, missing, items: cache.itemCount}
    },
    get: async key => {
      let val = cache.get(key)
      if (val) {
        hits++
      } else {
        misses++
        if (opts.get) {
          timer.start()
          val = await opts.get(key)
          timer.stop()
        }
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
    reset: async () => {
      cache.reset()
      opts.init && await opts.init(cache)
    },
    timer: () => timer,
    isThresh: thresh => ((hits + misses) % thresh) === 0,
    cleanup: async () => {
      cache.reset()
      Promise.all(evictPromises)
    },
    _cache: cache
  }
}
