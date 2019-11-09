const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path"); 
const FlowtypePlugin = require('flowtype-loader/plugin');

module.exports = {
  entry: {
    main: './src/example/index.js'
  },
  optimization: {
     minimize: false
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'react-resizable-textarea.js',
    library: 'ResizableTextArea',
    libraryTarget: 'umd'
  },
  // devServer: {
  //   contentBase: path.join(__dirname, 'src/example'),
  //   historyApiFallback: {
  //     index: 'src/example/index.html'
  //   },
  //   compress: true,
  //   port: 3000
  // },
  devServer: { port: 3000 },
  module: {
    rules: [
      {
          test: /\.js(x?)$/,
          loader: "flowtype-loader",
          exclude: /node_modules/,
          enforce: "pre"
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: "pre"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new FlowtypePlugin(),
    new HtmlWebPackPlugin({
      template: "./src/example/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};