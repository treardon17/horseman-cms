let window
exports.onPreBootstrap = () => {
  window = window || {} // eslint-disable-line
}

exports.modifyWebpackConfig = ({ config, stage }) => {
  config.loader('eslint', {
    test: /\.js$/,
    exclude: /node_modules/,
  })
  return config
}
