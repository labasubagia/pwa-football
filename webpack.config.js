const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const buildPath = path.resolve(__dirname, 'dist');

// Webpack config
const config = (_env, options) => {

  const isProd = options.mode == 'production';
  
  // Base config
  const base = {

    entry: {
      index: './src/index.js',
      sw: './src/sw/sw.js',
    },
  
    output: {
      filename: '[name].js',
      path: buildPath,
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
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
  
        // Sass
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
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
      new CleanWebpackPlugin({ root: buildPath }),
      new MiniCssExtractPlugin(),

      // Index HTML
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: true,
        chunks: ['index', 'sw'],
        filename: 'index.html',
        favicon: './src/assets/icon/favicon.ico',
      }),

      // Web Manifest
      new WebpackPwaManifest({
        name: 'Football app',
        short_name: 'Football',
        description: 'Show football standings and match',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: './src/assets/icon/icon.png',
            sizes: [192, 512],
          },
        ],

        // Options
        filename: 'manifest.json',
        fingerprints: false,
      }),
    ],
  
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCssAssetsPlugin({}),
      ],
    },
  };

  // Development config
  if (!isProd) {
    base.devtool = 'source-map';
  }

  return base;
}

module.exports = config;