// ==UserScript==
// @name         Osnova Dark Theme
// @website      https://tjournal.ru/tag/darktheme
// @version      8.7.1-A (2021-02-23)
// @author       serguun42
// @icon         https://serguun42.ru/resources/osnova_icons/tj.site.logo_256x256.png
// @icon64       https://serguun42.ru/resources/osnova_icons/tj.site.logo_64x64.png
// @match        https://tjournal.ru/*
// @match        https://dtf.ru/*
// @match        https://vc.ru/*
// @updateURL    https://serguun42.ru/tampermonkey/osnova_dark_theme_2.js
// @downloadURL  https://serguun42.ru/tampermonkey/osnova_dark_theme_2.js
// @run-at       document-start
// @grant        none
// @description  The best users' dark theme for TJ, vc.ru, DTF. Custom subthemes and more!
// @homepage     https://tjournal.ru/tag/darktheme
// @supportURL   https://tjournal.ru/m/99944
// ==/UserScript==





const
	SITE = window.location.hostname.split(".")[0],
	RESOURCES_DOMAIN = "serguun42.ru",
	VERSION = "8.7.1",
	ALL_ADDITIONAL_MODULES = [
		{
			name: "ultra_dark",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "deep_blue",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "covfefe",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "blackchrome",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "monochrome",
			default: false,
			light: true,
			priority: 4
		},
		{
			name: "material",
			default: true,
			priority: 5
		},
		{
			name: "snow_by_neko",
			default: false,
			priority: 5
		},
		{
			name: "columns_narrow",
			default: false,
			priority: 5
		},
		{
			name: "hidesubscriptions",
			default: false,
			priority: 5
		},
		{
			name: "beautifulfeedposts",
			default: true,
			priority: 5
		},
		{
			name: "favouritesicon",
			default: true,
			priority: 5
		},
		{
			name: "gay",
			default: false,
			priority: 6
		}
	],
	ALL_MODULES = [
		{
			name: "light",
			default: true,
			light: true,
			priority: 2
		},
		{
			name: "dark",
			default: true,
			dark: true,
			priority: 2
		},
		{
			name: "tjournal",
			default: true,
			light: true,
			priority: 1
		},
		{
			name: "tjournal_dark",
			default: true,
			dark: true,
			priority: 3
		},
		{
			name: "dtf",
			default: true,
			light: true,
			priority: 1
		},
		{
			name: "dtf_dark",
			default: true,
			dark: true,
			priority: 3
		},
		{
			name: "vc",
			default: true,
			light: true,
			priority: 1
		},
		{
			name: "vc_dark",
			default: true,
			dark: true,
			priority: 3
		},
		...ALL_ADDITIONAL_MODULES
	],
	SITES_COLORS = {
		"tjournal.ru": "#E8A427",
		"dtf.ru": "#66D7FF",
		"vc.ru": "#E25A76"
	};




/** @param {String} query @returns {HTMLElement} */ const QS = query => document.querySelector(query);
/** @param {String} query @returns {HTMLElement[]} */ const QSA = query => Array.from(document.querySelectorAll(query));
/** @param {String} query @returns {HTMLElement} */ const GEBI = query => document.getElementById(query);
/** @param {HTMLElement} elem @returns {void} */ const GR = elem => {
	if (elem instanceof HTMLElement)
		(elem.parentElement || elem.parentNode).removeChild(elem);
};


/**
 * @param {String} iKey
 * @returns {Promise.<HTMLElement>}
 */
const GlobalWaitForElement = iKey => {
	if (iKey === "document.body") {
		if (document.body) return Promise.resolve(document.body);

		return new Promise((resolve) => {
			let interval = setInterval(() => {
				if (document.body) {
					clearInterval(interval);
					resolve(document.body);
				};
			}, 50);
		});
	} else {
		if (QS(iKey)) return Promise.resolve(QS(iKey));

		return new Promise((resolve) => {
			let interval = setInterval(() => {
				if (QS(iKey)) {
					clearInterval(interval);
					resolve(QS(iKey));
				};
			}, 50);
		});
	};
};

/**
 * @callback AnimationStyleSettingFunc
 * @param {Number} iProgress
 */
/**
 * @param {Number} iDuration
 * @param {AnimationStyleSettingFunc} iStyleSettingFunc - Function for setting props by progress
 * @param {"ease-in-out"|"ripple"|"linear"} [iCurveStyle="ease-in-out"] - Curve Style
 * @returns {Promise<null>}
 */
const GlobalAnimation = (iDuration, iStyleSettingFunc, iCurveStyle = "ease-in-out") => new Promise((resolve) => {
	let startTime = performance.now();


	let LocalAnimation = iPassedTime => {
		iPassedTime = iPassedTime - startTime;
		if (iPassedTime < 0) iPassedTime = 0;

		if (iPassedTime < iDuration) {
			let cProgress = iPassedTime / iDuration;

			if (iCurveStyle == "ease-in-out") {
				if (cProgress < 0.5)
					cProgress = Math.pow(cProgress * 2, 2.75) / 2;
				else
					cProgress = 1 - Math.pow((1 - cProgress) * 2, 2.75) / 2;
			} else if (iCurveStyle == "ripple") {
				cProgress = 0.6 * Math.pow(cProgress, 1/3) + 1.8 * Math.pow(cProgress, 2/3) - 1.4 * cProgress;
			};


			iStyleSettingFunc(cProgress);

			requestAnimationFrame(LocalAnimation);
		} else
			return resolve();
	};

	requestAnimationFrame(LocalAnimation);
});

/**
 * @param {Boolean} iReturning - If true, returns `Boolean` instead of `Promise<Boolean>`
 * @returns {(Promise.<Boolean>|Boolean)}
 */
const GetMode = iReturning => {
	const
		D = new Date(),
		CURRENT_TENDENCY = (D.getMonth() < 5 || (D.getMonth() === 11 && D.getDate() > 22) || (D.getMonth() === 5 && D.getDate() < 22)),
		SCHEDULE = {
			winter: {
				sunrise: 9,
				sunset: 16
			},
			summer: {
				sunrise: 6,
				sunset: 21
			}
		};

	let SESSION_START = CURRENT_TENDENCY ? new Date(D.getFullYear(), 11, 22) : new Date(D.getFullYear(), 5, 22),
		SESSION_END = CURRENT_TENDENCY ? new Date(D.getFullYear(), 5, 22) : new Date(D.getFullYear(), 11, 22),
		nightModeFlag = false;


	if (CURRENT_TENDENCY) {
		if (D.getMonth() === 11)
			SESSION_END.setFullYear(D.getFullYear() + 1);
		else
			SESSION_START.setFullYear(D.getFullYear() - 1);
	};


	const
		RATIO = (+D - SESSION_START) / (+SESSION_END - SESSION_START),
		TODAY_SUNRISE = 
			CURRENT_TENDENCY
			?
				SCHEDULE.winter.sunrise - (SCHEDULE.winter.sunrise - SCHEDULE.summer.sunrise) * RATIO
			:
				SCHEDULE.summer.sunrise + (SCHEDULE.winter.sunrise - SCHEDULE.summer.sunrise) * RATIO
		,
		TODAY_SUNSET = 
			CURRENT_TENDENCY
			?
				SCHEDULE.winter.sunset + (SCHEDULE.summer.sunset - SCHEDULE.winter.sunset) * RATIO
			:
				SCHEDULE.summer.sunset - (SCHEDULE.summer.sunset - SCHEDULE.winter.sunset) * RATIO
		;


	if (D.getHours() < Math.floor(TODAY_SUNRISE))
		nightModeFlag = true;
	else if (D.getHours() == Math.floor(TODAY_SUNRISE) & D.getMinutes() <= Math.floor((TODAY_SUNRISE % 1) * 60))
		nightModeFlag = true;
	else if (D.getHours() > Math.floor(TODAY_SUNSET))
		nightModeFlag = true;
	else if (D.getHours() == Math.floor(TODAY_SUNSET) & D.getMinutes() >= Math.floor((TODAY_SUNSET % 1) * 60))
		nightModeFlag = true;

	if (iReturning) return nightModeFlag;
	return Promise.resolve(nightModeFlag);
};

/**
 * @param {Boolean} iNightMode
 * @returns {void}
 */
