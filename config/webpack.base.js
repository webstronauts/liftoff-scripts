const path = require('path')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const webpack = require('webpack')
const paths = require('./paths')

module.exports = function (target = 'web', env = 'development') {
  const config = {
    // Use Laravel's default assets directory as webpack's context.
    context: paths.assetsPath,
    // Specify mode (either 'development' or 'production')
    mode: env,
    // Specify target (either 'node' or 'web')
    target,

    output: {
      path: paths.appPublic,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].bundle.js',
    },

    resolve: {
      // We need to tell webpack how to resolve both our node_modules and
      // the users', so we use resolve and resolveLoader.
      modules: ['node_modules', paths.appNodeModules],
      extensions: ['.js', '.jsx', '.json', '.graphql', '.gql', '.scss', '.sass', '.css']
    },

    resolveLoader: {
      modules: [paths.appNodeModules, paths.ownNodeModules],
    },

    module: {
      // Makes missing exports an error instead of warning
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              // Process application JS with Babel.
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: true,
                  cacheDirectory: true,
                  // Move this to a separate package
                  presets: [
                    [require.resolve('@babel/preset-env'), {
                      'modules': false
                    }],
                    require.resolve('@babel/preset-react'),
                    require.resolve('@babel/preset-stage-2')
                  ]
                }
              }
            },

            {
              // Process any JS outside of the app with Babel.
              // Unlike the application JS, we only compile the standard ES features.
              test: /\.js$/,
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  cacheDirectory: true,
                  highlightCode: true,
                  compact: false,
                  presets: [
                    [require.resolve('@babel/preset-env'), {
                      modules: false
                    }]
                  ]
                }
              }
            },

            {
              test: /\.css$/,
              loader: ExtractTextPlugin.extract({
                fallback: require.resolve('style-loader'),
                use: [
                  {
                    loader: require.resolve('css-loader'),
                    options: {
                      importLoaders: 1,
                      minimize: true
                    }
                  },
                  {
                    loader: require.resolve('postcss-loader'),
                    options: {
                      ident: 'postcss',
                      sourceMap: true
                    }
                  }
                ]
              })
            }
          ]
        }
      ]
    },

    plugins: [
      new CaseSensitivePathsPlugin(),

      new ExtractTextPlugin({
        filename: env === 'production' ? 'css/bundle.[chunkhash:8].css' : 'css/bundle.css'
      }),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  }

  if (env === 'production') {
    config.output.filename = 'js/bundle.[chunkhash:8].js'
    config.output.chunkFilename = 'js/[name].[chunkhash:8].bundle.js'
  }

  if (env === 'development') {
    config.watch = true
    config.watchOptions = {
      ignored: /node_modules/
    }

    /* config.plugins.push(
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      new WatchMissingNodeModulesPlugin(paths.appNodeModules)
    ) */
  }

  return config
}
