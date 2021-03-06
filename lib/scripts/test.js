// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const isCI = require('is-ci')
const jest = require('jest')
const {
  hasPkgProp,
  parseEnv,
  hasFile,
  resolveDirectoryArgs,
} = require('../utils')

const args = process.argv.slice(2)

const watch =
  !isCI &&
  !parseEnv('LIFTOFF_PRECOMMIT', false) &&
  !args.includes('--no-watch') &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : []

const dirs = resolveDirectoryArgs(args)

const config =
  !args.includes('--config') &&
  !hasFile('jest.config.js') &&
  !hasPkgProp('jest')
    ? ['--config', JSON.stringify(require('../config/jest')(dirs))]
    : []

jest.run([...config, ...watch, ...args])
