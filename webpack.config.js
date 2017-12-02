const webpack = require('webpack')
const path = require('path')

module.exports = {
	entry: {
		index: './src/electron/js/index.js'
	},
	output: {
		path: path.join(__dirname, 'public/'),
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		}]
	},
	resolve: {
		extensions: ['.js']
	},
	plugins: [
	]
}