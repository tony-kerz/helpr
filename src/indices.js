import assert from 'assert'
import _ from 'lodash'

// eslint-disable-next-line import/prefer-default-export
export function findDeepIndices({array, path, predicate}) {
  assert(_.isArray(array), 'array required')
  assert(_.isArray(path), 'path array required')
  if (path.length > 0) {
    const result = _.transform(
      array,
      (result, val, index) => {
        const childArray = _.get(val, path[0])
        if (_.isArray(childArray)) {
          const childIndices = findDeepIndices({array: childArray, path: path.slice(1), predicate})
          if (childIndices) {
            result.push(index)
            result.push(...childIndices)
            return false
          }
        }
      }
    )
    return _.isEmpty(result) ? null : result
  }
  const index = _.findIndex(array, predicate)
  return (index < 0) ? null : [index]
}
