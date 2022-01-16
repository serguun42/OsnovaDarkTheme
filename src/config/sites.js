const VERSION = "10.2.0";
const RESOURCES_ROOT = "https://serguun42.ru/tampermonkey/osnova/";
const SITE = window.location.hostname.match(/(?:^|\.)([^\.]+)\.(?:[^\.]+)$/i)?.[1] || "tjournal";
/** @type {string} */
const SITE_COLOR = {
	"tjournal": "#E8A427",
	"dtf": "#66D7FF",
	"vc": "#E25A76"
}[SITE];

module.exports = {
	VERSION,
	RESOURCES_ROOT,
	SITE,
	SITE_COLOR
}
