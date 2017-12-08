const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = [{
	entry: {
		index: './src/js/index.js'
	},
	output: {
		path: path.join(__dirname, '/public'),
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.tag$/,
			enforce: 'pre',
			exclude: /node_modules/,
			loader: 'tag-pug-loader'
		},{
			test: /\.js|\.tag$/,
			enforce: 'post',
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				query: {
					presets: ['es2015-riot']
				}
			}
		}]
	},
	resolve: {
		extensions: ['.js', '.tag']
	},
	plugins: [
	]
}, {
	entry: {
		app: './src/node/app.js'
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				query: {
					presets: ['es2015-node6', 'stage-2']
				}
			}
		}]
	},
	resolve: {
		extensions: ['.js']
	},
	target: 'node',
	externals: [
		nodeExternals()
	]
}]