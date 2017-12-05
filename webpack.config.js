
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Path = require('path'); 

module.exports = {
  entry: {
      // OutputName: InputName 
      'main': ['./src/core/main.js'],
      'bundle': ['./src/render/main.js']
  },
  output: {
      path: Path.join( __dirname, 'build' ), // 要匯出的資料夾路徑
      publicPath: '/build',
      filename: '[name].js' // name = entry裡面的key
  },
  plugins: [
      // 複製 html 資料夾到 {output}/html/
      new CopyWebpackPlugin([
        { from: Path.join( __dirname, 'src/render/html' ), to: 'html' }
      ])
  ],
  target: 'electron', // target預設值是web，要設為Electron，webpack會為Electron提供編譯環境
  module: {
      rules: [
          {
              // 用Babel打包React ES2017語法
              test: /\.(js|jsx)?$/,
              loader: 'babel-loader',
              options: {
                  presets: [ 'react', 'es2017', 'stage-0' ]
              }
          }
      ]
  },
  resolve: {
    // 設定後 import或require 路徑只需要給檔名而不用加副檔名
    extensions: [ '.js', '.jsx' ] 
  }
}