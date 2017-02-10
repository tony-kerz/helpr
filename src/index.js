import zlib from 'zlib'
import assert from 'assert'
import diff from 'jsondiffpatch'
import fastStringify from 'fast-safe-stringify'
import _ from 'lodash'

const zip5Regex = /^\d{5}$/
const zipRegex = /^\d{5}(\d{4})?$/
const hexRegex = /^[0-9A-Fa-f]+$/
const isoDateRegex = /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/

export const SEPARATOR = ':'
export const COMPRESSION = 'base64'
export const VALIDATION_ERROR = 'ValidationError'
export const UNIQUENESS_ERROR = 'UniquenessError'

export function isHex(s) {
  return hexRegex.test(s)
}

export function isZip5(s) {
  return zip5Regex.test(s)
}

export function isZip(s) {
  return zipRegex.test(s)
}

export function isNumber(val) {
  return (val === 0) || (!isEmpty(val) && !isNaN(val))
}

export function isFloat(val) {
  return isNumber(val) && containsChar(val, '.')
}

export function isIsoDate(value) {
  return isoDateRegex.test(value)
}

export function containsChar(val, char) {
  return isSpecified(val) && val.toString().indexOf(char) !== -1
}

export function isEmpty(val) {
  return !isSpecified(val) || (val.toString().trim().length === 0)
}

export function isBoolean(val) {
  return isSpecified(val) && ['true', 'false'].includes(val.toString())
}

export function parseBoolean(val) {
  return isSpecified(val) && ['true'].includes(val.toString())
}

export function isSpecified(val) {
  return ![null, undefined].includes(val)
}

export function pretty(val) {
  return JSON.stringify(val, null, 2)
}

export function diffConsole({actual, expected}) {
  const delta = diff.diff(actual, expected)
  // eslint-disable-next-line no-console
  console.log('diff output:')
  diff.console.log(delta)
}

export function stringify(s) {
  return fastStringify(s)
}

export function getKey(...fields) {
  return getKeyArray(...fields).join('')
}

export function getKeyArray(...fields) {
  return _.reduce(
    _.flatten(fields),
    (result, value) => {
      return result ? result.concat(_.flatten([SEPARATOR, value])) : _.flatten([value])
    },
    null
  )
}

export function sleep(s) {
  const e = new Date().getTime() + (s)
  while (new Date().getTime() <= e) {
    ; // eslint-disable-line no-extra-semi
  }
}

export function getType(value) {
  return value && value.constructor.name
}

export function getWithTypes(o) {
  return _.transform(
    o,
    (result, value, key) => {
      result[key] = {
        value,
        type: getType(value)
      }
    }
  )
}

// http://stackoverflow.com/a/4540443/2371903
export function xor(a, b) {
  return (!a !== !b)
}

export function compress(s, {compression = COMPRESSION} = {}) {
  return zlib.deflateSync(s).toString(compression)
}

export function decompress(s, {compression = COMPRESSION} = {}) {
  return zlib.inflateSync(Buffer.from(s, compression)).toString()
}

export function join(args, {separator = '.'} = {}) {
  return args ? _.pullAll(args, [null, undefined, '']).join(separator) : args
}

export function transformField({target, field, transformer}) {
  assert(transformer, 'transformer required')
  const value = transformer(_.get(target, field))
  return (!value || _.isEmpty(value)) ? _.omit(target, field) : _.set(target, field, value)
}

export function debugElements({dbg, msg, o}) {
  _.each(o, (val, key) => dbg(`${msg}[${key}]=${stringify(val)}`))
}

export async function resolveValues(o) {
  const map = new Map()
  _.each(o, (val, key) => {
    map.set(key, val)
  })
  const resolved = await Promise.all(map.values())
  return _.zipObject(Array.from(map.keys()), resolved)
}

export function isListed({list, key, value}) {
  return list && _.some(list, (elt, index, list) => {
    return (_.isString(elt) && (elt === key)) || (_.isFunction(elt) && elt({key, value, list}))
  })
}

export function parseValue(value) {
  if (value === 'null') {
    return null
  } else if (isBoolean(value)) {
    return parseBoolean(value)
  } else if (isFloat(value)) {
    return parseFloat(value)
  } else if (isNumber(value)) {
    return parseInt(value, 10)
  } else if (isIsoDate(value)) {
    return Date.parse(value)
  } else if (Array.isArray(value)) {
    return value.map(parseValue)
  }
  return value
}

export function combine({first = {}, second = {}, operator = _.identity}) {
  const result = _.transform(first, (result, val, key) => {
    if (_.has(second, key)) {
      result[key] = operator(val, second[key])
    } else {
      result[key] = val
    }
  })
  _.each(second, (val, key) => {
    if (!_.has(result, key)) {
      result[key] = val
    }
  })
  return result
}
