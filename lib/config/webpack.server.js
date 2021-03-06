const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const createBaseConfig = require('./webpack.base')

module.exports = function(options, env, helpers) {
  return merge(createBaseConfig(options, 'node', env, helpers), {
    entry: require.resolve('../entry'),
    // Do not minify compiled SSR bundle.
    mode: 'none',

    output: {
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      libraryExport: 'default',
      path: helpers.resolveRootFile('.'),
    },

    resolve: {
      alias: {
        entrypoint: helpers.resolveSrcFile('entry-server'),
      },
    },

    externals: [
      nodeExternals({
        // Load non-JavaScript files with extensions, presumably via loaders
        whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      }),
    ],

    // We want to uphold node's __filename, and __dirname.
    node: {console: true, __filename: true, __dirname: true},

    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(css|s[ac]ss)$/,
              use: {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  })
}
