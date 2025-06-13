module.exports = {
  presets: [
    ['@babel/preset-env']
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      corejs: false,
      helpers: true
    }]
  ]
};
