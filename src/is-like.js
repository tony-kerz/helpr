import _ from 'lodash'

const assertRe = /^assert\((.+)\)$/

export const isLikeHooks = {
  assert: {
    shouldTrigger: ({expected}) => assertRe.test(expected),
    // eslint-disable-next-line no-unused-vars
    isLike: ({expected, actual}) => {
      const match = assertRe.exec(expected)
      // eslint-disable-next-line no-eval
      return match[1] && eval(match[1])
    }
  }
}

export function isLike({expected, actual, hooks}) {
  if (_.isArray(expected)) {
    return isArrayLike({expected, actual, hooks})
  }

  if (_.isObject(expected)) {
    return isObjectLike({expected, actual, hooks})
  }

  if (hooks) {
    const hook = _.find(hooks, elt => elt.shouldTrigger({expected, actual}))
    if (hook) {
      return hook.isLike({expected, actual})
    }
  }

  return expected === actual
}

function isArrayLike({expected, actual, hooks}) {
  return (
    _.isArray(actual) &&
    (expected.length === actual.length) &&
    _.every(expected, (elt, index) => {
      return isLike({expected: elt, actual: actual[index], hooks})
    })
  )
}

function isObjectLike({expected, actual, hooks}) {
  return (
    _.isObject(actual) &&
    _.every(expected, (elt, key) => {
      return isLike({expected: elt, actual: actual[key], hooks})
    })
  )
}
