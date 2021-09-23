const WebpackUserscript = require("webpack-userscript");
const UserscriptOptions = require("./osnova_dark_theme.userscript-options.js");

/** @type {import("webpack").Configuration} */
module.exports = {
	entry: UserscriptOptions.entry,
	output: {
		filename: UserscriptOptions.filename,
		path: UserscriptOptions.path,
	},
	plugins: [
		new WebpackUserscript({
			metajs: false,
			pretty: true,
			renameExt: false,
			headers: UserscriptOptions.headers
		})
	],
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"@babel/preset-env",
								{
									targets: {
										"chrome": "58"
									}
								}
							]
						]
					}
				}
			}
		]
	},
	watch: true,
	mode: "production"
};
