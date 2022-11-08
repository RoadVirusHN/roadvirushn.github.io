const path = require("path");

module.exports = {
  mode: "production",
  watch: true,
  watchOptions: {
    ignored: "./_data/",
  },
  entry: {
    common: "./dist/js/common/index.js",
    lunr: "./dist/js/lunr/index.js",
    obsidian: "./dist/js/obsidian/index.js",
    search: "./dist/js/search/index.js",
  },
  output: {
    filename: "bundle/[name].bundle.js",
    path: path.resolve(__dirname, "dist/js"),
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
