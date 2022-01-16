const { DefinePlugin } = require("webpack");
const WebpackUserscript = require("webpack-userscript");
const UserscriptOptions = require("./src/userscript");
const PRODUCTION = (process.argv[process.argv.indexOf("--env") + 1] !== "development");

/** @type {import("webpack").Configuration} */
module.exports = {
	entry: UserscriptOptions.entry,
	output: {
		filename: UserscriptOptions.filename,
		path: UserscriptOptions.path,
	},
	plugins: [
		new DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(PRODUCTION ? "production" : "development"),
			"PRODUCTION": JSON.stringify(PRODUCTION)
		}),
		new WebpackUserscript({
			metajs: false,
			pretty: true,
			renameExt: false,
			headers: UserscriptOptions.headers
		})
	],
	module: {
		rules: [
			PRODUCTION ? {
				test: /\.[cm]?js$/,
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
			} : {}
		]
	},
	watch: !PRODUCTION,
	mode: PRODUCTION ? "production" : "development"
};
