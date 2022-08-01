const webpack = require('webpack');
module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url"),
      "chownr": require.resolve("chownr"),
      "vm": require.resolve("vm-browserify"),
      "path": require.resolve("path-browserify"),
      "constants": require.resolve("constants-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "fs": false,
      "tls": false,
      "net": false,
      "dns": false,
      "child_process": false,
      "readline": false,
      "async_hooks": false,
      "module": false
  })
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
      })
  ])
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
}
