const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const server = 'http://localhost:8080/';

module.exports = {
	entry: {
		main: './src/public/index.js',
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: ['html-loader'],
			},
			{
				test: /\.(svg|png|jpg|gif)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'public/assets/images',
						// publicPath: server + 'public/assets/images',
						publicPath: path.join(__dirname,
							'dist/public/assets/images'),
					},
				},
			},
		],
	},
};
