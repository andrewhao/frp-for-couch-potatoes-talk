var webpack = require('webpack');
module.exports = {
	entry: {
    'example-1': "./pedometer-example-1.js",
    'example-2': "./pedometer-example-2.js",
    'example-mouse-accel': "./pedometer-example-mouse-accel.js"
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
