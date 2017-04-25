import getCache from 'lru-cache'
import debug from 'debug'
import Timer from 'tymer'
import _ from 'lodash'

const dbg = debug('app:helpr:cache-manager')

// eslint-disable-next-line import/prefer-default-export
export async function getCacheManager(opts) {
  const cacheManager = {}
  // eslint-disable-next-line guard-for-in
  for (const key in opts) {
    cacheManager[key] = await _createCache({key, opts: opts[key]})
  }

  return {
    createCache: async ({key, opts}) => {
      cacheManager[key] = await _createCache({key, opts})
    },
    get: key => cacheManager[key]
  }
}

async function _createCache({key, opts = {}}) {
  dbg('init: key=%o, opts=%j', key, opts)
  let hits = 0
  let misses = 0
  let missing = 0
  const timer = new Timer(`${key}-get`)
  const cache = opts.max && getCache(opts)
  opts.max && opts.init && await opts.init(cache)

  return cache && {
    stats: () => {
      return {hits, misses, missing, items: cache.itemCount}
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
    reset: () => cache.reset(),
    timer: () => timer,
    isThresh: thresh => ((hits + misses) % thresh) === 0,
    _cache: cache
  }
}
