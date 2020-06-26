const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  
  entry: {
    index: './src/index.js',
    sw: './src/sw/sw.js',
  },

  devtool: 'inline-source-map',

  devServer: {
    port: 8080,
  },

  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
    }
  },

  module: {
    rules: [
      // Images
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'img/',
            useRelativePath: true,
          },
        },
      },

      // Babel
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/transform-runtime'],
            ],
          },
        },
      },

      // CSS
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },

      // Sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },

      // Handlebars
      {
        test: /\.hbs$/,
        use: 'text-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      chunks: ['index', 'sw'],
      filename: 'index.html',
    }),
  ],

}