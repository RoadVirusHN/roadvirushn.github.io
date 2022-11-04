const path = require("path");

module.exports = {
  mode: "production",
  watch: true,
  entry: {
    common: "./assets/js/common/index.js",
    lunr: "./assets/js/lunr/index.js",
    obsidian: "./assets/js/obsidian/index.js",
    search: "./assets/js/search/index.js",
  },
  output: {
    filename: "[name]/[name].bundle.js",
    path: path.resolve(__dirname, "assets/js"),
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
