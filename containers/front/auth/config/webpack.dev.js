const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const devConfig = {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    port: 8082,
    historyApiFallback: {
      index: 'index.html',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      // We will be using this name in the Container app
      name: 'auth',
      // This file is a kind of manifest with all the files we need
      // and routs to them
      filename: 'remoteEntry.js',
      // We are exporting { mount } function from './src/bootstrap' file
      // And will be using it in the Container app
      // in 'container/src/components/MarketingApp.js' file
      // to create custom html tag <Marketing /> inside Container's 'App.js'
      exposes: {
        './AuthApp': './src/bootstrap',
      },
      // We share dependencies across all our modules
      shared: packageJson.dependencies,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
