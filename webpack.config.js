const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const webpackConfig = {
  mode: "none",
  entry: {},
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
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
        test: /\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [path.resolve("./src"), path.resolve("./node_modules")],
  },
  plugins: [],
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
});

module.exports = webpackConfig;