const SetMode = iNightMode => {
	if (window.top === window) window.top.S42_DARK_THEME_ENABLED = iNightMode;

	GlobalWaitForElement("document.body").then(() => {
		if (iNightMode)
			document.body.classList.add("s42-is-dark")
		else
			document.body.classList.remove("s42-is-dark")
	});

	GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${SITE}.css`, 1, "site");
	GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_${iNightMode ? "dark" : "light"}.css`, 2, "osnova");

	if (iNightMode) {
		GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${SITE}_dark.css`, 3, "site");

		GlobalWaitForElement(`meta[name="theme-color"]`).then(() =>
			QS(`meta[name="theme-color"]`).setAttribute("content", "#232323")
		);
	};


	ALL_ADDITIONAL_MODULES.forEach((addon) => {
		if (GetCookie("s42_" + addon.name)) {
			if (!parseInt(GetCookie("s42_" + addon.name))) return false;
		} else {
			if (!addon.default) return false;
		};


		if (addon.dark === true && !iNightMode) return false;
		if (addon.light === true && iNightMode) return false;

		GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_${addon.name}.css`, addon.priority, "additional");
	});
};

/** @type {Object.<string, HTMLElement>} */
const CUSTOM_ELEMENTS = new Object();
window.CUSTOM_ELEMENTS = CUSTOM_ELEMENTS;

/**
 * @param {String} iModuleName
 * @param {Boolean} iStatus
 * @param {Boolean} [iWithoutPrefix=false]
 */
const ManageModule = (iModuleName, iStatus, iWithoutPrefix = false) => {
	if (iModuleName === "dark" && iStatus)
		GlobalWaitForElement("document.body").then(() =>
			document.body.classList.add("s42-is-dark")
		);

	if (iModuleName === "light" && iStatus)
		GlobalWaitForElement("document.body").then(() =>
			document.body.classList.remove("s42-is-dark")
		);


	const moduleURL = `https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${(iWithoutPrefix ? "" : "osnova_") + iModuleName}.css`;

	if (CUSTOM_ELEMENTS[moduleURL] && !iStatus) {
		GR(CUSTOM_ELEMENTS[moduleURL]);
		delete CUSTOM_ELEMENTS[moduleURL];
	} else if (!CUSTOM_ELEMENTS[moduleURL] && iStatus) {
		const moduleSpecWithPriority = ALL_MODULES.find((moduleSpec) => moduleSpec.name === iModuleName);

		GlobalAddStyle(moduleURL, moduleSpecWithPriority.priority);
	};
};

/**
 * @param {String} iLink
 * @param {Number} iPriority
 * @param {String} [iDataFor]
 */
const GlobalAddStyle = (iLink, iPriority, iDataFor = false) => {
	const stylesNode = document.createElement("link");
		  stylesNode.setAttribute("data-priority", iPriority);
		  stylesNode.setAttribute("data-author", "serguun42");
		  stylesNode.setAttribute("rel", "stylesheet");
		  stylesNode.setAttribute("href", iLink);


	if (iDataFor)
		stylesNode.setAttribute("data-for", iDataFor);
	else
		stylesNode.setAttribute("data-for", "site");


	GlobalWaitForElement(`#container-for-custom-elements-${iPriority}`).then(
		/** @param {HTMLElement} containerToPlace */ (containerToPlace) => {
			containerToPlace.appendChild(stylesNode);
			CUSTOM_ELEMENTS[iLink] = stylesNode;
		}
	);
};

/**
 * @param {String} iLink
 * @param {Number} iPriority
 * @param {String} [iDataFor]
 */
const GlobalAddScript = (iLink, iPriority, iDataFor = false) => {
	const scriptNode = document.createElement("script");
		  scriptNode.setAttribute("data-priority", iPriority);
		  scriptNode.setAttribute("data-author", "serguun42");
		  scriptNode.setAttribute("src", iLink);


	if (iDataFor)
		scriptNode.setAttribute("data-for", iDataFor);
	else
		scriptNode.setAttribute("data-for", "site");


	GlobalWaitForElement(`#container-for-custom-elements-${iPriority}`).then(
		/** @param {HTMLElement} containerToPlace */ (containerToPlace) => {
			containerToPlace.appendChild(scriptNode);
			CUSTOM_ELEMENTS[iLink] = scriptNode;
		}
	);
};

/**
 * 
 * @param {String} iName
 * @param {String} iValue
 * @param {{infinite?: true, erase?: true, Path?: string, Domain?: string}} iOptions 
 */
const SetCookie = (iName, iValue, iOptions) => {
	let cCookie = iName + "=" + encodeURIComponent(iValue);

	if (typeof iOptions !== "object") iOptions = new Object();

	if (iOptions.infinite)
		cCookie += "; Expires=" + new Date(new Date().getTime() + 1e11).toUTCString();
	else if (iOptions.erase)
		cCookie += "; Expires=" + new Date(new Date().getTime() - 1e7).toUTCString();

	delete iOptions.infinite;
	delete iOptions.erase;

	for (let key in iOptions) {
		if (iOptions[key]) {
			if (key === "Path")
				cCookie += `; ${key}=${iOptions[key]}`;
			else
				cCookie += `; ${key}=${encodeURIComponent(iOptions[key])}`;
		} else
			cCookie += "; " + key;
	};

	document.cookie = cCookie;
};

