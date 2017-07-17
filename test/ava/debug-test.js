import test from 'ava'
import debug from 'debug'

const dbg = debug('test:helpr:debug')

test('debug', t => {
  dbg('hello world')
  dbg('goodbye world')
  t.pass('pass!')
})
