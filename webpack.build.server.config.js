"use strict"

const path = require("path");
const fs = require("fs");

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: {
    AppShell: './src/client/Template/AppShell.js'
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    library: '',
    libraryTarget: "commonjs2"
  },
  target: 'node',
  resolve: {
    symlinks: false
  },
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /(\.js?$)|(\.jsx?$)/,
        use: 'babel-loader',
        // exclude: /node_modules/
      }
    ]
  },
  mode: 'development',
  devtool: 'inline-source-map'
}
