// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  // Extend it as you need.

  // For example, add typescript loader:
  config.module.rules.push({
    test: /\.js?$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
    query: {
      presets: ['react', 'es2015', 'react-hmre'],
      plugins: ['transform-class-properties']
    }
  });



  return config;
};