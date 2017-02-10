import assert from 'assert'
import debug from 'debug'
import _ from 'lodash'
import minimist from 'minimist'

const dbg = debug('app:helpr:args')
const defaultPrefix = '__default__'
const argv = minimist(process.argv.slice(2))

export function clearArgDefaults() {
  _.each(process.env, (val, key) => {
    if (key.startsWith(defaultPrefix)) {
      delete process.env[key]
    }
  })
}

export function getArgDefaults() {
  return _.filter(process.env, (val, key) => key.startsWith(defaultPrefix))
}

export function clearArgDefault(key) {
  delete process.env[defaultKey(key)]
}

export function setArgDefault({key, value}) {
  process.env[defaultKey(key)] = value
}

function defaultKey(key) {
  return `${defaultPrefix}${key}`
}

export function getArg(key, {dflt} = {}) {
  assert(key, 'key required')
  const arg = argv[key]
  const env = process.env[defaultKey(key)]
  dbg('get-arg: key=%o, arg=%o, env=%o, dflt=%o', key, arg, env, dflt)
  return arg || env || dflt
}

export function getJsonArg(key, {dflt = {}} = {}) {
  const arg = getArg(key)
  return arg ? JSON.parse(arg) : dflt
}
