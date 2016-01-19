var webpack = require('webpack');
module.exports = {
	entry: "./pedometer.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
  plugins: [
  ],
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
      { test: /\.js$/, exclude: /node_modules/, loaders: ["babel-loader"]}
		]
	}
};
