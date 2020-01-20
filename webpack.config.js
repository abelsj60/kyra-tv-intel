const path = require('path');

module.exports = () => {
  return {
    entry: [ './src/index.js' ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    resolve: {
      extensions: [ '.js', '.jsx' ]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  };
};
