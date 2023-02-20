const { resolve } = require('path');
const { DefinePlugin } = require('webpack');
const WebpackUserscriptPlugin = require('@serguun42/webpack-userscript-plugin');

const PACKAGE = require('./package.json');
const USERSCRIPT_HEADERS = require('./src/config/userscript.json');
const { RESOURCES_ROOT } = require('./src/config/sites.js');

const VERSION = process.env.npm_package_version || PACKAGE.version;
const PRODUCTION = process.argv[process.argv.indexOf('--env') + 1] !== 'development';
const BUILD_DATE = new Date().toISOString().split('T')[0];

process.env.NODE_ENV = PRODUCTION ? 'production' : 'development';

if (PRODUCTION) {
  USERSCRIPT_HEADERS.version = `${VERSION} (${BUILD_DATE})`;
  USERSCRIPT_HEADERS.updateURL = `${RESOURCES_ROOT}osnova-dark-theme.meta.js`;
  USERSCRIPT_HEADERS.downloadURL = `${RESOURCES_ROOT}osnova-dark-theme.user.js`;
} else {
  USERSCRIPT_HEADERS.name += ' (DEV)';
  USERSCRIPT_HEADERS.version = VERSION;
  delete USERSCRIPT_HEADERS.downloadURL;
  delete USERSCRIPT_HEADERS.updateURL;
}

const envForUserscript = {
  NODE_ENV: process.env.NODE_ENV,
  VERSION,
};

/** @type {import('webpack').WebpackPluginInstance[]} */
const plugins = [
  new DefinePlugin({ 'process.env': JSON.stringify(envForUserscript) }),
  new WebpackUserscriptPlugin({
    headers: USERSCRIPT_HEADERS,
    metajs: PRODUCTION,
  }),
];

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: resolve('src', 'core.js'),
  output: {
    filename: 'osnova-dark-theme.user.js',
    path: resolve(PRODUCTION ? 'build' : 'dev'),
  },
  plugins,
  module: {
    rules: [
      PRODUCTION
        ? {
            test: /\.[cm]?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        chrome: '58',
                      },
                    },
                  ],
                ],
              },
            },
          }
        : {},
    ],
  },
  watch: !PRODUCTION,
  mode: PRODUCTION ? 'production' : 'development',
};
