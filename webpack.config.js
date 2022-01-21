const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './examples/ClientRoot.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    static: path.join(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    /* Fallback for server side stuff. */
    //fallback: { os: false, http: false, https: false, zlib: false, path: false, fs: false, util: false, buffer: false }
    alias: { 'react-dom': '@hot-loader/react-dom' }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          //loader: 'babel-loader'
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|jpeg|eot|woff|woff2|ttf|svg|ico|txt)$/,
        use: {
          loader: 'file-loader',
          options: {
            emitFile: true,
            //name: '[1]?[hash]',
            esModule: false
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true
    }),
    new HtmlWebpackPlugin({
      title: 'Development'
    })
  ]
};
