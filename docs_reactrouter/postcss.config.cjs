const path = require('node:path')

// Panda resolves `include`/`outdir` relative to `cwd`, which otherwise defaults
// to this folder instead of the repo root where panda.config.ts lives.
const rootDir = path.resolve(__dirname, '..')

module.exports = {
  plugins: {
    '@pandacss/dev/postcss': {
      cwd: rootDir,
      configPath: path.join(rootDir, 'panda.config.ts'),
    },
  },
}