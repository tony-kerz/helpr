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
  delete process.env[defaultName(key)]
}

export function setArgDefault({key, value}) {
  process.env[defaultName(key)] = value
}

function defaultName(key) {
  return `${defaultPrefix}${key}`
}

export function getArg(name, {dflt} = {}) {
  assert(name, 'name required')
  const arg = argv[name]
  const env = process.env[defaultName(name)]
  dbg('get-arg: name=%o, arg=%o, env=%o, dflt=%o', name, arg, env, dflt)
  return arg || env || dflt
}

export function getJsonArg(name, {dflt = {}} = {}) {
  const arg = getArg(name)
  return arg ? JSON.parse(arg) : dflt
}
