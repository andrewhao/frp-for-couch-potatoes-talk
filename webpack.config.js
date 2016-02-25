var webpack = require('webpack');
module.exports = {
	entry: {
  },
	output: {
		path: __dirname,
		filename: "bundle.[name].js"
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
