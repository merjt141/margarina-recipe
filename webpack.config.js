const path = require('path'); // Add this line to require the path module
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './control/src/scripts/app.ts',
  output: {
    filename: 'jys-recipe-app.js',
    path: path.resolve(__dirname, 'control/dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })],
  },
  plugins: [
    new UglifyJsPlugin(),
  ],
};