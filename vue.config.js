const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin(), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)]
  }
};
