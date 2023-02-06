const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// https://webpack.js.org/configuration/configuration-types/
module.exports = function (env, argv) {
  return {
    target: "web",
    mode: env.production ? "production" : "development",
    entry: {
      index: "./src/index.tsx",
    },
    devtool: env.production ? undefined : "inline-source-map",
    output: {
      filename: `js/${env.production ? "[contenthash]" : "[name]"}.js`,
      chunkFilename: `js/${env.production ? "[contenthash].js" : "[name]"}.js"`,
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: "assets/[hash][ext][query]",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      modules: [path.resolve("./src"), "node_modules"],
    },
    optimization: {
      moduleIds: "deterministic",
      //runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: { 
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              envName: env.production ? "production" : "development"
            }
          }
        },
        {
          test: /\.(s*)css$/i,
          use: [
            env.production ? MiniCssExtractPlugin.loader : "style-loader",
            { loader: "css-loader", options: { importLoaders: 1 } },
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
        //title: "TITLE HERE"
      }),
      // new DotenvWebpackPlugin()
    ].concat(
      env.production
        ? [
            new MiniCssExtractPlugin({
              filename: "styles/[name].[contenthash].css",
              chunkFilename: "styles/[name].[contenthash].css",
            }),
            new BundleAnalyzerPlugin({
              reportFilename: path.resolve(__dirname, "../reports/bundle-analyzer/index.html"),
              analyzerMode: "static",
              openAnalyzer: false,
            }),
          ]
        : []
    ),
  };
};
