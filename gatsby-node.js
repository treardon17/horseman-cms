exports.modifyWebpackConfig = ({ config, stage }) => {
  config.loader('eslint', {
    test: /\.js$/,
    exclude: /node_modules/,
  })
  return config
}

exports.onPreBootstrap = () => {
  require('isomorphic-fetch') // eslint-disable-line
}
