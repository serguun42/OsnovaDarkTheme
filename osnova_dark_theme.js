// ==UserScript==
// @name         Osnova Dark Theme
// @website      https://serguun42.ru/
// @version      7.2.3-R (2020-06-17)
// @author       serguun42
// @icon         https://tjournal.ru/static/build/tjournal.ru/favicons/favicon.ico
// @match        https://tjournal.ru/*
// @match        https://dtf.ru/*
// @match        https://vc.ru/*
// @match        https://instagram.com/*
// @match        https://www.instagram.com/*
// @updateURL    https://serguun42.ru/tampermonkey/osnova_dark_theme.js
// @downloadURL  https://serguun42.ru/tampermonkey/osnova_dark_theme.js
// @run-at       document-start
// @grant        none
// @description  The best users' dark theme for TJ, vc.ru, DTF. Custom subthemes and more!
// ==/UserScript==





const
	SITE = window.location.hostname.split(".")[0],
	RESOURCES_DOMAIN = "serguun42.ru",
	ALL_ADDITIONAL_MODULES = [
		{
			name: "ultra_dark",
			default: false,
			dark: true
		},
		{
			name: "deep_blue",
			default: false,
			dark: true
		},
		{
			name: "covfefe",
			default: false,
			dark: true
		},
		{
			name: "monochrome",
			default: false,
			light: true
		},
		{
			name: "material",
			default: true
		},
		{
			name: "columns",
			default: false
		},
		{
			name: "gay",
			default: false
		}
	],
	SITES_COLOR = {
		"tjournal.ru": "#E8A427",
		"dtf.ru": "#66D7FF",
		"vc.ru": "#E25A76"
	};



const L = function(arg) {
	if (RESOURCES_DOMAIN === "localhost") console.log(...arguments);
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
		if (document.querySelector(iKey)) return Promise.resolve(document.querySelector(iKey));

		return new Promise((resolve) => {
			let interval = setInterval(() => {
				if (document.querySelector(iKey)) {
					clearInterval(interval);
					resolve(document.querySelector(iKey));
				};
			}, 50);
		});
	};
};

if (window.location.hostname === "instagram.com" || window.location.hostname === "www.instagram.com") {
	let instDarkThemeEnabled = window.location.search.match(/s42-inst-dark-theme=true/i);


	if (instDarkThemeEnabled) {
		if (/\/embed/.test(window.location.pathname)) {
			if (document.body) document.body.style.background = "transparent";
			if (document.querySelector("html")) document.querySelector("html").style.background = "transparent";

			GlobalWaitForElement("document.body").then(() => {
				document.head.appendChild(document.createElement("style")).innerHTML = `
					html, body {
						background: transparent !important;
					}

					.Embed .Header .UsernameText {
						color: #E1E1E1 !important;
					}

					.Embed a {
						color: #E1E1E1 !important;
					}

					.PrimaryCTA, .HoverCard .HoverCardRoot {
						background-color: transparent !important;
					}

					.PrimaryCTA {
						border-bottom: 1px solid #555555;
					}

					.HoverCard:hover .HoverCardRoot {
						background-color: #333333 !important;
					}

					.HoverCardUserName .Username {
						color: #E1E1E1 !important;
					}

					.Feedback .Likes, .Feedback .Comments, .Feedback .Share, .Feedback .Save {
						filter: brightness(5);
					}

					.Footer {
						border-top: 1px solid #555555;
					}

					.Footer .Glyph .Sprite {
						filter: invert(0.7);
					}
				`;

				GlobalWaitForElement("html").then((html) => {
					document.body.style.background = "transparent";
					html.style.background = "transparent";
				});
			});
		};
	};

	return false;
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
 * @param {HTMLElement} iElem
 * @returns {void}
 */
const GlobalRemove = iElem => {
	if (iElem instanceof HTMLElement)
		(iElem.parentElement || iElem.parentNode).removeChild(iElem);
};

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


	GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${SITE}.css`, "site");
	GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_${iNightMode ? "dark" : "light"}.css`, "osnova");

	if (iNightMode) {
		GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${SITE}_dark.css`, "site");

		GlobalWaitForElement(`meta[name="theme-color"]`).then(() =>
			document.querySelector(`meta[name="theme-color"]`).setAttribute("content", "#232323")
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

		GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_${addon.name}.css`, "additional");
	});
};

/** @type {Object.<string, HTMLElement>} */
let CUSTOM_ELEMENTS = new Object();
window.CUSTOM_ELEMENTS = CUSTOM_ELEMENTS;

/**
 * @param {String} iModuleName
 * @param {Boolean} iStatus
 * @param {Boolean} [iWithoutPrefix=false]
 */
