const { join } = require("path");
const { DefinePlugin } = require("webpack");
const WebpackUserscript = require("webpack-userscript");


const PRODUCTION = (process.argv[process.argv.indexOf("--env") + 1] !== "development");
const USERSCRIPT_HEADERS = require("./src/userscript.json");

if (!PRODUCTION) {
	USERSCRIPT_HEADERS.name += " (DEV)";
	delete USERSCRIPT_HEADERS.downloadURL;
	delete USERSCRIPT_HEADERS.updateURL;
}


/** @type {import("webpack").Configuration} */
module.exports = {
	entry: join(__dirname, "src", "core.js"),
	output: {
		filename: "osnova_dark_theme.user.js",
		path: join(__dirname, "build")
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
			headers: USERSCRIPT_HEADERS
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
