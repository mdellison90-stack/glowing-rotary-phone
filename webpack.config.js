const path = require('path');

module.exports = {
  target: 'electron-main',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: {
    electron: 'commonjs2 electron'
  }
};
