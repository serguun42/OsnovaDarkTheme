// ==UserScript==
// @name         Osnova Dark Theme
// @website      https://tjournal.ru/tag/darktheme
// @version      10.2.0 (2022-01-17)
// @author       serguun42
// @icon         https://serguun42.ru/resources/osnova_icons/tj.site.logo_256x256.png
// @icon64       https://serguun42.ru/resources/osnova_icons/tj.site.logo_64x64.png
// @match        https://tjournal.ru/*
// @match        https://dtf.ru/*
// @match        https://vc.ru/*
// @updateURL    https://serguun42.ru/tampermonkey/osnova_dark_theme.js
// @downloadURL  https://serguun42.ru/tampermonkey/osnova_dark_theme.js
// @run-at       document-start
// @grant        none
// @description  The best users' dark theme for TJ, vc.ru, DTF. Custom subthemes and more!
// @homepage     https://tjournal.ru/tag/darktheme
// @supportURL   https://tjournal.ru/m/99944
// ==/UserScript==


const { QS, GR } = require("./util/dom");

require("./util/theme-handlers");

require("./modules/favourites-marker");

require("./modules/switchers");

require("./modules/left-menu");

require("./modules/scrollers");

require("./modules/fullpage-editor");

require("./modules/stats-dash");



GR(QS(".l-page__header > style"));
window.addEventListener("load", () => GR(QS(".l-page__header > style")));