const ManageModule = (iModuleName, iStatus, iWithoutPrefix = false) => {
	let moduleKey = `https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_${iModuleName}.css`;
	if (iWithoutPrefix)
		moduleKey = `https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${iModuleName}.css`;

	if (CUSTOM_ELEMENTS[moduleKey] && !iStatus) {
		GlobalRemove(CUSTOM_ELEMENTS[moduleKey]);
		delete CUSTOM_ELEMENTS[moduleKey];
	} else if (!CUSTOM_ELEMENTS[moduleKey] && iStatus) {
		GlobalAddStyle(moduleKey);
	};
};

/**
 * @param {String} iLink
 * @param {String} [iDataFor]
 */
const GlobalAddStyle = (iLink, iDataFor = false) => {
	let stylesNode = document.createElement("link");
		stylesNode.setAttribute("data-author", "serguun42");
		
	if (iDataFor)
		stylesNode.setAttribute("data-for", iDataFor);
	else
		stylesNode.setAttribute("data-for", "site");


		stylesNode.setAttribute("rel", "stylesheet");
		stylesNode.setAttribute("href", iLink);


	GlobalWaitForElement("document.body").then(() => {
		document.body.appendChild(stylesNode);
		window.CUSTOM_ELEMENTS[iLink] = stylesNode;
	});
};

/**
 * @param {String} iLink
 * @param {String} [iDataFor]
 */
const GlobalAddScript = (iLink, iDataFor = false) => {
	let scriptNode = document.createElement("script");
		scriptNode.setAttribute("data-author", "serguun42");
		
	if (iDataFor)
		scriptNode.setAttribute("data-for", iDataFor);
	else
		scriptNode.setAttribute("data-for", "site");


	scriptNode.setAttribute("src", iLink);



	GlobalWaitForElement("document.body").then((body) => {
		document.body.appendChild(scriptNode);
		window.CUSTOM_ELEMENTS[iLink] = scriptNode;
	});
};

const SetCookie = (iName, iValue, iOptions) => {
	let cCookie = iName + "=" + encodeURIComponent(iValue);

	if (typeof iOptions !== "object") iOptions = new Object();

	if (iOptions.infinite)
		cCookie += ";expires=" + new Date(new Date().getTime() + 1e11).toUTCString();
	else if (iOptions.erase)
		cCookie += ";expires=" + new Date(-1).toUTCString();


	for (let key in iOptions) {
		if (iOptions[key])
			cCookie += `;${key}=${iOptions[key]}`;
		else
			cCookie += ";" + key;
	};

	document.cookie = cCookie;
};

