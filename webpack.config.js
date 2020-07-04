const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const { PUSH_SENDER_KEY } = require('./src/script/const');

// Webpack config
const config = (_env, options) => {
  const isProd = options.mode == 'production';

  // Base config
  const base = {
    entry: {
      index: './src/index.js',
    },

    // Output to script folder in dist/
    output: {
      filename: 'script/[name].[contenthash].js',
      path: buildPath,
    },

    resolve: {
      alias: {
        handlebars: 'handlebars/dist/handlebars.min.js',
      },
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
              plugins: [['@babel/transform-runtime']],
            },
          },
        },

        // CSS
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },

        // Sass
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },

        // Handlebars
        {
          test: /\.hbs$/,
          use: 'text-loader',
        },
      ],
    },

    plugins: [
      // Clean Build path (dist)
      new CleanWebpackPlugin({ root: buildPath }),

      // Minify CSS
      // Output in css folder in dist/
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
      }),

      // Index HTML
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: true,
        favicon: './src/assets/icon/favicon.ico',
      }),

      // Web Manifest
      new WebpackPwaManifest({
        name: 'Football app',
        short_name: 'Football',
        description: 'Show football standings and match',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        gcm_sender_id: PUSH_SENDER_KEY,
        ios: true,
        icons: [
          {
            src: './src/assets/icon/icon.png',
            sizes: [120, 152, 167, 180, 1024],
            destination: path.join('icons', 'ios'),
            ios: true,
          },
          {
            src: './src/assets/icon/icon.png',
            size: 1024,
            destination: path.join('icons', 'ios'),
            ios: 'startup',
          },
          {
            src: './src/assets/icon/icon.png',
            sizes: [36, 48, 72, 96, 144, 192, 512],
            destination: path.join('icons', 'android'),
          },
          {
            src: './src/assets/icon/maskable.png',
            size: 1024,
            destination: path.join('icons', 'maskable'),
            purpose: 'maskable',
          },
        ],
      }),

      // Workbox
      new WorkboxPlugin.InjectManifest({
        swSrc: './src/sw/sw.js',
        swDest: 'sw.js',
      }),
    ],

    optimization: {
      minimize: true,

      // Split chunk
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )[1];

              // Npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },

      // Minify file
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: !isProd,
          test: /\.m?js$/,

          // Remove comments
          terserOptions: {
            output: {
              comments: false,
            },
          },

          // Remove license
          extractComments: false,
        }),
        new OptimizeCssAssetsPlugin({}),
      ],
    },
  };

  // Development config
  if (!isProd) {
    base.devtool = 'inline-source-map';
  }

  return base;
};

module.exports = config;
