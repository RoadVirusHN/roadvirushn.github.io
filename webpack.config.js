const path = require("path");

module.exports = {
  mode: "production",
  watch: true,
  watchOptions: {
    ignored: "./_data/",
  },
  entry: {
    common: "./assets/scripts/common/index.js",
    lunr: "./assets/scripts/lunr/index.js",
    obsidian: "./assets/scripts/obsidian/index.js",
    search: "./assets/scripts/search/index.js",
  },
  output: {
    filename: "bundle/[name].bundle.js",
    path: path.resolve(__dirname, "assets/scripts"),
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