const GetCookie = iName => {
	let matches = document.cookie.match(new RegExp("(?:^|; )" + iName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

const GlobalPlaceEditorialButton = () => {
	GlobalWaitForElement(".sidebar__tree-list__item:nth-of-type(2)").then(() => {
		const
			sidebarLinkToNew = document.querySelector(".sidebar__tree-list__item:nth-of-type(2)"),
			sidebarLinkToNewName = sidebarLinkToNew.querySelector(".sidebar__tree-list__item__name"),
			list = document.querySelector(".sidebar__tree-list"),
			ratingButton = document.querySelector(`.sidebar__tree-list__item[href="/rating"]`);


		let parentTags = {},
			childTags = {};

		sidebarLinkToNew.getAttributeNames().forEach((tag) =>
			parentTags[tag] = sidebarLinkToNew.getAttribute(tag)
		);

		sidebarLinkToNewName.getAttributeNames().forEach((tag) =>
			childTags[tag] = sidebarLinkToNewName.getAttribute(tag)
		);


		parentTags["href"] = "/editorial";
		parentTags["class"] = (parentTags["class"] || "").replace("sidebar__tree-list__item--active", "");


		let editorialButton = document.createElement("a");
			editorialButton.id = "s42-editorial-link-btn";
			Object.keys(parentTags).forEach((tag) => editorialButton.setAttribute(tag, parentTags[tag]));

		let editorialButtonInner = document.createElement("p");
			Object.keys(childTags).forEach((tag) => editorialButtonInner.setAttribute(tag, childTags[tag]));
			editorialButtonInner.innerText = "От редакции";

		editorialButton.appendChild(editorialButtonInner);
		list.appendChild(editorialButton);



		document.querySelectorAll(".sidebar__tree-list__item").forEach((sidebarLink) =>
			sidebarLink.addEventListener("click", (e) => {
				if (/^\/rating/i.test(sidebarLink.getAttribute("href")) || /^\/editorial/i.test(sidebarLink.getAttribute("href"))) {
					document.querySelectorAll(".sidebar__tree-list__item").forEach((otherSidebarLink) =>
						otherSidebarLink.classList.remove("sidebar__tree-list__item--active")
					);

					sidebarLink.classList.add("sidebar__tree-list__item--active");
				} else {
					editorialButton.classList.remove("sidebar__tree-list__item--active");
					if (ratingButton) ratingButton.classList.remove("sidebar__tree-list__item--active");
				};
			})
		);


		if (/^\/rating/i.test(window.location.pathname) && ratingButton)
			ratingButton.classList.add("sidebar__tree-list__item--active");

		if (/^\/editorial/i.test(window.location.pathname))
			editorialButton.classList.add("sidebar__tree-list__item--active");
	});
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



	GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_filter_style.css`, "osnova");
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
		document.querySelectorAll(`.content-feed[air-module="module.entry"]:not(.content-feed--s42-seen)`).forEach((feedEntry) => {
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

				let complainButton = document.createElement("a");
					complainButton.className = "content-feed__s42-message--float-right";
					complainButton.innerText = "Пожаловаться";
					complainButton.addEventListener("click", () => {
						fetch(`https://${window.location.hostname}/contents/complain`, {
							"headers": {
								"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
								"sec-fetch-dest": "empty",
								"sec-fetch-mode": "cors",
								"sec-fetch-site": "same-origin",
								"x-js-version": "b0a5e2e7",
								"x-this-is-csrf": "THIS IS SPARTA!"
							},
							"referrerPolicy": "origin",
							"body": `content_id=${complaintPostID}&user_id=${complaintUserID}&mode=raw`,
							"method": "POST",
							"mode": "cors",
							"credentials": "include"
						})
						.then((res) => res.json())
						.then(L)
						.catch(L);
					});

				hiddenMessage.appendChild(complainButton);
			};
		});


		document.querySelectorAll(`.comments__item__space:not(.comments__item__space--s42-seen)`).forEach((commentSpace) => {
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
						GlobalRemove(e.currentTarget.parentElement || e.currentTarget.parentNode);
					});

				hiddenMessage.append(hiddenMessageShow);


				let hiddenMessageSpan = document.createElement("span");
					hiddenMessageSpan.innerText = " скрыт фильтрами тем.";

				hiddenMessage.append(hiddenMessageSpan);


				commentSpace.classList.add("comments__item__space--s42-filtered");
				commentSpace.appendChild(hiddenMessage);
			};
		});
	}).catch(L);
};



if (GetCookie("s42_turn_off") === "1")
	SetMode(false);
else if (GetCookie("s42_always") === "1")
	SetMode(true);
else
	GetMode().then((mode) => SetMode(mode));



window.GetCookie = GetCookie;
window.SetCookie = SetCookie;
window.UNLOAD_COOKIES = () => {
	[
		"s42_always",
		"s42_columns",
		"s42_covfefe",
		"s42_deep_blue",
		"s42_filter",
		"s42_gay",
		"s42_karma",
		"s42_lastkarmaandsub",
		"s42_material",
		"s42_messageslinkdisabled",
		"s42_monochrome",
		"s42_qrcode",
		"s42_turn_off",
		"s42_ultra_dark",
		"s42_vbscroller",
		"s42_donate"
	].forEach((cookieName) => SetCookie(cookieName, "1", { erase: true, path: "/", domain: window.location.hostname }));
};


GlobalRemove(document.getElementById("custom_subsite_css"));


GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/mdl-switchers.css`, "osnova");
GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/material-icons.css`, "osnova");
GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/switchers.css`, "osnova");
GlobalAddScript(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/getmdl.min.js`, "osnova");



let customDataContainer = document.createElement("div");
	customDataContainer.id = "custom-data-container";