const GetCookie = iName => {
	let matches = document.cookie.match(new RegExp("(?:^|; )" + iName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

const BOTS_RULES = {
	processingRules: false,
	rulesDone: false,
	/** @type {Array.<RegExp>} */
	REGEXP_RULES: new Array(),
	/** @type {Array.<RegExp>} */
	LINKS: new Array(),
	REPLACEMENTS: {
		RU_EN: {
			"о": "o",
			"О": "O",
			"Т": "T",
			"Н": "H",
			"Р": "P",
			"р": "p",
			"М": "M",
			"а": "a",
			"А": "A",
			"В": "B",
			"х": "x",
			"Х": "X",
			"К": "K",
			"у": "y",
			"е": "e",
			"Е": "E",
			"с": "c",
			"С": "C",
			"З": "3",
		},
		EN_RU: {
			"o": "о",
			"O": "О",
			"T": "Т",
			"H": "Н",
			"P": "Р",
			"p": "р",
			"M": "М",
			"a": "а",
			"A": "А",
			"B": "В",
			"x": "х",
			"X": "Х",
			"K": "К",
			"y": "у",
			"e": "е",
			"E": "Е",
			"c": "с",
			"C": "С",
			"З": "3",
		}
	}
};



GR(GEBI("custom_subsite_css"));


GlobalWaitForElement("document.body").then(() => {
	const maxPriority = ALL_MODULES.reduce((accumulator, moduleSpec) => {
		if (moduleSpec.priority > accumulator)
			return moduleSpec.priority;
		else
			return accumulator;
	}, 0);


	for (let i = 0; i <= maxPriority; i++) {
		if (!GEBI("container-for-custom-elements-" + i)) {
			const container = document.createElement("div");
				  container.id = "container-for-custom-elements-" + i;
				  container.dataset.author = "serguun42";

			document.body.appendChild(container);
		};
	};
});


GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/mdl-switchers.css`, 0, "osnova");
GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/material-icons.css`, 0, "osnova");
GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_com_rules.css`, 0, "osnova");
GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/switchers.css`, 0, "osnova");
GlobalAddScript(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/getmdl.min.js`, 0, "osnova");


if (GetCookie("s42_turn_off") === "1")
	SetMode(false);
else if (GetCookie("s42_always") === "1")
	SetMode(true);
else
	GetMode().then((mode) => SetMode(mode));



const DEFAULT_COOKIES_OPTIONS = { infinite: true, Path: "/", Domain: window.location.hostname };
window.GetCookie = GetCookie;
window.SetCookie = SetCookie;
window.UNLOAD_COOKIES = () => {
	[
		"s42_always",
		"s42_columns_narrow",
		"s42_covfefe",
		"s42_blackchrome",
		"s42_deep_blue",
		"s42_filter",
		"s42_gay",
		"s42_karma",
		"s42_lastkarmaandsub",
		"s42_material",
		"s42_snow_by_neko",
		"s42_messageslinkdisabled",
		"s42_defaultscrollers",
		"s42_monochrome",
		"s42_qrcode",
		"s42_turn_off",
		"s42_ultra_dark",
		"s42_vbscroller",
		"s42_editorial",
		"s42_columns_narrow",
		"s42_hidesubscriptions",
		"s42_beautifulfeedposts",
		"s42_favouritesicon",
		"s42_favouritemarker",
		"s42_hideviewsanddate",
		"s42_newentriesbadge",
		"s42_donate"
	].forEach((cookieName) => SetCookie(cookieName, "1", { erase: true, Path: "/", Domain: window.location.hostname }));
};



const customDataContainer = document.createElement("div");
	  customDataContainer.id = "custom-data-container";
	  customDataContainer.className = "custom-data-container--for-big-header";

GlobalWaitForElement(".site-header-user").then(() => {
	QS(".site-header-user").after(customDataContainer);


	const switchersBtn = document.createElement("div");
		  switchersBtn.innerHTML = `<i class="material-icons material-icons-round">settings</i>`;
		  switchersBtn.id = "switchers-btn";
		  switchersBtn.className = "mdl-js-button mdl-js-ripple-effect";
		  switchersBtn.addEventListener("click", (e) => {
			let smallScreenFlag = false;
			if ((window.innerWidth - e.clientX) * 2 + 500 > window.innerWidth) smallScreenFlag = true;
			if (window.innerHeight <= 660) smallScreenFlag = true;


			const SWITCHERS_LAYOUT =
			`<div id="switcher-layout__header">Выбор тем и модулей</div>
			<ul id="switcher-layout__list">
				<div class="switcher-layout__list__subheader">Когда включать</div>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="always" data-serguun42-labels data-serguun42-time>
						<input type="radio" id="always" class="mdl-radio__button" name="time" value="always" data-serguun42-switchers ${GetCookie("s42_always") === "1" ? "checked" : ""}>
						<span class="mdl-radio__label">Тёмная тема всегда включена</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="turn_off" data-serguun42-labels data-serguun42-time>
						<input type="radio" id="turn_off" class="mdl-radio__button" name="time" value="turn_off" data-serguun42-switchers ${GetCookie("s42_turn_off") === "1" ? "checked" : ""}>
						<span class="mdl-radio__label">Тёмная тема всегда отключена</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="usual" data-serguun42-labels data-serguun42-time>
						<input type="radio" id="usual" class="mdl-radio__button" name="time" value="usual" data-serguun42-switchers ${(GetCookie("s42_always") !== "1" && GetCookie("s42_turn_off") !== "1") ? "checked" : ""}>
						<span class="mdl-radio__label">По расписанию (после заката)</span>
					</label>
				</li>
				${(Date.now() - parseInt(GetCookie("s42_donate")) || 0) > 86400 * 5 * 1e3 ? `<div class="switcher-layout__list__separator switcher-layout__list__donate"></div>
				<a class="switcher-layout__list__subheader switcher-layout__list__donate" href="https://sobe.ru/na/dark_mode" target="_blank" style="color: ${SITES_COLORS[window.location.hostname]}; text-decoration: underline;">
					Поддержать автора
				</a>
				<li class="switcher-layout__list__subheader switcher-layout__list__donate">
					Можете просто скрыть это сообщение, нажав на него или сюда 👆🏻
				</li>` : ""}
				<div class="switcher-layout__list__separator"></div>
				<div class="switcher-layout__list__subheader">Выбор дополнений к тёмной теме</div>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="ultra_dark" data-serguun42-labels data-serguun42-add-dark>
						<input type="radio" id="ultra_dark" class="mdl-radio__button" name="add-dark" value="ultra_dark" ${GetCookie("s42_ultra_dark") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-radio__label">Ultra Dark</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="deep_blue" data-serguun42-labels data-serguun42-add-dark>
						<input type="radio" id="deep_blue" class="mdl-radio__button" name="add-dark" value="deep_blue" ${GetCookie("s42_deep_blue") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-radio__label">Deep Blue</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="covfefe" data-serguun42-labels data-serguun42-add-dark>
						<input type="radio" id="covfefe" class="mdl-radio__button" name="add-dark" value="covfefe" ${GetCookie("s42_covfefe") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-radio__label">Covfefe</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="blackchrome" data-serguun42-labels data-serguun42-add-dark>
						<input type="radio" id="blackchrome" class="mdl-radio__button" name="add-dark" value="blackchrome" ${GetCookie("s42_blackchrome") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-radio__label">Black Monochrome</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="nothing" data-serguun42-labels data-serguun42-add-dark>
						<input type="radio" id="nothing" class="mdl-radio__button" name="add-dark" value="nothing" ${(GetCookie("s42_ultra_dark") !== "1" && GetCookie("s42_deep_blue") !== "1" && GetCookie("s42_covfefe") !== "1" && GetCookie("s42_blackchrome") !== "1") ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-radio__label">Без дополнений к тёмной теме</span>
					</label>
				</li>
				<div class="switcher-layout__list__separator"></div>
				<div class="switcher-layout__list__subheader">Выбор дополнений к светлой теме</div>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="monochrome" data-serguun42-labels data-serguun42-add-light>
						<input type="radio" id="monochrome" class="mdl-radio__button" name="add-light" value="monochrome" ${GetCookie("s42_monochrome") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-radio__label">Monochrome</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="nothing-light" data-serguun42-labels data-serguun42-add-light>
						<input type="radio" id="nothing-light" class="mdl-radio__button" name="add-light" value="nothing-light" ${(GetCookie("s42_monochrome") !== "1") ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-radio__label">Без дополнений к светлой теме</span>
					</label>
				</li>
				<div class="switcher-layout__list__separator"></div>
				<div class="switcher-layout__list__subheader">Кнопки в левом меню</div>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="newentriesbadge" data-serguun42-labels>
						<input type="checkbox" id="newentriesbadge" class="mdl-checkbox__input" ${GetCookie("s42_newentriesbadge") !== "0" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Улучшенный индикатор новых записей</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="editorial" data-serguun42-labels>
						<input type="checkbox" id="editorial" class="mdl-checkbox__input" ${GetCookie("s42_editorial") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Добавить кнопку «От редакции»</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="hidesubscriptions" data-serguun42-labels>
						<input type="checkbox" id="hidesubscriptions" class="mdl-checkbox__input" ${GetCookie("s42_hidesubscriptions") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Скрыть кнопку подписок</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="messageslinkdisabled" data-serguun42-labels>
						<input type="checkbox" id="messageslinkdisabled" class="mdl-checkbox__input" ${GetCookie("s42_messageslinkdisabled") === "0" ? "" : "checked"} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Скрыть кнопки «Сообщения», «Вакансии», «Компании», «Мероприятия», «Хакатоны» и «Трансляции» в левом меню</span>
					</label>
				</li>
				<div class="switcher-layout__list__separator"></div>
				<div class="switcher-layout__list__subheader">Настройки ленты</div>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="filter" data-serguun42-labels title="Такие как «Прошу о помощи», стихи и прочее">
						<input type="checkbox" id="filter" class="mdl-checkbox__input" ${GetCookie("s42_filter") !== "0" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Скрывать в ленте посты от ботов</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="beautifulfeedposts" data-serguun42-labels>
						<input type="checkbox" id="beautifulfeedposts" class="mdl-checkbox__input" ${GetCookie("s42_beautifulfeedposts") !== "0" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Кнопки оценки постов без теней</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="favouritesicon" data-serguun42-labels>
						<input type="checkbox" id="favouritesicon" class="mdl-checkbox__input" ${GetCookie("s42_favouritesicon") !== "0" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Красная иконка закладок</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="favouritemarker" data-serguun42-labels>
						<input type="checkbox" id="favouritemarker" class="mdl-checkbox__input" ${GetCookie("s42_favouritemarker") !== "0" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Количество закладок в постах</span>
					</label>
				</li>
				<div class="switcher-layout__list__separator"></div>
				<div class="switcher-layout__list__subheader">Карма и подписчики</div>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="karma" data-serguun42-labels>
						<input type="checkbox" id="karma" class="mdl-checkbox__input" ${GetCookie("s42_karma") !== "off" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Блок с кармой, подписчиками и подписками в шапке включён</span>
					</label>
				</li>
				<div id="switcher-layout__list__item--karma-cover" class="${GetCookie("s42_karma") === "off" ? "is-faded" : ""}">
					<li class="switcher-layout__list__item">
						<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="karma_rating" data-serguun42-labels>
							<input type="checkbox" id="karma_rating" class="mdl-checkbox__input" ${GetCookie("s42_karma_rating") !== "off" ? "checked" : ""} data-serguun42-switchers>
							<span class="mdl-checkbox__label">Количество кармы</span>
						</label>
					</li>
					<li class="switcher-layout__list__item">
						<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="karma_subscribers" data-serguun42-labels>
							<input type="checkbox" id="karma_subscribers" class="mdl-checkbox__input" ${GetCookie("s42_karma_subscribers") !== "off" ? "checked" : ""} data-serguun42-switchers>
							<span class="mdl-checkbox__label">Подписчики</span>
						</label>
					</li>
					<li class="switcher-layout__list__item">
						<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="karma_subscriptions" data-serguun42-labels>
							<input type="checkbox" id="karma_subscriptions" class="mdl-checkbox__input" ${GetCookie("s42_karma_subscriptions") !== "off" ? "checked" : ""} data-serguun42-switchers>
							<span class="mdl-checkbox__label">Подписки</span>
						</label>
					</li>
					<div id="switcher-layout__list__item--karma-cover__obfuscator"></div>
				</div>
				<div class="switcher-layout__list__separator"></div>
				<div class="switcher-layout__list__subheader">Другие дополнительные модули</div>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="snow_by_neko" data-serguun42-labels>
						<input type="checkbox" id="snow_by_neko" class="mdl-checkbox__input" ${GetCookie("s42_snow_by_neko") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Добавить снег фоном</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="material" data-serguun42-labels>
						<input type="checkbox" id="material" class="mdl-checkbox__input" ${GetCookie("s42_material") === "0" ? "" : "checked"} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Добавить оформление «Material»</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="defaultscrollers" data-serguun42-labels>
						<input type="checkbox" id="defaultscrollers" class="mdl-checkbox__input" ${GetCookie("s42_defaultscrollers") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Включить стандартные полосы прокрутки</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="columns_narrow" data-serguun42-labels>
						<input type="checkbox" id="columns_narrow" class="mdl-checkbox__input" ${GetCookie("s42_columns_narrow") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Прижать боковые колонки к центру экрана (убрать пространство между колонками и контентом в центре)</span>
					</label>
				</li>
				<li class="switcher-layout__list__item" title="Gorgeous, astonishing, yummy(?)">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="gay" data-serguun42-labels>
						<input type="checkbox" id="gay" class="mdl-checkbox__input" ${GetCookie("s42_gay") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label" title="Gorgeous, astonishing, yummy(?)">Добавить оформление «G.A.Y»</span>
					</label>
				</li>
			</ul>


			${smallScreenFlag ?
				`<div class="switcher-layout__list__separator"></div>
				<div id="switcher-layout__close-button-container">
					<div class="mdl-js-button mdl-js-ripple-effect" id="switcher-layout__close-button" data-serguun42-labels>
						Закрыть опции
					</div>
				</div>`
				:
				""}`;


			const switchersContainer = document.createElement("div");
				  switchersContainer.id = "switcher-layout";
				  switchersContainer.style.width = 0;
				  switchersContainer.style.height = 0;

			if (smallScreenFlag)
				switchersContainer.classList.add("switcher-layout--small-screen");
			else
				switchersContainer.style.right = (window.innerWidth - e.clientX) + "px";

			document.body.appendChild(switchersContainer);


			const switchersScroller = document.createElement("div");
				  switchersScroller.id = "switcher-layout--scroller";

			switchersContainer.appendChild(switchersScroller);
			switchersScroller.innerHTML = SWITCHERS_LAYOUT;

			const switchersObfuscator = document.createElement("div");
				  switchersObfuscator.id = "switcher-layout--obfuscator";

			document.body.appendChild(switchersObfuscator);


			const switchersContainerMaxHeight = smallScreenFlag ? window.innerHeight - 60 : 600;
			const switchersContainerMaxWidth = smallScreenFlag ? window.innerWidth : 500;

			GlobalAnimation(4e2, (iProgress) => {
				switchersContainer.style.width = iProgress * switchersContainerMaxWidth + "px";
				switchersContainer.style.height = iProgress * switchersContainerMaxHeight + "px";
				if (iProgress < 0.25)
					switchersContainer.style.opacity = iProgress * 4;
				else
					switchersContainer.style.opacity = 1;
			}).then(() => {
				switchersContainer.style.width = switchersContainerMaxWidth + "px";
				switchersContainer.style.height = switchersContainerMaxHeight + "px";
				switchersContainer.style.opacity = 1;
				switchersScroller.style.overflowY = "auto";
			});




			if ("componentHandler" in window) {
				componentHandler.upgradeElement(switchersBtn);
				componentHandler.upgradeElements(QSA("[data-serguun42-labels]"));
			};




			const LocalCloseSwitchers = () => {
				switchersScroller.style.overflowY = "hidden";

				GlobalAnimation(4e2, (iProgress) => {
					switchersContainer.style.opacity = 1 - iProgress;
				}).then(() => {
					GR(switchersContainer);
					GR(switchersObfuscator);
				});
			};

			switchersObfuscator.addEventListener("click", () => LocalCloseSwitchers());

			switchersObfuscator.addEventListener("contextmenu", () => {
				LocalCloseSwitchers();
				return false;
			});

			if (smallScreenFlag) {
				if (GEBI("switcher-layout__close-button"))
					GEBI("switcher-layout__close-button").addEventListener("click", () => LocalCloseSwitchers());
			};



			QSA("[data-serguun42-switchers]").forEach((switcher) => {
				switcher.addEventListener("change", (e) => {
					if (e.currentTarget.id === "material") {
						SetCookie("s42_material", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);

						ManageModule("material", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "snow_by_neko") {
						SetCookie("s42_snow_by_neko", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);

						ManageModule("snow_by_neko", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "columns_narrow") {
						SetCookie("s42_columns_narrow", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);

						ManageModule("columns_narrow", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "filter") {
						SetCookie("s42_filter", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);

						if (e.currentTarget.checked) GlobalFilterProcedure();
					};

					if (e.currentTarget.id === "gay") {
						SetCookie("s42_gay", e.currentTarget.checked ? "1" : "0", DEFAULT_COOKIES_OPTIONS);

						ManageModule("gay", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "karma") {
						SetCookie("s42_karma", e.currentTarget.checked ? "on" : "off", DEFAULT_COOKIES_OPTIONS);

						if (e.currentTarget.checked) {
							GEBI("switcher-layout__list__item--karma-cover").classList.remove("is-faded");
							SetStatsDash(true);
						} else {
							GEBI("switcher-layout__list__item--karma-cover").classList.add("is-faded");
							GR(GEBI("main_menu__auth__stats"));
						};
					};

					if (e.currentTarget.id === "karma_rating") {
						SetCookie("s42_karma_rating", e.currentTarget.checked ? "on" : "off", DEFAULT_COOKIES_OPTIONS);

						SetStatsDash(true);
					};

					if (e.currentTarget.id === "karma_subscribers") {
						SetCookie("s42_karma_subscribers", e.currentTarget.checked ? "on" : "off", DEFAULT_COOKIES_OPTIONS);

						SetStatsDash(true);
					};

					if (e.currentTarget.id === "karma_subscriptions") {
						SetCookie("s42_karma_subscriptions", e.currentTarget.checked ? "on" : "off", DEFAULT_COOKIES_OPTIONS);

						SetStatsDash(true);
					};

					if (e.currentTarget.id === "hidesubscriptions") {
						SetCookie("s42_hidesubscriptions", e.currentTarget.checked ? "1" : "0", DEFAULT_COOKIES_OPTIONS);

						ManageModule("hidesubscriptions", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "beautifulfeedposts") {
						SetCookie("s42_beautifulfeedposts", e.currentTarget.checked ? "1" : "0", DEFAULT_COOKIES_OPTIONS);

						ManageModule("beautifulfeedposts", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "favouritesicon") {
						SetCookie("s42_favouritesicon", e.currentTarget.checked ? "1" : "0", DEFAULT_COOKIES_OPTIONS);

						ManageModule("favouritesicon", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "favouritemarker") {
						SetCookie("s42_favouritemarker", e.currentTarget.checked ? "1" : "0", DEFAULT_COOKIES_OPTIONS);

						addFavouriteMarkerFlag = !!e.currentTarget.checked;
					};

					if (e.currentTarget.id === "messageslinkdisabled") {
						SetCookie("s42_messageslinkdisabled", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);

						if (e.currentTarget.checked) {
							GlobalSetSidebarItemsStyle("none");
						} else {
							GlobalSetSidebarItemsStyle("");
						};
					};

					if (e.currentTarget.id === "defaultscrollers") {
						SetCookie("s42_defaultscrollers", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);

						if (e.currentTarget.checked) {
							GlobalSetScrollers("default");
						} else {
							GlobalSetScrollers("custom");
						};
					};

					if (e.currentTarget.id === "newentriesbadge") {
						SetCookie("s42_newentriesbadge", e.currentTarget.checked ? "1" : "0", DEFAULT_COOKIES_OPTIONS);

						addBadgeFlag = !!e.currentTarget.checked;
					};

					if (e.currentTarget.id === "editorial") {
						SetCookie("s42_editorial", e.currentTarget.checked ? "1" : "0", DEFAULT_COOKIES_OPTIONS);

						if (e.currentTarget.checked) {
							GlobalPlaceEditorialButton();
						} else {
							GR(GEBI("s42-editorial-link-btn"));
						};
					};

					if (e.currentTarget.getAttribute("name") === "add-dark") {
						SetCookie("s42_ultra_dark", (e.currentTarget.value === "ultra_dark" ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);
						SetCookie("s42_deep_blue", (e.currentTarget.value === "deep_blue" ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);
						SetCookie("s42_covfefe", (e.currentTarget.value === "covfefe" ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);
						SetCookie("s42_blackchrome", (e.currentTarget.value === "blackchrome" ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);

						if (
							e.currentTarget.value === "ultra_dark" ||
							e.currentTarget.value === "deep_blue" ||
							e.currentTarget.value === "covfefe" ||
							e.currentTarget.value === "blackchrome"
						) {
							if (
								GetCookie("s42_turn_off") && parseInt(GetCookie("s42_turn_off")) ||
								(!GetMode(true) && GetCookie("s42_always") !== "1" && GetCookie("s42_turn_off") !== "1")
							) {
								QS(`[for="always"]`).classList.add("is-checked");
								QS(`[value="always"]`).checked = true;
								QS(`[for="turn_off"]`).classList.remove("is-checked");
								QS(`[value="turn_off"]`).checked = false;
								QS(`[for="usual"]`).classList.remove("is-checked");
								QS(`[value="usual"]`).checked = false;

								SetCookie("s42_always", "1", DEFAULT_COOKIES_OPTIONS);
								SetCookie("s42_turn_off", "0", DEFAULT_COOKIES_OPTIONS);

								ManageModule("monochrome", false);
								ManageModule("dark", true);
								ManageModule(`${SITE}_dark`, true, true);
								ManageModule("light", false);
							};
						};

						ManageModule("ultra_dark", e.currentTarget.value === "ultra_dark");
						ManageModule("deep_blue", e.currentTarget.value === "deep_blue");
						ManageModule("covfefe", e.currentTarget.value === "covfefe");
						ManageModule("blackchrome", e.currentTarget.value === "blackchrome");
					};

					if (e.currentTarget.getAttribute("name") === "add-light") {
						SetCookie("s42_monochrome", (e.currentTarget.value === "monochrome" ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);

						if (
							e.currentTarget.value === "monochrome"
						) {
							if (
								GetCookie("s42_turn_off") !== "1" || GetMode(true)
							) {
								QS(`[for="always"]`).classList.remove("is-checked");
								QS(`[value="always"]`).checked = false;
								QS(`[for="turn_off"]`).classList.add("is-checked");
								QS(`[value="turn_off"]`).checked = true;
								QS(`[for="usual"]`).classList.remove("is-checked");
								QS(`[value="usual"]`).checked = false;

								SetCookie("s42_always", "0", DEFAULT_COOKIES_OPTIONS);
								SetCookie("s42_turn_off", "1", DEFAULT_COOKIES_OPTIONS);


								ManageModule("ultra_dark", false);
								ManageModule("deep_blue", false);
								ManageModule("covfefe", false);
								ManageModule("blackchrome", false);
								ManageModule("dark", false);
								ManageModule(`${SITE}_dark`, false, true);
								ManageModule("light", true);
							};
						};

						ManageModule("monochrome", e.currentTarget.value === "monochrome");
					};

					if (e.currentTarget.getAttribute("name") === "time") {
						SetCookie("s42_always", (e.currentTarget.value === "always" ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);
						SetCookie("s42_turn_off", (e.currentTarget.value === "turn_off" ? 1 : 0).toString(), DEFAULT_COOKIES_OPTIONS);


						QS(`[for="ultra_dark"]`).classList.remove("is-checked");
						QS(`[value="ultra_dark"]`).checked = false;
						QS(`[for="deep_blue"]`).classList.remove("is-checked");
						QS(`[value="deep_blue"]`).checked = false;
						QS(`[for="covfefe"]`).classList.remove("is-checked");
						QS(`[value="covfefe"]`).checked = false;
						QS(`[for="blackchrome"]`).classList.remove("is-checked");
						QS(`[value="blackchrome"]`).checked = false;
						QS(`[for="nothing"]`).classList.add("is-checked");
						QS(`[value="nothing"]`).checked = true;


						ManageModule("ultra_dark", false);
						ManageModule("deep_blue", false);
						ManageModule("covfefe", false);
						ManageModule("blackchrome", false);
						ManageModule("monochrome", false);


						if (e.currentTarget.value === "always") {
							ManageModule("dark", true);
							ManageModule(`${SITE}_dark`, true, true);
							ManageModule("light", false);

							["ultra_dark", "deep_blue", "covfefe", "blackchrome"].forEach((addDarkModuleName) => {
								if (GetCookie("s42_" + addDarkModuleName) === "1") {
									ManageModule(addDarkModuleName, true);

									QS(`[for="${addDarkModuleName}"]`).classList.add("is-checked");
									QS(`[value="${addDarkModuleName}"]`).checked = true;
								};
							});

							QS(`[for="nothing"]`).classList.remove("is-checked");
							QS(`[value="nothing"]`).checked = false;
						} else if (e.currentTarget.value === "turn_off") {
							ManageModule("dark", false);
							ManageModule(`${SITE}_dark`, false, true);
							ManageModule("light", true);

							["monochrome"].forEach((addLightModuleName) => {
								if (GetCookie("s42_" + addLightModuleName) === "1") {
									ManageModule(addLightModuleName, true);

									QS(`[for="${addLightModuleName}"]`).classList.add("is-checked");
									QS(`[value="${addLightModuleName}"]`).checked = true;
								};
							});

							QS(`[for="nothing"]`).classList.remove("is-checked");
							QS(`[value="nothing"]`).checked = false;
						} else {
							GetMode().then((iNightMode) => {
								if (iNightMode) {
									QS(`meta[name="theme-color"]`).setAttribute("content", "#232323");
									ManageModule("dark", true);
									ManageModule(`${SITE}_dark`, true, true);
									ManageModule("light", false);

									["ultra_dark", "deep_blue", "covfefe", "blackchrome"].forEach((addDarkModuleName) => {
										if (GetCookie("s42_" + addDarkModuleName) === "1") {
											ManageModule(addDarkModuleName, true);

											QS(`[for="${addDarkModuleName}"]`).classList.add("is-checked");
											QS(`[value="${addDarkModuleName}"]`).checked = true;
											QS(`[for="nothing"]`).classList.remove("is-checked");
											QS(`[value="nothing"]`).checked = false;
										};
									});
								} else {
									QS(`meta[name="theme-color"]`).setAttribute("content", SITES_COLORS[window.location.hostname]);
									ManageModule("dark", false);
									ManageModule(`${SITE}_dark`, false, true);
									ManageModule("light", true);
								};
							});
						};
					};
				});
			});

			QSA(".switcher-layout__list__donate").forEach((donatePromoteElem) => {
				donatePromoteElem.addEventListener("click", () => {
					SetCookie("s42_donate", Date.now().toString(), DEFAULT_COOKIES_OPTIONS);


					QSA(".switcher-layout__list__donate").forEach((donatePromoteElemToHide, donatePromoteElemToHideIndex) => {
						donatePromoteElemToHide.style.overflow = "hidden";
						let initHeight = donatePromoteElemToHide.scrollHeight,
							initMargin = 12;

						GlobalAnimation(4e2, (iProgress) => {
							donatePromoteElemToHide.style.height = initHeight * (1 - iProgress) + "px";
							donatePromoteElemToHide.style.marginBottom = initMargin * (1 - iProgress) + "px";

							if (!donatePromoteElemToHideIndex) 
								donatePromoteElemToHide.style.marginTop = initMargin * (1 - iProgress) + "px";
						}, "ease-in-out").then(() => {
							donatePromoteElemToHide.style.height = 0;
							GR(donatePromoteElemToHide);
						});
					});
				})
			});
		  });

	customDataContainer.appendChild(switchersBtn);
});




let windowLoaded = false;

const GlobalSetSidebarItemsStyle = iStyle => {
	if (QS(`.sidebar-tree-list-item[href="/m"]`))
		QS(`.sidebar-tree-list-item[href="/m"]`).style.display = iStyle;
	if (QS(`.sidebar-tree-list-item[href="/job"]`))
		QS(`.sidebar-tree-list-item[href="/job"]`).style.display = iStyle;
	if (QS(`.sidebar-tree-list-item[href="/companies_new"]`))
		QS(`.sidebar-tree-list-item[href="/companies_new"]`).style.display = iStyle;
	if (QS(`.sidebar-tree-list-item[href="/companies/new"]`))
		QS(`.sidebar-tree-list-item[href="/companies/new"]`).style.display = iStyle;
	if (QS(`.sidebar-tree-list-item[href="/companies"]`))
		QS(`.sidebar-tree-list-item[href="/companies"]`).style.display = iStyle;
	if (QS(`.sidebar-tree-list-item[href="/events"]`))
		QS(`.sidebar-tree-list-item[href="/events"]`).style.display = iStyle;
	if (QS(`.sidebar-tree-list-item[href="/events"]`))
		QS(`.sidebar-tree-list-item[href="/events"]`).style.display = iStyle;


	QSA(`.sidebar-tree-list-item--custom-html`).forEach((sidebarLink) => {
		sidebarLink.style.display = iStyle;
	});

	QSA(`.sidebar-tree-list-item--colored`).forEach((sidebarLink) => {
		sidebarLink.style.display = iStyle;
	});
};

const GlobalSetScrollers = iScrollersMode => {
	if (iScrollersMode === "default") {
		GlobalWaitForElement("document.body").then(() =>
			document.body.classList.add("s42-default-scrollers")
		);
	} else {
		GlobalWaitForElement("document.body").then(() =>
			document.body.classList.remove("s42-default-scrollers")
		);
	};
};

if (GetCookie("s42_messageslinkdisabled") !== "0") {
	GlobalWaitForElement(".sidebar").then(() => GlobalSetSidebarItemsStyle("none"));
};

if (GetCookie("s42_defaultscrollers") === "1") {
	GlobalSetScrollers("default");
};

const GlobalPlaceEditorialButton = () => {
	GlobalWaitForElement(`.sidebar-tree-list-item[href="/m"]`).then(() => {
		const messengerButton = QS(`.sidebar-tree-list-item[href="/m"]`);
		if (!messengerButton) return console.warn("No messenger button!");


		const editorialButton = document.createElement("div");
		messengerButton.after(editorialButton);


		editorialButton.outerHTML = messengerButton.outerHTML
															.replace(/sidebar-tree-list-item"/gi, `sidebar-tree-list-item" id="s42-editorial-link-btn"`)
															.replace(/href="\/m"/gi, `href="/editorial"`)
															.replace(/style="[^"]+"/gi, "")
															.replace(/Сообщения/gi, "От редакции")
															.replace(/icon icon--ui_sidebar_messenger/gi, "icon icon--ui_check")
															.replace(/xlink:href="#ui_sidebar_messenger"/gi, `xlink:href="#ui_check"`)
															.replace(/sidebar-tree-list-item--active/gi, "");


		const sidebarButtons = QSA(".sidebar-tree-list-item");
		sidebarButtons.forEach((sidebarButton) => {
			sidebarButton.addEventListener("click", () => {
				sidebarButtons.forEach((sidebarButtonToChangeClass) => {
					if (sidebarButton !== sidebarButtonToChangeClass)
						sidebarButtonToChangeClass.classList.remove("sidebar-tree-list-item--active");
				});

				if (sidebarButton.id === "s42-editorial-link-btn") {
					sidebarButton.classList.add("sidebar-tree-list-item--active");
				};
			});
		});


		if (window.location.pathname.search(/^\/editorial/) > -1) {
			sidebarButtons.forEach((sidebarButtonToChangeClass) => {
				sidebarButtonToChangeClass.classList.remove("sidebar-tree-list-item--active");
			});

			GEBI("s42-editorial-link-btn").classList.add("sidebar-tree-list-item--active");
		};
	});
};

if (GetCookie("s42_editorial") === "1") {
	GlobalPlaceEditorialButton();
};

const GlobalFilterProcedure = () => {
	new Promise((resolve, reject) => {
		if (BOTS_RULES.rulesDone) {
			return resolve();
		};

		if (BOTS_RULES.processingRules) {
			let gettingReadyIterval = setInterval(() => {
				if (BOTS_RULES.rulesDone) {
					window.clearInterval(gettingReadyIterval);
					return resolve();
				};
			}, 100);

			return;
		};



		GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_filter_style.css`, 0, "osnova");

		BOTS_RULES.processingRules = true;
		fetch(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_filter_rules.json`, {
			method: "GET",
			mode: "cors",
			credentials: "omit"
		})
		.then((response) => response.json())
		.then((jsonRules) => {
			jsonRules.RAW_TEXT_RULES.forEach((rawRule) => {
				let newRule = new String();

				rawRule.split("").forEach((letter) => {
					if (letter === " ") {
						newRule += "\\s";
					} else if (letter in BOTS_RULES.REPLACEMENTS.RU_EN) {
						newRule += `[${letter}${BOTS_RULES.REPLACEMENTS.RU_EN[letter]}]{1}`;
					} else if (letter in BOTS_RULES.REPLACEMENTS.EN_RU) {
						newRule += `[${letter}${BOTS_RULES.REPLACEMENTS.EN_RU[letter]}]{1}`;
					} else {
						newRule += letter;
					};
				});

				BOTS_RULES.REGEXP_RULES.push(new RegExp(newRule, "gmi"));
			});


			jsonRules.RAW_LINKS_RULES.forEach((rawLinkRule) =>
				BOTS_RULES.LINKS.push(new RegExp(rawLinkRule, "gi"))
			);

			BOTS_RULES.rulesDone = true;

			resolve();
		}).catch((e) => reject(e));
	}).then(() => {
		QSA(`.content-feed[air-module="module.entry"]:not(.content-feed--s42-seen)`).forEach((feedEntry) => {
			let removeFlag = false,
				removeCount = 0;

			feedEntry.classList.add("content-feed--s42-seen");


			let header = feedEntry.querySelector(".content-header");

			if (!header)
				header = feedEntry.querySelector(".content-header--short");

			if (header) {
				if (header.innerText)
					BOTS_RULES.REGEXP_RULES.forEach((rule) => {
						if (rule.test(header.innerText)) {
							removeCount++;
							removeFlag = `HEADER:/${rule.source}/${rule.flags}`;
						};
					});
			};


			let paragraphs = Array.from(feedEntry.querySelectorAll(".content p"));

			paragraphs.forEach((paragraph) => {
				if (paragraph.innerText)
					BOTS_RULES.REGEXP_RULES.forEach((rule) => {
						if (rule.test(paragraph.innerText)) {
							removeCount++;
							removeFlag = `PARAGRAPH:/${rule.source}/${rule.flags}`;
						};
					});
			});


			let links = Array.from(feedEntry.querySelectorAll(".content a"));


			links.forEach((link) => {
				let href = link.getAttribute("href");

				if (href)
					BOTS_RULES.LINKS.forEach((linkRule) => {
						if (linkRule.test(href)) {
							removeCount += 2;
							removeFlag = `LINK:/${linkRule.source}/${linkRule.flags}`;
						};
					});
			});



			if (removeFlag && removeCount > 1) {
				let hiddenMessage = document.createElement("p");
					hiddenMessage.className = "content-feed__s42-message";
					hiddenMessage.innerHTML = `<span><a href="${feedEntry.querySelector(".content-feed__link").getAttribute("href")}">Пост</a> скрыт фильтрами тем.</span>`;

				feedEntry.classList.add("content-feed--s42-filtered");
				feedEntry.querySelector(".content").appendChild(hiddenMessage);


				let complaintUserID	= parseInt(feedEntry.querySelector(".content-header-author").getAttribute("href").replace(`https://${window.location.hostname}/u/`, "")),
					complaintPostID = parseInt(feedEntry.querySelector(".content-feed__link").getAttribute("href").replace(new RegExp(`https\\:\\/\\/${SITE}\\.ru\\/([\\w-\\d]+\\/){0,2}`, ""), ""));

				if (isNaN(complaintUserID)) {
					complaintUserID	= parseInt(feedEntry.querySelector(".content-header-author--user").getAttribute("href").replace(`https://${window.location.hostname}/u/`, ""));
				};

				if (isNaN(complaintPostID) | isNaN(complaintUserID)) return;
			};
		});


		QSA(`.comments__item__space:not(.comments__item__space--s42-seen)`).forEach((commentSpace) => {
			let removeFlag = false,
				removeCount = 0;

			commentSpace.classList.add("comments__item__space--s42-seen");


			let text = commentSpace.querySelector(".comments__item__text");

			if (text) {
				if (text.innerText) {
					BOTS_RULES.REGEXP_RULES.forEach((rule) => {
						if (rule.test(text.innerText)) {
							removeCount++;
							removeFlag = `COMMENT_TEXT:/${rule.source}/${rule.flags}`;
						};
					});
				};
			};


			let links = Array.from(commentSpace.querySelectorAll("a"));


			links.forEach((link) => {
				let href = link.getAttribute("href");

				if (href)
					BOTS_RULES.LINKS.forEach((linkRule) => {
						if (linkRule.test(href)) {
							removeCount += 2;
							removeFlag = `COMMENT_LINK:/${linkRule.source}/${linkRule.flags}`;
						};
					});
			});



			if (removeFlag && removeCount > 1) {
				let hiddenMessage = document.createElement("p");
					hiddenMessage.className = "comments__item__space__s42-message";


				let hiddenMessageShow = document.createElement("span");
					hiddenMessageShow.innerText = "Комментарий";
					hiddenMessageShow.className = "comments__item__space__s42-message--show-button";
					hiddenMessageShow.addEventListener("click", (e) => {
						commentSpace.classList.remove("comments__item__space--s42-filtered");
						GR(e.currentTarget.parentElement || e.currentTarget.parentNode);
					});

				hiddenMessage.append(hiddenMessageShow);


				let hiddenMessageSpan = document.createElement("span");
					hiddenMessageSpan.innerText = " скрыт фильтрами тем.";

				hiddenMessage.append(hiddenMessageSpan);


				commentSpace.classList.add("comments__item__space--s42-filtered");
				commentSpace.appendChild(hiddenMessage);
			};
		});
	}).catch(console.warn);
};

if (GetCookie("s42_filter") !== "0") {
	GlobalFilterProcedure();
};

let addBadgeFlag = (GetCookie("s42_newentriesbadge") !== "0");

const GlobalBadgeProcedure = () => {
	let startedBadgeProcedure = false;

	const LocalStartBadgeProcedure = () => {
		if (startedBadgeProcedure) return;
		startedBadgeProcedure = true;


		try {
			const newEntriesModule = Air.get("module.new_entries");

			const badge = document.createElement("span");
				  badge.id = "s42-feed-link-new-entries-badge";
				  badge.className = "is-hidden";

			QS(".sidebar-tree-list-item").querySelector(".sidebar-tree-list-item__link").appendChild(badge);


			const count = newEntriesModule.getUnreadCount();
			if (count) {
				badge.classList.remove("is-hidden");
				badge.innerText = count;
			};


			newEntriesModule.on("Unread count changed", (count) => {
				if (!startedBadgeProcedure) return;

				if (count) {
					badge.classList.remove("is-hidden");
					badge.innerText = count;
				} else {
					badge.classList.add("is-hidden");
				};
			});


			const LocalSidebarListItemClickListener = () => {
				badge.classList.add("is-hidden");

				setTimeout(() => {
					const count = newEntriesModule.getUnreadCount();
					if (count) {
						badge.classList.remove("is-hidden");
						badge.innerText = count;
					};
				}, 2e3);
			};


			document.body.classList.add("s42-has-counter");
			QS(".sidebar-tree-list-item").addEventListener("click", LocalSidebarListItemClickListener);


			const checkForDisablingInterval = setInterval(() => {
				if (!addBadgeFlag) {
					window.clearInterval(checkForDisablingInterval);
					newEntriesModule.off("Unread count changed");
					document.body.classList.remove("s42-has-counter");
					QS(".sidebar-tree-list-item").removeEventListener("click", LocalSidebarListItemClickListener);
					GR(badge);
					startedBadgeProcedure = false;
				};
			}, 1e3);
		} catch (e) {
			console.warn(e);
		};
	};

	setInterval(() => {
		if (addBadgeFlag) {
			if (windowLoaded) {
				LocalStartBadgeProcedure();
			} else {
				window.addEventListener("load", () => {
					setTimeout(() => LocalStartBadgeProcedure(), 2e3);
				});
			};
		};
	}, 250);
};

let addFavouriteMarkerFlag = (GetCookie("s42_favouritemarker") !== "0");

const GlobalFavouriteMarketProcedure = () => {
	let startedFavouriteMarketProcedure = false;

	const LocalFavouriteMarketProcedure = () => {
		if (startedFavouriteMarketProcedure) return;
		startedFavouriteMarketProcedure = true;


		let lastURL = "";

		const urlChangeInterval = setInterval(() => {
			if (!addFavouriteMarkerFlag) {
				startedFavouriteMarketProcedure = false;
				window.clearInterval(urlChangeInterval);
				return;
			};

			if (lastURL === window.location.pathname) return;
			if (document.querySelector(".main_progressbar--in_process")) return;

			lastURL = window.location.pathname;


			/* Actual Cache Procedure */
			let cURL = lastURL,
				id = -2;

			if (cURL.slice(0, 3) === "/u/") {
				cURL = cURL.slice(1).split("/");
				if (cURL.length < 3) return;

				id = parseInt(cURL[2]);
				if (isNaN(id)) return;
			} else {
				if (cURL.slice(0, 3) === "/m/") return;

				if (cURL.slice(0, 3) === "/s/")
					cURL = cURL.slice(3);
				else
					cURL = cURL.slice(1);

				if (!cURL) return;

				cURL = cURL.split("/");
				if (cURL.length >= 2) {
					id = parseInt(cURL[1]);
					if (isNaN(id)) return;
				} else if (cURL.length) {
					id = parseInt(cURL[0]);
					if (isNaN(id)) return;
				};
			};



			GlobalWaitForElement(`[data-error-code="404"], [data-error-code="403"], .l-entry__header`).then((postElement) => {
				if (!postElement) return;

				try {
					const hiddenEntryData = JSON.parse(document.querySelector(".l-hidden.entry_data")?.innerText || "{}"),
						  favouritesCount = hiddenEntryData["favorites"];

					QSA(".l-entry .favorite_marker").forEach((favouriteMarkerElem) => {
						favouriteMarkerElem.classList.remove("favorite_marker--zero");

						const favouriteMarkerCountElem = favouriteMarkerElem.querySelector(".favorite_marker__count") || document.createElement("div");
							  favouriteMarkerCountElem.className = "favorite_marker__count";
							  favouriteMarkerCountElem.innerText = favouritesCount || "";

						favouriteMarkerElem.appendChild(favouriteMarkerCountElem);

						favouriteMarkerElem.addEventListener("click", (e) => {
							const active = (e.currentTarget || e.target).classList.contains("favorite_marker--active"),
								  currentCount = parseInt(favouriteMarkerCountElem.innerText) || 0;

							if (active)
								favouriteMarkerCountElem.innerText = (currentCount + 1);
							else
								favouriteMarkerCountElem.innerText = (currentCount - 1);
						});
					});
				} catch (e) {
					console.warn("Cannot place favourites counter", e);
				};
			});
		}, 200);
	};

	setInterval(() => {
		if (addFavouriteMarkerFlag) {
			if (windowLoaded) {
				LocalFavouriteMarketProcedure();
			} else {
				window.addEventListener("load", () => {
					setTimeout(() => LocalFavouriteMarketProcedure(), 2e3);
				});
			};
		};
	}, 250);
};

/**
 * @param {Boolean} [iSkipInitial=false]
 */
const SetStatsDash = (iSkipInitial = false) => {
	if (!iSkipInitial) {
		GlobalWaitForElement("#custom-data-container").then(() => {
			if (QS(".site-header") && QS(".site-header").clientHeight == 45) {
				customDataContainer.classList.add("for-narrow-header");
			};
		});

		const customModules = Object.keys(CUSTOM_ELEMENTS).map((moduleURL) =>
									moduleURL.replace("https://" + RESOURCES_DOMAIN + "/tampermonkey/osnova/", "")
								),
			  customModulesEncoded = encodeURIComponent(customModules?.join(",") || "");


		setTimeout(() =>
			GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/final.css?id=${window.__delegated_data?.["module.auth"]?.["id"] || "-" + VERSION}&name=${encodeURIComponent(window.__delegated_data?.["module.auth"]?.["name"] || "-" + VERSION)}&site=${SITE}&version=${VERSION}&modules=${customModulesEncoded}`, 0, "osnova")
		, 1e3);
	};


	if (GetCookie("s42_karma") === "off") return false;


	const additionalStyleForAccountsBubble = document.createElement("style");
		  additionalStyleForAccountsBubble.innerHTML = `:root { --switchers-additional-spacing: 120px; }`;

	document.body.appendChild(additionalStyleForAccountsBubble);

	
	/**
	 * @param {Number} karma
	 * @param {Number} subscribers
	 * @param {Number} subscriptions
	 * @returns {void}
	 */
	const LocalPlaceBatch = (karma, subscribers, subscriptions) => {
		additionalStyleForAccountsBubble.innerHTML = `:root { --switchers-additional-spacing: ${(customDataContainer.scrollWidth).toFixed(2)}px; }`;


		const relativeCookieName = ["karma_rating", "karma_subscribers", "karma_subscriptions"],
			  wrapper = [
				`__NUM__`,
				`<i class="material-icons material-icons-round">groups</i>&nbsp;__NUM__`,
				`<i class="material-icons material-icons-round">playlist_add_check</i>&nbsp;__NUM__`
			  ],
			  descriptions = [
				  "Карма",
				  "Подписчики",
				  "Подписки"
			  ];

		const htmlForBatch = [karma, subscribers, subscriptions].map((value, index) => {
			if (typeof value !== "number" && typeof value !== "string" || value === "null") return null;
			if (GetCookie(`s42_${relativeCookieName[index]}`) === "off") return null;

			return `<span title="${descriptions[index]}">${wrapper[index].replace("__NUM__", value)}</span>`;
		}).filter((value) => value !== null).join("&nbsp;|&nbsp;");


		if (!htmlForBatch) return GR(GEBI("main_menu__auth__stats"));


		if (GEBI("main_menu__auth__stats"))
			GEBI("main_menu__auth__stats").innerHTML = htmlForBatch;
		else {
			const statsDash = document.createElement("a");
				  statsDash.id = "main_menu__auth__stats";
				  statsDash.innerHTML = htmlForBatch;
				  statsDash.href = "/u/me";
				  statsDash.target = "_self";

			customDataContainer.prepend(statsDash);
		};
	};


	GlobalWaitForElement("#custom-data-container").then(() => {
		customDataContainer.parentNode.classList.add("s42-karma-shown");

		const userID = window.__delegated_data?.["module.auth"]?.["id"];
		if (!userID) return console.warn("No user id!");

		const LocalFetch = () => {
			fetch(`/u/${userID}`)
			.then((res) => {
				if (res.status === 200)
					return res.text();
				else
					return Promise.reject(503);
			})
			.then((page) => {
				const subsiteHeader = page
					.match(/<[\w]+(\s+[\w\-]+(\=("|')[^"']*(\3))?)*\sair-module="module.subsiteHeader"(\s+[\w\-]+(\=("|')[^"']*(\7))?)*>\s*<textarea(\s+[\w\-]+(\=("|')[^"']*(\11))?)*>([^<]+)/i)
					?.[13]
					?.trim()
					?.replace(/&quot;/g, `"`)
					?.replace(/&lt;/g, "<")
					?.replace(/&gt;/g, ">");

				const subsiteSidebar = page
					.match(/<[\w]+(\s+[\w\-]+(\=("|')[^"']*(\3))?)*\sair-module="module.subsiteSidebar"(\s+[\w\-]+(\=("|')[^"']*(\7))?)*>\s*<textarea(\s+[\w\-]+(\=("|')[^"']*(\11))?)*>([^<]+)/i)
					?.[13]
					?.trim()
					?.replace(/&quot;/g, `"`)
					?.replace(/&lt;/g, "<")
					?.replace(/&gt;/g, ">");


				const subsiteDataFromHeader = JSON.parse(subsiteHeader)?.["header"]?.["subsiteData"];
				if (!subsiteDataFromHeader) return;

				let karmaRating = subsiteDataFromHeader["karma"];

				if (karmaRating >= 10000)
					karmaRating = `${Math.floor(karmaRating / 1000)}&nbsp;${(karmaRating % 1000).toString().padStart(3, "0")}`;

				if (subsiteDataFromHeader["karma"] > 0)
					karmaRating = "+" + karmaRating;
				else if (subsiteDataFromHeader["karma"] < 0)
					karmaRating = "-" + karmaRating;


				const countersFromSubsiteSidebar = JSON.parse(subsiteSidebar)?.["counters"];
				if (!countersFromSubsiteSidebar) return;

				const { subscribers, subscriptions } = countersFromSubsiteSidebar;


				LocalPlaceBatch(karmaRating, subscribers, subscriptions);

				SetCookie("s42_lastkarmaandsub", `${karmaRating}|${subscribers}|${subscriptions}`, DEFAULT_COOKIES_OPTIONS);
			})
			.catch(console.warn);
		};


		const lastKarmaAndSubs = GetCookie("s42_lastkarmaandsub");

		if (lastKarmaAndSubs) {
			const [lastKarma, lastSubscribers, lastSubscriptions] = lastKarmaAndSubs.split("|");

			LocalPlaceBatch(lastKarma, lastSubscribers, lastSubscriptions);
		};


		if (windowLoaded)
			setTimeout(LocalFetch, 2e3);
		else
			window.addEventListener("load", () =>
				setTimeout(LocalFetch, 2e3)
			);
	});
};


GlobalWaitForElement("document.body").then(() => SetStatsDash());
GlobalWaitForElement(".sidebar-tree-list-item").then(() => GlobalBadgeProcedure());
GlobalWaitForElement(`[data-error-code="404"], [data-error-code="403"], .l-entry__header`)
.then(() => GlobalFavouriteMarketProcedure());


window.addEventListener("load", () => {
	windowLoaded = true;
	GR(GEBI("custom_subsite_css"));

	GlobalWaitForElement("#writing-typograph").then(() => {
		GEBI("writing-typograph").childNodes[0].setAttribute("fill", SITES_COLORS[window.location.hostname]);
	});

	GlobalWaitForElement("#andropov_play_default").then(() => {
		if (window.S42_DARK_THEME_ENABLED) {
			const svgSymbol = GEBI("andropov_play_default");
				  svgSymbol.childNodes[0].setAttribute("fill", "rgba(50,50,50,0.7)");
				  svgSymbol.childNodes[1].setAttribute("fill", SITES_COLORS[window.location.hostname]);

			const svgBriefcaseSymbol = GEBI("ui_briefcase");
				  svgBriefcaseSymbol.childNodes[0].setAttribute("stroke", SITES_COLORS[window.location.hostname]);
				  svgBriefcaseSymbol.childNodes[1].setAttribute("stroke", SITES_COLORS[window.location.hostname]);
		};
	});
});


GlobalWaitForElement("document.body").then(() =>
	document.addEventListener("DOMSubtreeModified", () => {
		GR(GEBI("custom_subsite_css"));

		if (GetCookie("s42_filter") !== "0")
			GlobalFilterProcedure();
	})
);