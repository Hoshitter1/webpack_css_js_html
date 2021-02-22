const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpackConfig = {
  entry: {},
  output: {
    path: __dirname + "/dist",
    filename: "assets/js/[name].js",
  },
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          name: "assets/img/[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    modules: [path.resolve("./src"), path.resolve("./node_modules")],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css", // CSS の出力先のファイル名 (static/dist/bundle.css に出力)
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(), // JavaScript の minify を行う
      new OptimizeCSSAssetsPlugin(), // CSS の minify を行う
    ],
  },
};

const allPureDirName = glob
  .sync("*/", { cwd: "src", ignore: ["components/"] })
  .map((dirWithSlash) => path.basename(dirWithSlash, "/"));

allPureDirName.forEach((dir) => {
  // bundle js for each page folder separately
  const jsFileFullPath = path.resolve("src", dir, "index.js");
  webpackConfig.entry[dir] = ["@babel/polyfill", jsFileFullPath];

  // add each js file to appropriate html
  // https://github.com/jantimon/html-webpack-plugin#options
  // You can also set meta tag here using an option
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve("src", dir, "index.html"),
      filename: dir + ".html",
      inject: "body",
      chunks: [dir],
    })
  );
  // webpackConfig.plugins.push(
  //   new MiniCssExtractPlugin({
  //     filename: dir + ".css", // CSS の出力先のファイル名 (static/dist/bundle.css に出力)
  //   })
  // );
});

module.exports = webpackConfig;
