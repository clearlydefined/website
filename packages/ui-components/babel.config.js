module.exports = api => {
  api.cache(false)
  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/plugin-proposal-class-properties']
  }
}