GlobalWaitForElement(".main_menu__auth").then(() => {
	document.querySelector(".main_menu__auth").after(customDataContainer);


	let switchersBtn = document.createElement("div");
		switchersBtn.innerHTML = `<i class="material-icons material-icons-round">settings</i>`;
		switchersBtn.id = "switchers-btn";
		switchersBtn.className = "mdl-js-button mdl-js-ripple-effect";
		switchersBtn.addEventListener("click", (e) => {
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
				${(!GetCookie("s42_donate") || (Date.now() - new Date(parseInt(GetCookie("s42_donate")))) > 86400 * 5 * 1e3) ? `<div class="switcher-layout__list__separator switcher-layout__list__donate"></div>
				<a class="switcher-layout__list__subheader switcher-layout__list__donate" href="https://yasobe.ru/na/dark_mode" target="_blank" style="color: ${SITES_COLOR[window.location.hostname]}; text-decoration: underline;">
					Поддержать автора в столь непростое время
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
					<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="nothing" data-serguun42-labels data-serguun42-add-dark>
						<input type="radio" id="nothing" class="mdl-radio__button" name="add-dark" value="nothing" ${(GetCookie("s42_ultra_dark") !== "1" && GetCookie("s42_deep_blue") !== "1" && GetCookie("s42_covfefe") !== "1") ? "checked" : ""} data-serguun42-switchers>
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
				<div class="switcher-layout__list__subheader">Другие дополнительные модули</div>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="material" data-serguun42-labels>
						<input type="checkbox" id="material" class="mdl-checkbox__input" ${GetCookie("s42_material") === "0" ? "" : "checked"} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Добавить оформление «Material»</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="columns" data-serguun42-labels>
						<input type="checkbox" id="columns" class="mdl-checkbox__input" ${GetCookie("s42_columns") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Прижать боковые колонки к бокам экрана</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="filter" data-serguun42-labels title="Такие как «Прошу о помощи», стихи и прочее">
						<input type="checkbox" id="filter" class="mdl-checkbox__input" ${GetCookie("s42_filter") !== "0" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Скрывать в ленте посты от ботов</span>
					</label>
				</li>
				<li class="switcher-layout__list__item" title="Gorgeous, astonishing, yummy(?)">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="gay" data-serguun42-labels>
						<input type="checkbox" id="gay" class="mdl-checkbox__input" ${GetCookie("s42_gay") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label" title="Gorgeous, astonishing, yummy(?)">Добавить оформление «G.A.Y»</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="karma" data-serguun42-labels>
						<input type="checkbox" id="karma" class="mdl-checkbox__input" ${GetCookie("s42_karma") !== "off" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Карма включена</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="editorial" data-serguun42-labels>
						<input type="checkbox" id="editorial" class="mdl-checkbox__input" ${GetCookie("s42_editorial") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Добавить кнопку «От редакции»</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="vbscroller" data-serguun42-labels>
						<input type="checkbox" id="vbscroller" class="mdl-checkbox__input" ${GetCookie("s42_vbscroller") === "1" ? "checked" : ""} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Пофиксить скроллер в левом меню (для маленьких экранов)</span>
					</label>
				</li>
				<li class="switcher-layout__list__item">
					<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="messageslinkdisabled" data-serguun42-labels>
						<input type="checkbox" id="messageslinkdisabled" class="mdl-checkbox__input" ${GetCookie("s42_messageslinkdisabled") === "0" ? "" : "checked"} data-serguun42-switchers>
						<span class="mdl-checkbox__label">Отключить кнопки «Сообщения», «Вакансии», «Компании» и «Мероприятия» в левом меню</span>
					</label>
				</li>
			</ul>`;


			let switchersContainer = document.createElement("div");
				switchersContainer.id = "switcher-layout";
				switchersContainer.style.width = 0;
				switchersContainer.style.height = 0;
				switchersContainer.style.right = (window.innerWidth - e.clientX) + "px";

			document.body.appendChild(switchersContainer);


			let switchersScroller = document.createElement("div");
				switchersScroller.id = "switcher-layout--scroller";

			switchersContainer.appendChild(switchersScroller);
			switchersScroller.innerHTML = SWITCHERS_LAYOUT;

			let switchersObfuscator = document.createElement("div");
				switchersObfuscator.id = "switcher-layout--obfuscator";
			document.body.appendChild(switchersObfuscator);



			GlobalAnimation(4e2, (iProgress) => {
				switchersContainer.style.width = iProgress * 500 + "px";
				switchersContainer.style.height = iProgress * 500 + "px";
				if (iProgress < 0.25)
					switchersContainer.style.opacity = iProgress * 4;
				else
					switchersContainer.style.opacity = 1;
			}).then(() => {
				switchersContainer.style.width = "500px";
				switchersContainer.style.height = "500px";
				switchersContainer.style.opacity = 1;
				switchersScroller.style.overflowY = "auto";
			});




			if ("componentHandler" in window) {
				componentHandler.upgradeElement(switchersBtn);
				componentHandler.upgradeElements(Array.prototype.slice.call(document.querySelectorAll("[data-serguun42-labels]")));
			};


			switchersObfuscator.addEventListener("click", () => {
				switchersScroller.style.overflowY = "hidden";

				GlobalAnimation(4e2, (iProgress) => {
					switchersContainer.style.opacity = 1 - iProgress;
				}).then(() => {
					GlobalRemove(switchersContainer);
					GlobalRemove(switchersObfuscator);
				});
			});

			switchersObfuscator.addEventListener("contextmenu", () => {
				switchersScroller.style.overflowY = "hidden";

				GlobalAnimation(4e2, (iProgress) => {
					switchersContainer.style.opacity = 1 - iProgress;
				}).then(() => {
					GlobalRemove(switchersContainer);
					GlobalRemove(switchersObfuscator);
				});

				return false;
			});



			document.querySelectorAll("[data-serguun42-switchers]").forEach((switcher) => {
				switcher.addEventListener("change", (e) => {
					if (e.currentTarget.id === "material") {
						SetCookie("s42_material", (e.currentTarget.checked ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });

						ManageModule("material", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "columns") {
						SetCookie("s42_columns", (e.currentTarget.checked ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });

						ManageModule("columns", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "filter") {
						SetCookie("s42_filter", (e.currentTarget.checked ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });

						if (e.currentTarget.checked) GlobalFilterProcedure();
					};

					if (e.currentTarget.id === "gay") {
						SetCookie("s42_gay", (e.currentTarget.checked ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });

						ManageModule("gay", e.currentTarget.checked);
					};

					if (e.currentTarget.id === "karma") {
						SetCookie("s42_karma", e.currentTarget.checked ? "on" : "off", { infinite: true, path: "/", domain: window.location.hostname });

						alert("Чтобы отключить/включить отображение кармы, перезагрузите страницу");
					};

					if (e.currentTarget.id === "editorial") {
						SetCookie("s42_editorial", e.currentTarget.checked ? "1" : "0", { infinite: true, path: "/", domain: window.location.hostname });

						if (e.currentTarget.checked) {
							GlobalPlaceEditorialButton();
						} else {
							GlobalRemove(document.getElementById("s42-editorial-link-btn"));
						};
					};

					if (e.currentTarget.id === "vbscroller") {
						SetCookie("s42_vbscroller", (e.currentTarget.checked ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });

						if (e.currentTarget.checked)
							if (confirm("Примениться после обновления страницы. Обновить сейчас?"))
								window.location.reload();
					};

					if (e.currentTarget.id === "messageslinkdisabled") {
						SetCookie("s42_messageslinkdisabled", (e.currentTarget.checked ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });

						if (e.currentTarget.checked) {
							if (document.querySelector(`.sidebar__tree-list__item[href="/m"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/m"]`).style.display = "none";
							if (document.querySelector(`.sidebar__tree-list__item[href="/job"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/job"]`).style.display = "none";
							if (document.querySelector(`.sidebar__tree-list__item[href="/companies_new"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/companies_new"]`).style.display = "none";
							if (document.querySelector(`.sidebar__tree-list__item[href="/companies/new"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/companies/new"]`).style.display = "none";
							if (document.querySelector(`.sidebar__tree-list__item[href="/companies"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/companies"]`).style.display = "none";
							if (document.querySelector(`.sidebar__tree-list__item[href="/events"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/events"]`).style.display = "none";
						} else {
							if (document.querySelector(`.sidebar__tree-list__item[href="/m"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/m"]`).style.display = "";
							if (document.querySelector(`.sidebar__tree-list__item[href="/job"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/job"]`).style.display = "";
							if (document.querySelector(`.sidebar__tree-list__item[href="/companies_new"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/companies_new"]`).style.display = "";
							if (document.querySelector(`.sidebar__tree-list__item[href="/companies/new"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/companies/new"]`).style.display = "";
							if (document.querySelector(`.sidebar__tree-list__item[href="/companies"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/companies"]`).style.display = "";
							if (document.querySelector(`.sidebar__tree-list__item[href="/events"]`))
								document.querySelector(`.sidebar__tree-list__item[href="/events"]`).style.display = "";
						};
					};

					if (e.currentTarget.getAttribute("name") === "add-dark") {
						SetCookie("s42_ultra_dark", (e.currentTarget.value === "ultra_dark" ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });
						SetCookie("s42_deep_blue", (e.currentTarget.value === "deep_blue" ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });
						SetCookie("s42_covfefe", (e.currentTarget.value === "covfefe" ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });

						if (
							e.currentTarget.value === "ultra_dark" ||
							e.currentTarget.value === "deep_blue" ||
							e.currentTarget.value === "covfefe"
						) {
							if (
								GetCookie("s42_turn_off") && parseInt(GetCookie("s42_turn_off")) ||
								(!GetMode(true) && GetCookie("s42_always") !== "1" && GetCookie("s42_turn_off") !== "1")
							) {
								document.querySelector(`[for="always"]`).classList.add("is-checked");
								document.querySelector(`[value="always"]`).checked = true;
								document.querySelector(`[for="turn_off"]`).classList.remove("is-checked");
								document.querySelector(`[value="turn_off"]`).checked = false;
								document.querySelector(`[for="usual"]`).classList.remove("is-checked");
								document.querySelector(`[value="usual"]`).checked = false;

								SetCookie("s42_always", "1", { infinite: true, path: "/", domain: window.location.hostname });
								SetCookie("s42_turn_off", "0", { infinite: true, path: "/", domain: window.location.hostname });

								ManageModule("monochrome", false);
								ManageModule("dark", true);
								ManageModule(`${SITE}_dark`, true, true);
								ManageModule("light", false);
							};
						};

						ManageModule("ultra_dark", e.currentTarget.value === "ultra_dark");
						ManageModule("deep_blue", e.currentTarget.value === "deep_blue");
						ManageModule("covfefe", e.currentTarget.value === "covfefe");
					};

					if (e.currentTarget.getAttribute("name") === "add-light") {
						SetCookie("s42_monochrome", (e.currentTarget.value === "monochrome" ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });

						if (
							e.currentTarget.value === "monochrome"
						) {
							if (
								GetCookie("s42_turn_off") !== "1" || GetMode(true)
							) {
								document.querySelector(`[for="always"]`).classList.remove("is-checked");
								document.querySelector(`[value="always"]`).checked = false;
								document.querySelector(`[for="turn_off"]`).classList.add("is-checked");
								document.querySelector(`[value="turn_off"]`).checked = true;
								document.querySelector(`[for="usual"]`).classList.remove("is-checked");
								document.querySelector(`[value="usual"]`).checked = false;

								SetCookie("s42_always", "0", { infinite: true, path: "/", domain: window.location.hostname });
								SetCookie("s42_turn_off", "1", { infinite: true, path: "/", domain: window.location.hostname });


								ManageModule("ultra_dark", false);
								ManageModule("deep_blue", false);
								ManageModule("covfefe", false);
								ManageModule("dark", false);
								ManageModule(`${SITE}_dark`, false, true);
								ManageModule("light", true);
							};
						};

						ManageModule("monochrome", e.currentTarget.value === "monochrome");
					};

					if (e.currentTarget.getAttribute("name") === "time") {
						SetCookie("s42_always", (e.currentTarget.value === "always" ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });
						SetCookie("s42_turn_off", (e.currentTarget.value === "turn_off" ? 1 : 0).toString(), { infinite: true, path: "/", domain: window.location.hostname });


						document.querySelector(`[for="ultra_dark"]`).classList.remove("is-checked");
						document.querySelector(`[value="ultra_dark"]`).checked = false;
						document.querySelector(`[for="deep_blue"]`).classList.remove("is-checked");
						document.querySelector(`[value="deep_blue"]`).checked = false;
						document.querySelector(`[for="covfefe"]`).classList.remove("is-checked");
						document.querySelector(`[value="covfefe"]`).checked = false;
						document.querySelector(`[for="nothing"]`).classList.add("is-checked");
						document.querySelector(`[value="nothing"]`).checked = true;


						ManageModule("ultra_dark", false);
						ManageModule("deep_blue", false);
						ManageModule("covfefe", false);
						ManageModule("monochrome", false);


						if (e.currentTarget.value === "always") {
							ManageModule("dark", true);
							ManageModule(`${SITE}_dark`, true, true);
							ManageModule("light", false);

							["ultra_dark", "deep_blue", "covfefe"].forEach((addDarkModuleName) => {
								if (GetCookie("s42_" + addDarkModuleName) === "1") {
									ManageModule(addDarkModuleName, true);

									document.querySelector(`[for="${addDarkModuleName}"]`).classList.add("is-checked");
									document.querySelector(`[value="${addDarkModuleName}"]`).checked = true;
									document.querySelector(`[for="nothing"]`).classList.remove("is-checked");
									document.querySelector(`[value="nothing"]`).checked = false;
								};
							});
						} else if (e.currentTarget.value === "turn_off") {
							ManageModule("dark", false);
							ManageModule(`${SITE}_dark`, false, true);
							ManageModule("light", true);
						} else {
							GetMode().then((iNightMode) => {
								if (iNightMode) {
									document.querySelector(`meta[name="theme-color"]`).setAttribute("content", "#232323");
									ManageModule("dark", true);
									ManageModule(`${SITE}_dark`, true, true);
									ManageModule("light", false);

									["ultra_dark", "deep_blue", "covfefe"].forEach((addDarkModuleName) => {
										if (GetCookie("s42_" + addDarkModuleName) === "1") {
											ManageModule(addDarkModuleName, true);

											document.querySelector(`[for="${addDarkModuleName}"]`).classList.add("is-checked");
											document.querySelector(`[value="${addDarkModuleName}"]`).checked = true;
											document.querySelector(`[for="nothing"]`).classList.remove("is-checked");
											document.querySelector(`[value="nothing"]`).checked = false;
										};
									});
								} else {
									document.querySelector(`meta[name="theme-color"]`).setAttribute("content", SITES_COLOR[window.location.hostname]);
									ManageModule("dark", false);
									ManageModule(`${SITE}_dark`, false, true);
									ManageModule("light", true);
								};
							});
						};
					};
				});
			});

			document.querySelectorAll(".switcher-layout__list__donate").forEach((donatePromoteElem) => {
				donatePromoteElem.addEventListener("click", () => {
					SetCookie("s42_donate", Date.now().toString(), { infinite: true, path: "/", domain: window.location.hostname });


					document.querySelectorAll(".switcher-layout__list__donate").forEach((donatePromoteElemToHide, donatePromoteElemToHideIndex) => {
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
							GlobalRemove(donatePromoteElemToHide);
						});
					});
				})
			});
		});

	customDataContainer.appendChild(switchersBtn);
});



if (GetCookie("s42_messageslinkdisabled") !== "0") {
	GlobalWaitForElement(".sidebar").then(() => {
		if (document.querySelector(`.sidebar__tree-list__item[href="/m"]`))
			document.querySelector(`.sidebar__tree-list__item[href="/m"]`).style.display = "none";
		if (document.querySelector(`.sidebar__tree-list__item[href="/job"]`))
			document.querySelector(`.sidebar__tree-list__item[href="/job"]`).style.display = "none";
		if (document.querySelector(`.sidebar__tree-list__item[href="/companies_new"]`))
			document.querySelector(`.sidebar__tree-list__item[href="/companies_new"]`).style.display = "none";
		if (document.querySelector(`.sidebar__tree-list__item[href="/companies/new"]`))
			document.querySelector(`.sidebar__tree-list__item[href="/companies/new"]`).style.display = "none";
		if (document.querySelector(`.sidebar__tree-list__item[href="/companies"]`))
			document.querySelector(`.sidebar__tree-list__item[href="/companies"]`).style.display = "none";
		if (document.querySelector(`.sidebar__tree-list__item[href="/events"]`))
			document.querySelector(`.sidebar__tree-list__item[href="/events"]`).style.display = "none";
	});
};

if (GetCookie("s42_editorial") === "1") {
	GlobalPlaceEditorialButton();
};




const GlobalCacheProcedure = () => {
	if (!(SITE === "tjournal" || SITE === "dtf")) return;


	let lastURL = "";

	setInterval(() => {
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
			if (cURL.length < 2) return;

			id = parseInt(cURL[1]);
			if (isNaN(id)) return;
		};



		GlobalWaitForElement(`[data-error-code="404"], .layout--entry`).then((postElement) => {
			if (!postElement) return;
			if (postElement.classList.contains("layout--entry")) return;


			let errorMessage = document.querySelector(".page--error .error__message");

			if (errorMessage) {
				fetch(`https://serguun42.ru/tj?check-for-presence&site=${SITE === "tjournal" ? "tj" : "dtf"}&id=${id}`)
				.then((res) => {
					if (res.status === 200)
						return res.text();
					else
						return Promise.reject(`Status code <${res.status}> | "${res.statusText}"`);
				})
				.then((text) => {
					if (parseInt(text) !== id) return Promise.reject(`Ids don't match`);


					GlobalRemove(document.querySelector(".error__ico"));


					errorMessage.innerHTML = errorMessage.innerHTML.trim() + `. Или найдена? 🤔<br>Конечно же да!<br><a class="s42-404-error-cached-post-button" href="https://serguun42.ru/tj?site=${SITE === "tjournal" ? "tj" : "dtf"}&id=${id}" target="_blank">Смотри вот эту страницу</a> – там закэширован этот пост. И, скорее всего, даже есть комментарии!`;
					errorMessage.style.paddingLeft = "0";


					document.querySelector(".error__code").style.paddingLeft = "0";
					document.querySelector(".error__code").style.textAlign = "center";
				})
				.catch(L);
			};
		});
	}, 200);
};

const GlobalInstagramProcedure = () => {
	let lastURL = "";

	setInterval(() => {
		if (lastURL === window.location.pathname) return;
		if (document.querySelector(".main_progressbar--in_process")) return;

		lastURL = window.location.pathname;


		/* Actual Instagram Frames Procedure */
		GlobalWaitForElement(`[data-error-code="404"], .layout--entry`).then((postElement) => {
			if (!postElement) return;
			if (!postElement.classList.contains("layout--entry")) return;


			postElement.querySelectorAll("iframe").forEach((iframe) => {
				let src = iframe.getAttribute("src"),
					search = "";

				try {
					search = new URL(src).search;
				} catch (e) {
					return console.warn(e);
				};


				let instDarkThemeEnabled = false;


				if (GetCookie("s42_turn_off") === "1")
					instDarkThemeEnabled = false;
				else if (GetCookie("s42_always") === "1")
					instDarkThemeEnabled = true;
				else if (GetMode(true))
					instDarkThemeEnabled = true;


				if (instDarkThemeEnabled) {
					if (!search.match(/s42-inst-dark-theme=true/i))
						iframe.setAttribute("src", `${src}${search ? "&" : "?"}s42-inst-dark-theme=true`);	
				};
			});
		});
	}, 200);
};




const SetStatsDash = () => {
	GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/final.css?id=${((window.__delegated_data || {})["module.auth"] || {})["id"] || "-723"}&name=${encodeURIComponent(((window.__delegated_data || {})["module.auth"] || {})["name"] || "Семь два три")}&site=${SITE}&version=7.2.3`, "osnova");


	if (GetCookie("s42_karma") === "off") return false;


	const userID = document.querySelector(".main_menu__auth__logged_in").getAttribute("href").replace(/[^\d]/g, "");

	const LocalFetch = () => {
		fetch(`/u/${userID}`)
		.then((res) => {
			if (res.status === 200)
				return res.text();
			else
				return Promise.reject(503);
		})
		.then((page) => {
			let karma = page.match(/class=\"[^"]*subsite_head__karma[^"]*\"(\s[\w-]+=\"[^"]*\")*>([^<]*)</),
				subs = page.match(/class=\"[^"]*subscribers_widget__count[^"]*\"(\s[\w-]+=\"[^"]*\")*>([^<]*)</);

			if (!(subs && subs[2] && typeof subs[2] == "string" && !isNaN(parseInt(subs[2].trim())))) subs = [0, 0, "0"];

			if (karma && karma[2]) {
				if (document.getElementById("main_menu__auth__stats")) {
					document.getElementById("main_menu__auth__stats").innerHTML =
						`<span>${karma[2]}&nbsp;|&nbsp;<i class="material-icons material-icons-round">how_to_reg</i>&nbsp;${parseInt(subs[2].trim())}`;
				} else {
					let statsDash = document.getElementById("main_menu__auth__stats") || document.createElement("div");
						statsDash.id = "main_menu__auth__stats";
						statsDash.innerHTML = `<span>${karma[2]}&nbsp;|&nbsp;<i class="material-icons material-icons-round">how_to_reg</i>&nbsp;${parseInt(subs[2].trim())}`;

					customDataContainer.prepend(statsDash);
				};

				SetCookie("s42_lastkarmaandsub", `${karma[2]}|${parseInt(subs[2].trim())}`, { infinite: true, path: "/", domain: window.location.hostname });
			};
		})
		.catch(L);
	};


	let lastKarmaAndSubs = GetCookie("s42_lastkarmaandsub");

	if (lastKarmaAndSubs) {
		let statsDash = document.createElement("div");
			statsDash.id = "main_menu__auth__stats";
			statsDash.innerHTML = `<span>${lastKarmaAndSubs.split("|")[0]}&nbsp;|&nbsp;<i class="material-icons material-icons-round">how_to_reg</i>&nbsp;${lastKarmaAndSubs.split("|")[1]}`;

		customDataContainer.prepend(statsDash);

		LocalFetch();
	} else
		LocalFetch();
};

window.addEventListener("load", () => {
	SetStatsDash();
	GlobalCacheProcedure();
	GlobalInstagramProcedure();

	GlobalRemove(document.getElementById("custom_subsite_css"));


	document.getElementById("writing-typograph").childNodes[0].setAttribute("fill", SITES_COLOR[window.location.hostname]);


	if (GetCookie("s42_vbscroller") === "1") {
		document.querySelectorAll("style").forEach((styleNode) => {
			let css = styleNode.innerHTML;

			if (css.indexOf(".sidebar .vb-content") > -1)
				styleNode.innerHTML = css.replace(/\.sidebar\s+\.vb-content(\[([\w\d\-]+)\])?\s+\{(\n|\s|[^\}])+\}(\n|\s)*/i, "");
		});
	};

	if (GetCookie("s42_filter") !== "0") {
		GlobalFilterProcedure();
	};
});



GlobalWaitForElement("document.body").then(() =>
	document.addEventListener("DOMSubtreeModified", () => {
		GlobalRemove(document.getElementById("custom_subsite_css"));

		if (GetCookie("s42_filter") !== "0")
			GlobalFilterProcedure();
	})
);