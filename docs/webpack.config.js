const path = require("path");

module.exports = {
  mode: "production",
  watch: true,
  entry: "./assets/js",
  output: {
    library: "toggleCard",
    libraryTarget: "window",
    libraryExport: "default",
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "assets"),
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "bower_components"),
        ],
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".json", ".js", ".jsx"],
  },
};
