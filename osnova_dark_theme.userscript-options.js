const path = require("path");


module.exports = {
	entry: path.join(__dirname, "osnova_dark_theme.dev.js"),
	filename: "osnova_dark_theme.js",
	path: __dirname,
	headers: {
		"name":         "Osnova Dark Theme",
		"version":      "9.6.1-R (2021-09-16)",
		"author":       "serguun42",
		"icon":         "https://serguun42.ru/resources/osnova_icons/tj.site.logo_256x256.png",
		"icon64":       "https://serguun42.ru/resources/osnova_icons/tj.site.logo_64x64.png",
		"match":        ["https://tjournal.ru/*", "https://dtf.ru/*", "https://vc.ru/*"],
		"updateURL":    "https://serguun42.ru/tampermonkey/osnova_dark_theme.js",
		"downloadURL":  "https://serguun42.ru/tampermonkey/osnova_dark_theme.js",
		"run-at":       "document-start",
		"grant":        "none",
		"license":      "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
		"description":  "The best users' dark theme for TJ, vc.ru, DTF. Custom subthemes and more!",
		"website":      "https://tjournal.ru/tag/darktheme",
		"homepage":     "https://tjournal.ru/tag/darktheme",
		"supportURL":   "https://tjournal.ru/m/99944"
	}
}