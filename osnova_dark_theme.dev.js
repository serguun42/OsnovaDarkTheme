// ==UserScript==
// @name         Osnova Dark Theme
// @website      https://tjournal.ru/tag/darktheme
// @version      10.0.1-A (2021-12-06)
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





const
	SITE = (window.location.hostname.search("k8s.osnova.io") > -1 && window.location.hostname.split(".")[0] === "tj") ? "tjournal" : window.location.hostname.split(".")[0],
	RESOURCES_DOMAIN = "serguun42.ru",
	VERSION = "10.0.1",
	ALL_ADDITIONAL_MODULES = [
		{
			name: "ultra_dark",
			title: "Ultra Dark",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "deep_blue",
			title: "Deep Blue",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "covfefe",
			title: "Covfefe",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "blackchrome",
			title: "Black Monochrome",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "vampire",
			title: "«Кроваво-чёрное ничто»",
			default: false,
			dark: true,
			priority: 4
		},
		{
			name: "monochrome",
			title: "Monochrome",
			default: false,
			light: true,
			priority: 4
		},


		{
			name: "stars_in_editor",
			title: "Вернуть в редактор быстрые действия: вывод в ленту, якоря, скрытие блоков и т.п",
			default: false,
			priority: 5
		},
		{
			name: "previous_editor",
			title: "Старое оформление редактора постов",
			default: false,
			priority: 5
		},
		{
			name: "hide_feed_top_mini_editor",
			title: "Скрыть мини-редактор в начале ленты",
			default: false,
			priority: 5
		},


		{
			name: "hidesubscriptions",
			title: "Скрыть кнопку подписок",
			default: false,
			priority: 5
		},
		{
			name: "hideentriesbadge",
			title: "Скрыть индикатор новых записей",
			default: false,
			priority: 5
		},
		{
			name: "beautifulfeedposts",
			title: "Кнопки оценки постов без теней",
			default: true,
			priority: 5
		},
		{
			name: "gray_signs",
			title: "Серые оценки у постов и комментариев",
			default: false,
			priority: 5
		},
		{
			name: "hide_likes",
			title: "Спрятать все оценки и поля ввода",
			default: false,
			priority: 6
		},
		{
			name: "add_possession_choice",
			title: "Отображать меню выбора между профилем и модерируемыми подсайтами в поле ввода комментария (β)",
			default: false,
			priority: 5
		},
		{
			name: "favouritesicon",
			title: "Красная иконка закладок",
			default: true,
			priority: 5
		},
		{
			name: "material",
			title: "Добавить оформление «Material»",
			default: true,
			priority: 5
		},
		{
			name: "columns_narrow",
			title: "Прижать боковые колонки к центру экрана",
			default: false,
			priority: 5
		},
		{
			name: "verified",
			title: "Добавить галочки всем пользователям",
			default: false,
			priority: 6
		},


		{
			name: "no_themes",
			title: "Не применять никакие темы никогда",
			default: false,
			priority: 1
		},
		{
			name: "com_rules",
			title: "Отключить рекламу",
			default: true,
			priority: 0
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
	ADDITIONAL_DARK_MODULES_NAMES = ALL_ADDITIONAL_MODULES.filter((module) => !!module.dark).map((module) => module.name),
	ADDITIONAL_LIGHT_MODULES_NAMES = ALL_ADDITIONAL_MODULES.filter((module) => !!module.light).map((module) => module.name),
	SITES_COLORS = {
		"tjournal.ru": "#E8A427",
		"dtf.ru": "#66D7FF",
		"vc.ru": "#E25A76"
	};

/**
 * Query selector
 * 
 * @param {string} query
 * @returns {HTMLElement}
 */
const QS = query => document.querySelector(query);

/**
 * Query selector all
 * 
 * @param {string} query
 * @returns {HTMLElement[]}
 */
const QSA = query => Array.from(document.querySelectorAll(query));

/**
 * Get element by ID
 * 
 * @param {string} query
 * @returns {HTMLElement}
 */
const GEBI = query => document.getElementById(query);

/**
 * Remove element
 * 
 * @param {HTMLElement} elem
 * @returns {void}
 */
const GR = elem => elem?.remove?.();



/**
 * @typedef {Object} ObserverQueueType
 * @property {string} [tag]
 * @property {string} [id]
 * @property {string} [className]
 * @property {{name: string, value: string}} [attribute]
 * @property {ObserverQueueType} [parent]
 * @property {(foundElem: HTMLElement) => void} resolver
 */
/** @type {ObserverQueueType[]} */
const observerQueue = [];

const mainObserber = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		const { addedNodes, removedNodes, target, nextSibling, previousSibling } = mutation;
		const mutatedNodes = [...addedNodes, ...removedNodes, target, nextSibling, previousSibling];


		/**
		 * @param {ObserverQueueType} waitingElemSelector
		 * @param {HTMLElement} addedNode
		 * @returns {boolean}
		 */
		const LocalCheckNode = (waitingElemSelector, addedNode, iParent) => {
			if (!(addedNode instanceof HTMLElement)) return false;

			let atLeastOneMatch = false;

			if (waitingElemSelector.tag) {
				if (waitingElemSelector.tag === addedNode.tagName.toLowerCase())
					atLeastOneMatch = true;
				else
					return false;
			}

			if (waitingElemSelector.id) {
				if (waitingElemSelector.id === addedNode.id)
					atLeastOneMatch = true;
				else
					return false;
			}

			if (waitingElemSelector.className && waitingElemSelector.className) {
				if (addedNode.classList.contains(waitingElemSelector.className))
					atLeastOneMatch = true;
				else
					return false;
			}

			if (waitingElemSelector.attribute && waitingElemSelector.attribute.name) {
				const gotAttribute = addedNode.getAttribute(waitingElemSelector.attribute.name);

				if (gotAttribute === waitingElemSelector.attribute.value)
					atLeastOneMatch = true;
				else
					return false;
			}

			if (!atLeastOneMatch) return false;

			if (waitingElemSelector.parent) {
				const parentCheck = LocalCheckNode(waitingElemSelector.parent, addedNode.parentElement || addedNode.parentNode, 1);
				return parentCheck;
			} else
				return true;
		};


		observerQueue.forEach((waitingElemSelector, waitingElemIndex, waitingElemsArr) => {
			const foundNode = Array.from(mutatedNodes).find((addedNode) => LocalCheckNode(waitingElemSelector, addedNode));

			if (foundNode && waitingElemSelector.resolver) {
				waitingElemSelector.resolver(foundNode);
				waitingElemsArr.splice(waitingElemIndex, 1);
			}
		});
	});
});

mainObserber.observe(document, {
	childList: true,
	subtree: true,
	attributes: false,
	characterData: false
});

let createdIntervals = 0,
	deletedIntervals = 0;

/**
 * @param {() => void} iCallback
 * @param {number} iDelay
 * @returns {number}
 */
const GlobalSetInterval = (iCallback, iDelay) => {
	if (!iCallback || !iDelay) return -1;

	++createdIntervals;
	return setInterval(iCallback, iDelay);
}

/**
 * @param {number} iIntervalID
 */
const GlobalClearInterval = iIntervalID => {
	if (iIntervalID < 0) return;

	try {
		clearInterval(iIntervalID);
		++deletedIntervals;
	} catch (e) {
		console.warn(e);
	}
}

/**
 * @param {string | ObserverQueueType} iKey
 * @param {false | Promise} [iWaitAlways=false]
 * @returns {Promise<HTMLElement>}
 */
const GlobalWaitForElement = (iKey, iWaitAlways = false) => {
	if (typeof iKey == "object" && iKey.parent)
		return new Promise((resolve) => {
			observerQueue.push({
				...iKey,
				resolver: resolve
			});
		});


	if (typeof iKey !== "string") return Promise.resolve(null);

	const existing = QS(iKey);
	if (existing) return Promise.resolve(existing);


	/**
	 * @param {string} iQuery
	 * @returns {Promise<HTMLElement>}
	 */
	const LocalWaitUntilSignleElem = (iQuery) => {
		const tagName = iQuery.split(/#|\.|\[/)[0],
			  id = iQuery.match(/#([\w\-]+)/i)?.[1],
			  className = iQuery.match(/\.([\w\-]+(\.[\w\-]+)*)/)?.[1],
			  attributeMatch = iQuery.match(/\[([\w\-]+)\=\"([^\"]+)\"\]/i) || [];5

		/** @type {ObserverQueueType} */
		const selectorForQueue = {};
		if (tagName) selectorForQueue.tag = tagName;
		if (id) selectorForQueue.id = id;
		if (className) selectorForQueue.className = className;
		if (attributeMatch[1] && attributeMatch[2]) selectorForQueue.attribute = { name: attributeMatch[1], value: attributeMatch[2] };


		return new Promise((resolve) => {
			observerQueue.push({
				...selectorForQueue,
				resolver: resolve
			});


			setTimeout(() => {
				const foundQueueItemIndex = observerQueue.findIndex(({resolver}) => resolver === resolve);

				if (foundQueueItemIndex < 0) return;

				observerQueue.splice(foundQueueItemIndex, 1);

				let intervalCounter = 0;
				const backupInterval = GlobalSetInterval(() => {
					const found = QS(iQuery);

					if (found) {
						GlobalClearInterval(backupInterval);
						return resolve(found);
					}

					if (++intervalCounter > 50 && !iWaitAlways) {
						GlobalClearInterval(backupInterval);
						return resolve(null);
					}

					if (iWaitAlways && iWaitAlways instanceof Promise)
						iWaitAlways.then(() => {
							GlobalClearInterval(backupInterval);
							return resolve(null);
						}).catch(console.warn);
				}, 300);
			}, 1e3);
		});
	};


	return Promise.race(iKey.split(", ").map(LocalWaitUntilSignleElem));
};

/**
 * @callback AnimationStyleSettingFunc
 * @param {number} iProgress
 */
/**
 * @param {number} iDuration
 * @param {AnimationStyleSettingFunc} iStyleSettingFunc - Function for setting props by progress
 * @param {"ease-in-out"|"ease-in-out-slow"|"ease-in"|"ease-out"|"ripple"|"linear"} [iCurveStyle="ease-in-out"] - Curve Style
 * @param {number} [iSkipProgress=0] - How many of progress to skip, ranges from `0` to `1`
 * @returns {Promise<null>}
 */
const GlobalAnimation = (iDuration, iStyleSettingFunc, iCurveStyle = "ease-in-out", iSkipProgress = 0) => new Promise((resolve) => {
	const startTime = performance.now();

	const LocalAnimation = iPassedTime => {
		iPassedTime = iPassedTime - startTime;
		if (iPassedTime < 0) iPassedTime = 0;

		let cProgress = iPassedTime / iDuration + iSkipProgress;
		if (cProgress < 1) {
			if (iCurveStyle == "ease-in-out") {
				if (cProgress < 0.5)
					cProgress = Math.pow(cProgress * 2, 2.75) / 2;
				else
					cProgress = 1 - Math.pow((1 - cProgress) * 2, 2.75) / 2;
			} else if (iCurveStyle == "ease-in-out-slow") {
				if (cProgress < 0.5)
					cProgress = Math.pow(cProgress * 2, 2.25) / 2;
				else
					cProgress = 1 - Math.pow((1 - cProgress) * 2, 2.25) / 2;
			} else if (iCurveStyle == "ease-in") {
				cProgress = Math.pow(cProgress, 1.75);
			} else if (iCurveStyle == "ease-out") {
				cProgress = 1 - Math.pow(1 - cProgress, 1.75);
			} else if (iCurveStyle == "ripple") {
				cProgress = 0.6 * Math.pow(cProgress, 1/3) + 1.8 * Math.pow(cProgress, 2/3) - 1.4 * cProgress;
			}

			iStyleSettingFunc(cProgress);

			requestAnimationFrame(LocalAnimation);
		} else {
			iStyleSettingFunc(1);

			return resolve();
		}
	};

	requestAnimationFrame(LocalAnimation);
});

/**
 * @param {HTMLElement} iElem
 * @param {number} iDuration
 * @param {AnimationStyleSettingFunc} [iStyleSettingFunc]
 * @returns {Promise<string>}
 */
const SlideUp = (iElem, iDuration, iStyleSettingFunc) => {
	if (!iElem || !(iElem instanceof HTMLElement)) return Promise.resolve();

	const initSize = iElem.clientHeight,
		  marginTop = parseInt(getComputedStyle(iElem).marginTop || "0") || 0,
		  marginBottom = parseInt(getComputedStyle(iElem).marginBottom || "0") || 0,
		  paddingTop = parseInt(getComputedStyle(iElem).paddingTop || "0") || 0,
		  paddingBottom = parseInt(getComputedStyle(iElem).paddingTop || "0") || 0;

	iElem.style.overflow = "hidden";

	return GlobalAnimation(iDuration, (iProgress) => {
		iElem.style.height = `${(1 - iProgress) * initSize}px`;
		iElem.style.marginTop = `${(1 - iProgress) * marginTop}px`;
		iElem.style.marginBottom = `${(1 - iProgress) * marginBottom}px`;
		iElem.style.paddingTop = `${(1 - iProgress) * paddingTop}px`;
		iElem.style.paddingBottom = `${(1 - iProgress) * paddingBottom}px`;

		if (iStyleSettingFunc) iStyleSettingFunc(iProgress);
	}, "ease-in-out").then(() => {
		iElem.style.display = "none";
		iElem.style.removeProperty("height");
		iElem.style.removeProperty("overflow");
		iElem.style.removeProperty("margin-top");
		iElem.style.removeProperty("margin-bottom");
		iElem.style.removeProperty("padding-top");
		iElem.style.removeProperty("padding-bottom");
		return Promise.resolve("Done SlideUp");
	});
};

/**
 * @returns {boolean}
 */
const CheckForScheduledNightMode = () => {
	const
		DATE = new Date(),
		CURRENT_TENDENCY = (DATE.getMonth() < 5 || (DATE.getMonth() === 11 && DATE.getDate() > 22) || (DATE.getMonth() === 5 && DATE.getDate() < 22)),
		SCHEDULE = {
			winter: {
				sunrise: 9,
				sunset: 16
			},
			summer: {
				sunrise: 6,
				sunset: 21
			}
		},
		SESSION_START = CURRENT_TENDENCY ? new Date(DATE.getFullYear(), 11, 22) : new Date(DATE.getFullYear(), 5, 22),
		SESSION_END = CURRENT_TENDENCY ? new Date(DATE.getFullYear(), 5, 22) : new Date(DATE.getFullYear(), 11, 22);

	let nightModeFlag = false;


	if (CURRENT_TENDENCY) {
		if (DATE.getMonth() === 11)
			SESSION_END.setFullYear(DATE.getFullYear() + 1);
		else
			SESSION_START.setFullYear(DATE.getFullYear() - 1);
	}


	const
		RATIO = (+DATE - SESSION_START) / (+SESSION_END - SESSION_START),
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


	if (DATE.getHours() < Math.floor(TODAY_SUNRISE))
		nightModeFlag = true;
	else if (DATE.getHours() == Math.floor(TODAY_SUNRISE) & DATE.getMinutes() <= Math.floor((TODAY_SUNRISE % 1) * 60))
		nightModeFlag = true;
	else if (DATE.getHours() > Math.floor(TODAY_SUNSET))
		nightModeFlag = true;
	else if (DATE.getHours() == Math.floor(TODAY_SUNSET) & DATE.getMinutes() >= Math.floor((TODAY_SUNSET % 1) * 60))
		nightModeFlag = true;

	return nightModeFlag;
};

/**
 * @returns {boolean}
 */
const CheckForSystemNightMode = () => (
	typeof matchMedia !== "undefined" && matchMedia || window.matchMedia
)?.("(prefers-color-scheme: dark)")?.matches;

(
	typeof matchMedia !== "undefined" && matchMedia || window.matchMedia
)?.("(prefers-color-scheme: dark)")?.addEventListener("change", (mediaQueryListEvent) => {
	if (GetRecord("s42_system_theme") !== "1") return;

	ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => ManageModule(darkModuleName, false));
	ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => ManageModule(lightModuleName, false));

	if (mediaQueryListEvent.matches) {
		QS(`meta[name="theme-color"]`)?.setAttribute("content", "#232323");

		ManageModule("dark", true);
		ManageModule(`${SITE}_dark`, true, true);
		ManageModule("light", false);
		ManageModule("no_themes", false);

		ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
			if (GetRecord("s42_" + darkModuleName) === "1")
				ManageModule(darkModuleName, true);
		});
	} else {
		QS(`meta[name="theme-color"]`)?.setAttribute("content", SITES_COLORS[window.location.hostname]);

		ManageModule("dark", false);
		ManageModule(`${SITE}_dark`, false, true);
		ManageModule("light", true);
		ManageModule("no_themes", false);

		ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
			if (GetRecord("s42_" + lightModuleName) === "1")
				ManageModule(lightModuleName, true);
		});
	}
});



/**
 * @param {boolean} iNightMode
 * @returns {void}
 */
const SetMode = iNightMode => {
	if (window.top === window) window.top.S42_DARK_THEME_ENABLED = iNightMode;

	GlobalWaitForElement("body").then((body) => {
		if (!body) return;

		if (iNightMode)
			body.classList.add("s42-is-dark");
		else
			body.classList.remove("s42-is-dark");
	});

	GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${SITE}.css`, 1, SITE);


	if (GetRecord("s42_no_themes") !== "1") {
		if (iNightMode) {
			GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_dark.css`, 2, "dark");
			GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${SITE}_dark.css`, 3, `${SITE}_dark`);

			GlobalWaitForElement(`meta[name="theme-color"]`).then((meta) => {
				if (meta) meta.setAttribute("content", "#232323");
			});
		} else {
			GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_light.css`, 2, "light");

			GlobalWaitForElement(`meta[name="theme-color"]`).then((meta) => {
				if (meta) meta.setAttribute("content", SITES_COLORS[window.location.hostname]);
			});
		}
	}


	ALL_ADDITIONAL_MODULES.forEach((addon) => {
		if (GetRecord("s42_" + addon.name)) {
			if (!parseInt(GetRecord("s42_" + addon.name))) return false;
		} else {
			if (!addon.default) return false;
		}


		if (addon.dark === true && !iNightMode) return false;
		if (addon.light === true && iNightMode) return false;

		if ((addon.dark || addon.light) && GetRecord("s42_no_themes") === "1") return false;

		GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/osnova_${addon.name}.css`, addon.priority, addon.name);
	});
};

/** @type {Object.<string, HTMLElement>} */
const CUSTOM_ELEMENTS = new Object();

/**
 * @param {string} iModuleName
 * @param {boolean} iStatus
 * @param {boolean} [iWithoutPrefix=false]
 */
const ManageModule = (iModuleName, iStatus, iWithoutPrefix = false) => {
	if (iModuleName === "dark" && iStatus)
		GlobalWaitForElement("body").then((body) => {
			if (body) body.classList.add("s42-is-dark");
		});

	if (iModuleName === "light" && iStatus)
		GlobalWaitForElement("body").then((body) => {
			if (body) body.classList.remove("s42-is-dark");
		});


	const moduleURL = `https://${RESOURCES_DOMAIN}/tampermonkey/osnova/${(iWithoutPrefix ? "" : "osnova_") + iModuleName}.css`;

	if (CUSTOM_ELEMENTS[moduleURL] && !iStatus) {
		GlobalWaitForElement("body").then((body) => {
			if (body) body.classList.remove(`s42-${iModuleName.replace(/^osnova_/, "").replace(/_/g, "-")}`);
		});

		GR(CUSTOM_ELEMENTS[moduleURL]);
		delete CUSTOM_ELEMENTS[moduleURL];
	} else if (!CUSTOM_ELEMENTS[moduleURL] && iStatus) {
		const moduleSpecWithPriority = ALL_MODULES.find((moduleSpec) => moduleSpec.name === iModuleName);

		GlobalAddStyle(moduleURL, moduleSpecWithPriority.priority, iModuleName);
	}
};

/**
 * @param {string} iLink
 * @param {number} iPriority
 * @param {string} [iModuleName]
 */
const GlobalAddStyle = (iLink, iPriority, iModuleName = "") => {
	const stylesNode = document.createElement("link");
		  stylesNode.setAttribute("data-priority", iPriority);
		  stylesNode.setAttribute("data-author", "serguun42");
		  stylesNode.setAttribute("rel", "stylesheet");
		  stylesNode.setAttribute("href", iLink);


	if (iModuleName) {
		GlobalWaitForElement("body").then((body) => {
			if (body) body.classList.add(`s42-${iModuleName.replace(/^osnova_/, "").replace(/_/g, "-")}`);
		});
	}


	GlobalWaitForElement(`#container-for-custom-elements-${iPriority}`).then(
		/** @param {HTMLElement} containerToPlace */ (containerToPlace) => {
			if (!containerToPlace) return;

			containerToPlace.appendChild(stylesNode);
			CUSTOM_ELEMENTS[iLink] = stylesNode;
		}
	);
};

/**
 * @param {string} iLink
 * @param {number} iPriority
 */
const GlobalAddScript = (iLink, iPriority) => {
	const scriptNode = document.createElement("script");
		  scriptNode.setAttribute("data-priority", iPriority);
		  scriptNode.setAttribute("data-author", "serguun42");
		  scriptNode.setAttribute("src", iLink);


	GlobalWaitForElement(`#container-for-custom-elements-${iPriority}`).then(
		/** @param {HTMLElement} containerToPlace */ (containerToPlace) => {
			if (!containerToPlace) return;

			containerToPlace.appendChild(scriptNode);
			CUSTOM_ELEMENTS[iLink] = scriptNode;
		}
	);
};

/**
 * @typedef {Event & MouseEvent & TouchEvent & {currentTarget: HTMLElement}} CustomEventType
 */
/**
 * @callback GlobalBuildLayoutListenerCallback
 * @param {CustomEventType} e
 */
/**
 * @typedef {Object} ElementDescriptorType
 * @property {string} [tag]
 * @property {string} [class]
 * @property {string} [id]
 * @property {string} [text]
 * @property {string} [html]
 * @property {boolean} [ripple]
 * @property {boolean} [mdlUpgrade]
 * @property {GlobalBuildLayoutListenerCallback} [onclick]
 * @property {boolean} [contextSameAsClick] - `contextmenu` listener does the same thing as usual `click`
 * @property {{[dataPropName: string]: string | number}} [data]
 * @property {{[attributeName: string]: string | number}} [tags]
 * @property {{[attributeName: string]: string | number}} [attr]
 * @property {ElementDescriptorType} [child]
 * @property {ElementDescriptorType[]} [children]
 * @property {{[listenerName: string]: GlobalBuildLayoutListenerCallback}} [listener]
 * @property {{[listenerName: string]: GlobalBuildLayoutListenerCallback}} [listeners]
 */
/**
 * @callback AdditionalHandlingPropertyHandler
 * @param {string | number | function} iAdditionalHandlingPropertyValue
 * @param {ElementDescriptorType} iElemDesc
 * @param {HTMLElement} iDocElem
 * @param {HTMLElement} iParentElem
 * @returns {void}
 *
 * @typedef {{[propertyName: string]: AdditionalHandlingPropertyHandler}} AdditionalHandlingProperties
 */
/**
 * @param {ElementDescriptorType[] | ElementDescriptorType} elements
 * @param {HTMLElement} container
 * @param {boolean} [clearContainer=true]
 * @param {AdditionalHandlingProperties} [additionalHandlingProperties=null]
 * @returns {void}
 */
const GlobalBuildLayout = (elements, container, clearContainer = true, additionalHandlingProperties = null) => {
	if (clearContainer)
		container.innerHTML = null;

	/**
	 * @param {ElementDescriptorType} element
	 */
	const LocalBuildElement = element => {
		if (!element) return;

		const docElem = document.createElement(element.tag || "div");
		if (element.class) docElem.className = element.class;
		if (element.id) docElem.id = element.id;
		if (element.data)
			for (const dataPropName in element.data)
				docElem.dataset[dataPropName] = typeof element.data[dataPropName] == "object" ? JSON.stringify(element.data[dataPropName]) : (element.data[dataPropName] === true ? "" : element.data[dataPropName]);
		if (element.tags)
			for (const attributeName in element.tags)
				docElem.setAttribute(attributeName, element.tags[attributeName]);
		if (element.attr)
			for (const attributeName in element.attr)
				docElem.setAttribute(attributeName, element.attr[attributeName]);


		if ("text" in element && element.text !== null)
			docElem.innerText = element.text;
		else if ("html" in element && element.html !== null)
			docElem.innerHTML = element.html;
		else if (element.children)
			GlobalBuildLayout(element.children, docElem, false, additionalHandlingProperties);
		else if (element.child)
			GlobalBuildLayout(element.child, docElem, false, additionalHandlingProperties);

		if (element.ripple) docElem.classList.add("mdl-js-button", "mdl-js-ripple-effect");
		if (element.mdlUpgrade || element.ripple) componentHandler?.upgradeElement(docElem);

		if (element.onclick) {
			docElem.addEventListener("click", element.onclick);

			if (element.contextSameAsClick) {
				docElem.addEventListener("contextmenu", (e) => {
					e.preventDefault();
					element.onclick(e);
					return false;
				});
			}
		}

		if (element.listener)
			for (const listenerName in element.listener)
				docElem.addEventListener(listenerName, element.listener[listenerName]);

		if (element.listeners)
			for (const listenerName in element.listeners)
				docElem.addEventListener(listenerName, element.listeners[listenerName]);


		if (additionalHandlingProperties)
			Object.keys(additionalHandlingProperties).forEach((AdditionalHandlingProperty) => {
				if (element[AdditionalHandlingProperty])
					additionalHandlingProperties[AdditionalHandlingProperty](element[AdditionalHandlingProperty], element, docElem, container);
			});


		container.appendChild(docElem);
	};


	if (elements instanceof Array)
		elements.forEach((element) => LocalBuildElement(element));
	else
		LocalBuildElement(elements);
};

const DEFAULT_RECORD_OPTIONS = { infinite: true, Path: "/", Domain: window.location.hostname };
const ALL_RECORDS_NAMES = [
	"s42_always",
	"s42_system_theme",
	"s42_turn_off",
	"s42_no_themes",
	"s42_columns_narrow",
	"s42_covfefe",
	"s42_blackchrome",
	"s42_vampire",
	"s42_deep_blue",
	"s42_filter",
	"s42_verified",
	"s42_hide_likes",
	"s42_add_possession_choice",
	"s42_karma",
	"s42_lastkarmaandsub",
	"s42_material",
	"s42_gray_signs",
	"s42_snow_by_neko",
	"s42_messageslinkdisabled",
	"s42_defaultscrollers",
	"s42_monochrome",
	"s42_qrcode",
	"s42_ultra_dark",
	"s42_vbscroller",
	"s42_editorial",
	"s42_columns_narrow",
	"s42_hidesubscriptions",
	"s42_beautifulfeedposts",
	"s42_favouritesicon",
	"s42_favouritemarker",
	"s42_previous_editor",
	"s42_hide_feed_top_mini_editor",
	"s42_fullpage_editor",
	"s42_stars_in_editor",
	"s42_hideviewsanddate",
	"s42_hideentriesbadge",
	"s42_donate",
	"s42_com_rules"
];

/**
 * @param {string} iName
 * @param {string} iValue
 * @param {{infinite?: true, erase?: true, Path?: string, Domain?: string}} iOptions
 * @returns {void}
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
	}

	document.cookie = cCookie;
};

/**
 * @param {string} iName
 * @returns {string | undefined}
 */
const GetCookie = iName => {
	const matches = document.cookie.match(new RegExp("(?:^|; )" + iName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * @param {string} iName
 * @param {string} iValue
 * @param {{infinite?: true, erase?: true, Path?: string, Domain?: string}} iOptions
 * @returns {void}
 */
const SetRecord = (iName, iValue, iOptions) => {
	SetCookie(iName, iValue, iOptions);
	localStorage.setItem(iName, iValue);
};

/**
 * @param {string} iName
 * @returns {string | undefined}
 */
const GetRecord = iName => {
	const gotCookie = GetCookie(iName),
		  gotStorage = localStorage.getItem(iName);

	if (!gotStorage && !!gotCookie) {
		localStorage.setItem(iName, gotCookie);
		return gotCookie;
	} else if (!!gotStorage && !gotCookie) {
		SetCookie(iName, gotStorage, DEFAULT_RECORD_OPTIONS);
		return gotStorage;
	} else if (!!gotStorage && !!gotCookie && gotStorage !== gotCookie) {
		SetCookie(iName, gotStorage, DEFAULT_RECORD_OPTIONS);
		return gotStorage;
	} else {
		return gotStorage || gotCookie;
	}
};


window.UNLOAD_COOKIES = () => ALL_RECORDS_NAMES.forEach((recordName) => SetCookie(recordName, "1", { erase: true, Path: "/", Domain: window.location.hostname }));

window.UNLOAD_STORAGE = () => ALL_RECORDS_NAMES.forEach((recordName) => localStorage.removeItem(recordName));



GlobalWaitForElement("body").then((body) => {
	if (!body) return;

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

			body.appendChild(container);
		}
	}
});


GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/mdl-switchers.css`, 0);
GlobalAddStyle(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/switchers.css`, 0);
GlobalAddScript(`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/getmdl.min.js`, 0);


if (GetRecord("s42_turn_off") === "1")
	SetMode(false);
else if (GetRecord("s42_always") === "1")
	SetMode(true);
else if (GetRecord("s42_system_theme") === "1")
	SetMode(CheckForSystemNightMode());
else
	SetMode(CheckForScheduledNightMode());



const customDataContainer = document.createElement("div");
	  customDataContainer.id = "custom-data-container";
	  customDataContainer.className = "custom-data-container--for-big-header";

GlobalWaitForElement(".site-header-user").then((siteHeaderUser) => {
	siteHeaderUser.after(customDataContainer);


	/**
	 * @param {CustomEventType} e
	 */
	const LocalOnTimeChange = (e) => {
		[
			"always",
			"system_theme",
			"turn_off",
			"no_themes"
		].forEach((timeOption) => SetRecord(
			`s42_${timeOption}`, (e.currentTarget.value === timeOption ? 1 : 0).toString(), DEFAULT_RECORD_OPTIONS
		));


		ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => ManageModule(darkModuleName, false));
		ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => ManageModule(lightModuleName, false));


		if (e.currentTarget.value === "always") {
			QS(`meta[name="theme-color"]`)?.setAttribute("content", "#232323");

			ManageModule("dark", true);
			ManageModule(`${SITE}_dark`, true, true);
			ManageModule("light", false);
			ManageModule("no_themes", false);

			ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
				if (GetRecord("s42_" + darkModuleName) === "1")
					ManageModule(darkModuleName, true);
			});
		} else if (e.currentTarget.value === "system_theme") {
			if (CheckForSystemNightMode()) {
				QS(`meta[name="theme-color"]`)?.setAttribute("content", "#232323");

				ManageModule("dark", true);
				ManageModule(`${SITE}_dark`, true, true);
				ManageModule("light", false);
				ManageModule("no_themes", false);

				ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
					if (GetRecord("s42_" + darkModuleName) === "1")
						ManageModule(darkModuleName, true);
				});
			} else {
				QS(`meta[name="theme-color"]`)?.setAttribute("content", SITES_COLORS[window.location.hostname]);

				ManageModule("dark", false);
				ManageModule(`${SITE}_dark`, false, true);
				ManageModule("light", true);
				ManageModule("no_themes", false);

				ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
					if (GetRecord("s42_" + lightModuleName) === "1")
						ManageModule(lightModuleName, true);
				});
			}
		} else if (e.currentTarget.value === "turn_off") {
			QS(`meta[name="theme-color"]`)?.setAttribute("content", SITES_COLORS[window.location.hostname]);

			ManageModule("dark", false);
			ManageModule(`${SITE}_dark`, false, true);
			ManageModule("light", true);
			ManageModule("no_themes", false);

			ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
				if (GetRecord("s42_" + lightModuleName) === "1")
					ManageModule(lightModuleName, true);
			});
		} else if (e.currentTarget.value === "no_themes") {
			QS(`meta[name="theme-color"]`)?.removeAttribute("content");

			ManageModule("dark", false);
			ManageModule(`${SITE}_dark`, false, true);
			ManageModule("light", false);
			ManageModule("no_themes", true);
		} else {
			if (CheckForScheduledNightMode()) {
				QS(`meta[name="theme-color"]`)?.setAttribute("content", "#232323");

				ManageModule("dark", true);
				ManageModule(`${SITE}_dark`, true, true);
				ManageModule("light", false);
				ManageModule("no_themes", false);

				ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
					if (GetRecord("s42_" + darkModuleName) === "1")
						ManageModule(darkModuleName, true);
				});
			} else {
				QS(`meta[name="theme-color"]`)?.setAttribute("content", SITES_COLORS[window.location.hostname]);

				ManageModule("dark", false);
				ManageModule(`${SITE}_dark`, false, true);
				ManageModule("light", true);
				ManageModule("no_themes", false);

				ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
					if (GetRecord("s42_" + lightModuleName) === "1")
						ManageModule(lightModuleName, true);
				});
			}
		}
	};

	/**
	 * @returns {ElementDescriptorType[]}
	 */
	const LocalBuildTimeSwitchers = () => [
		{
			what: "always",
			label: `Тёмная тема с выбранными дополнениями всегда включена`,
			checked: GetRecord("s42_always") === "1"
		},
		{
			what: "system_theme",
			label: `Синхронизировать с системной темой`,
			sublabel: `Если в браузере и/или системе выбрана тёмная тема, то она будет применена и в расширении. При смене на системную светлую, расширение автоматически применит светлую тему к сайту с доступными и выбранными дополнениями`,
			checked: GetRecord("s42_system_theme") === "1"
		},
		{
			what: "usual",
			label: `По расписанию`,
			sublabel: `Выбранная тёмная тема применяется после заката и до восхода, время определяется динамически (солнцестояние – равноденствие – солнцестояние и т.д.)`,
			checked: GetRecord("s42_always") !== "1" && GetRecord("s42_system_theme") !== "1" && GetRecord("s42_turn_off") !== "1" && GetRecord("s42_no_themes") !== "1"
		},
		{
			what: "turn_off",
			label: `Тёмная тема и дополнения для тёмной темы всегда отключены`,
			sublabel: `Вместо этого применяется слегка модифицированная светлая тема и, если вы выберете отдельно, дополнения к ней.`,
			checked: GetRecord("s42_turn_off") === "1"
		},
		{
			what: "no_themes",
			label: `Не применять никакие темы никогда`,
			sublabel: `Всё так же можно подключить дополнительные модули: красные закладки, Material, прижать боковые колонки и прочее. См. «Выбор модулей»`,
			checked: GetRecord("s42_no_themes") === "1"
		}
	].map((timeSwitcher) => ({
		tag: "li",
		class: "switcher-layout__list__item",
		child: {
			tag: "label",
			class: "mdl-radio mdl-js-radio mdl-js-ripple-effect",
			attr: {
				for: timeSwitcher.what
			},
			data: {
				mdlUpgrade: true
			},
			children: [
				{
					tag: "input",
					class: "mdl-radio__button",
					id: timeSwitcher.what,
					attr: {
						type: "radio",
						name: "time",
						value: timeSwitcher.what,
						...(timeSwitcher.checked === true ? { checked: "checked" } : {})
					},
					listeners: {
						change: LocalOnTimeChange
					}
				},
				{
					tag: "span",
					class: "mdl-radio__label",
					html: timeSwitcher.label
				},
				timeSwitcher.sublabel ? {
					tag: "span",
					class: "mdl-radio__sub-label",
					html: timeSwitcher.sublabel
				} : null
			].filter((child) => !!child)
		}
	}));

	const LocalHideDonate = () => {
		SetRecord("s42_donate", Date.now().toString(), DEFAULT_RECORD_OPTIONS);

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
	};

	/**
	 * @param {CustomEventType} e
	 */
	const LocalOnAdditionalDarkThemesChange = (e) => {
		ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => SetRecord(
			`s42_${darkModuleName}`, (e.currentTarget.value === darkModuleName ? 1 : 0).toString(), DEFAULT_RECORD_OPTIONS
		));

		if (GetRecord("s42_no_themes") === "1") return;

		if (ADDITIONAL_DARK_MODULES_NAMES.includes(e.currentTarget.value)) {
			if (
				(
					GetRecord("s42_turn_off")             &&
					parseInt(GetRecord("s42_turn_off"))
				) || (
					!CheckForScheduledNightMode()         &&
					GetRecord("s42_always") !== "1"       &&
					GetRecord("s42_turn_off") !== "1"
				) || (
					!CheckForSystemNightMode()            &&
					GetRecord("s42_system_theme") !== "1" &&
					GetRecord("s42_turn_off") !== "1"
				)
			) {
				QS(`[for="always"]`).classList.add("is-checked");
				QS(`[value="always"]`).checked = true;
				QS(`[for="system_theme"]`).classList.remove("is-checked");
				QS(`[value="system_theme"]`).checked = false;
				QS(`[for="usual"]`).classList.remove("is-checked");
				QS(`[value="usual"]`).checked = false;
				QS(`[for="turn_off"]`).classList.remove("is-checked");
				QS(`[value="turn_off"]`).checked = false;

				SetRecord("s42_always", "1", DEFAULT_RECORD_OPTIONS);
				SetRecord("s42_system_theme", "0", DEFAULT_RECORD_OPTIONS);
				SetRecord("s42_turn_off", "0", DEFAULT_RECORD_OPTIONS);

				ManageModule("dark", true);
				ManageModule(`${SITE}_dark`, true, true);
				ManageModule("monochrome", false);
				ManageModule("light", false);
			}
		}

		ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) =>
			ManageModule(darkModuleName, e.currentTarget.value === darkModuleName)
		);
	};

	/**
	 * @returns {ElementDescriptorType[]}
	 */
	const LocalBuildAdditionalDarkThemes = () => ALL_ADDITIONAL_MODULES.filter((addModule) => addModule.dark).concat({ name: "nothing" }).map((addDarkModule) => ({
		tag: "li",
		class: "switcher-layout__list__item",
		child: {
			tag: "label",
			class: "mdl-radio mdl-js-radio mdl-js-ripple-effect",
			attr: {
				for: addDarkModule.name
			},
			data: {
				mdlUpgrade: true
			},
			children: [
				{
					tag: "input",
					class: "mdl-radio__button",
					id: addDarkModule.name,
					attr: {
						type: "radio",
						name: "add-dark",
						value: addDarkModule.name,
						...((
							addDarkModule.name === "nothing"
								? ALL_ADDITIONAL_MODULES.filter((addModuleChecking) => addModuleChecking.dark).every(
										(addModuleChecking) => GetRecord(`s42_${addModuleChecking.name}`) !== "1"
									)
								: GetRecord(`s42_${addDarkModule.name}`) === "1"
						)
							? { checked: "checked" }
							: {}),
					},
					listeners: {
						change: LocalOnAdditionalDarkThemesChange
					}
				},
				{
					tag: "span",
					class: "mdl-radio__label",
					text: addDarkModule.title || "Без дополнений к тёмной теме"
				}
			]
		}
	}));

	/**
	 * @param {CustomEventType} e
	 */
	const LocalOnAdditionalLightThemesChange = (e) => {
		SetRecord("s42_monochrome", (e.currentTarget.value === "monochrome" ? 1 : 0).toString(), DEFAULT_RECORD_OPTIONS);

		if (GetRecord("s42_no_themes") === "1") return;

		if (
			e.currentTarget.value === "monochrome"
		) {
			if (
				GetRecord("s42_turn_off") !== "1" || CheckForScheduledNightMode() || CheckForSystemNightMode()
			) {
				QS(`[for="always"]`).classList.remove("is-checked");
				QS(`[value="always"]`).checked = false;
				QS(`[for="system_theme"]`).classList.add("is-checked");
				QS(`[value="system_theme"]`).checked = false;
				QS(`[for="usual"]`).classList.remove("is-checked");
				QS(`[value="usual"]`).checked = false;
				QS(`[for="turn_off"]`).classList.add("is-checked");
				QS(`[value="turn_off"]`).checked = true;

				SetRecord("s42_always", "0", DEFAULT_RECORD_OPTIONS);
				SetRecord("s42_system_theme", "0", DEFAULT_RECORD_OPTIONS);
				SetRecord("s42_turn_off", "1", DEFAULT_RECORD_OPTIONS);


				ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) =>
					ManageModule(darkModuleName, e.currentTarget.value === darkModuleName)
				);
				ManageModule("dark", false);
				ManageModule(`${SITE}_dark`, false, true);
				ManageModule("light", true);
			}
		}

		ManageModule("monochrome", e.currentTarget.value === "monochrome");
	};

	/**
	 * @returns {ElementDescriptorType[]}
	 */
	const LocalBuildAdditionalLightThemes = () => ALL_ADDITIONAL_MODULES.filter((addModule) => addModule.light).concat({ name: "nothing-light" }).map((addLightModule) => ({
		tag: "li",
		class: "switcher-layout__list__item",
		child: {
			tag: "label",
			class: "mdl-radio mdl-js-radio mdl-js-ripple-effect",
			attr: {
				for: addLightModule.name
			},
			data: {
				mdlUpgrade: true
			},
			children: [
				{
					tag: "input",
					class: "mdl-radio__button",
					id: addLightModule.name,
					data: {
						mdlEventWating: true
					},
					attr: {
						type: "radio",
						name: "add-light",
						value: addLightModule.name,
						...((
							addLightModule.name === "nothing-light"
								? ALL_ADDITIONAL_MODULES.filter((addModuleChecking) => addModuleChecking.light).every(
										(addModuleChecking) => GetRecord(`s42_${addModuleChecking.name}`) !== "1"
									)
								: GetRecord(`s42_${addLightModule.name}`) === "1"
						)
							? { checked: "checked" }
							: {}),
					},
					listeners: {
						change: LocalOnAdditionalLightThemesChange
					}
				},
				{
					tag: "span",
					class: "mdl-radio__label",
					text: addLightModule.title || "Без дополнений к светлой теме"
				}
			]
		}
	}));

	/**
	 * @param {{name: string, title: string, subtitle?: string, checked: boolean, onchange: (e: CustomEventType) => void}} checkboxRule
	 * @returns {ElementDescriptorType}
	 */
	const LocalBuildCheckboxByCommonRule = (checkboxRule) => ({
		tag: "li",
		class: "switcher-layout__list__item",
		child: {
			tag: "label",
			class: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect",
			attr: {
				for: checkboxRule.name
			},
			data: {
				mdlUpgrade: true
			},
			onclick: (e) => {
				const input = e.currentTarget.children[0];
				if (input) {
					e.preventDefault();

					const checked = !!input.checked;

					if (checked)
						e.currentTarget.classList.remove("is-checked");
					else
						e.currentTarget.classList.add("is-checked");

					input.checked = !checked;

					checkboxRule.onchange({ currentTarget: input });

					return false;
				}
			},
			children: [
				{
					tag: "input",
					class: "mdl-checkbox__input",
					attr: {
						type: "checkbox",
						...(checkboxRule.checked ? { checked: "" } : {})
					},
					listeners: {
						change: checkboxRule.onchange
					}
				},
				{
					tag: "span",
					class: "mdl-checkbox__label",
					text: checkboxRule.title
				},
				checkboxRule.subtitle ? {
					tag: "span",
					class: "mdl-checkbox__sub-label",
					text: checkboxRule.subtitle
				} : null
			]
		}
	});


	const LocalBuildPanel = () => GlobalBuildLayout([
		{
			id: "switcher-layout",
			attr: {
				style: "display: none; opacity: 0;"
			},
			child: {
				id: "switcher-layout--scroller",
				children: [
					{
						class: "switcher-layout__header",
						children: [
							{
								tag: "span",
								text: "Выбор тем"
							},
							{
								tag: "span",
								class: "switcher-layout__header__supporting-text",
								id: "switcher-layout__scroll-to-modules-part",
								text: "Выбор модулей находится чуть ниже",
								onclick: () => GEBI("switcher-layout__choosing-modules-part").scrollIntoView({ behavior: "smooth" })
							}
						]
					},
					{
						tag: "ul",
						id: "switcher-layout__list",
						children: [
							{
								class: "switcher-layout__list__subheader",
								text: "Когда включать"
							},
							...LocalBuildTimeSwitchers(),
							...((Date.now() - parseInt(GetRecord("s42_donate")) || 0) > 86400 * 5 * 1e3 ? [
								{
									class: "switcher-layout__list__separator switcher-layout__list__donate",
									onclick: LocalHideDonate
								},
								{
									tag: "a",
									class: "switcher-layout__list__subheader switcher-layout__list__donate",
									attr: {
										href: "https://sobe.ru/na/dark_mode",
										target: "_blank",
										style: `color: ${SITES_COLORS[window.location.hostname]}; text-decoration: underline;`
									},
									text: "Поддержать автора",
									onclick: LocalHideDonate
								},
								{
									tag: "li",
									class: "switcher-layout__list__subheader switcher-layout__list__donate",
									text: "Можете просто скрыть это сообщение, нажав на него или сюда 👆🏻",
									onclick: LocalHideDonate
								}
							] : []),
							{ class: "switcher-layout__list__separator" },
							{
								class: "switcher-layout__list__subheader",
								text: "Выбор дополнений к тёмной теме"
							},
							...LocalBuildAdditionalDarkThemes(),
							{ class: "switcher-layout__list__separator" },
							{
								class: "switcher-layout__list__subheader",
								text: "Выбор дополнений к светлой теме"
							},
							...LocalBuildAdditionalLightThemes(),
							{
								class: "switcher-layout__list__separator",
								id: "switcher-layout__choosing-modules-part"
							},
							{
								class: "switcher-layout__header",
								text: "Выбор модулей"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Кнопки в левом меню"
							},
							...([
								{
									name: "hideentriesbadge",
									title: "Скрыть индикатор новых записей",
									checked: GetRecord("s42_hideentriesbadge") === "1",
									onchange: (e) => {
										SetRecord("s42_hideentriesbadge", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("hideentriesbadge", e.currentTarget.checked);
									}
								},
								{
									name: "editorial",
									title: "Добавить кнопку «От редакции»",
									checked: GetRecord("s42_editorial") === "1",
									onchange: (e) => {
										SetRecord("s42_editorial", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);

										if (e.currentTarget.checked)
											GlobalPlaceEditorialButton();
										else
											GR(GEBI("s42-editorial-link-btn"));
									}
								},
								{
									name: "hidesubscriptions",
									title: "Скрыть кнопку подписок",
									checked: GetRecord("s42_hidesubscriptions") === "1",
									onchange: (e) => {
										SetRecord("s42_hidesubscriptions", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("hidesubscriptions", e.currentTarget.checked);
									}
								},
								{
									name: "messageslinkdisabled",
									title: "Скрыть кнопки «Закладки», «Вакансии», «Кабинет», «Мероприятия» и прочее в левом меню",
									checked: GetRecord("s42_messageslinkdisabled") !== "0",
									onchange: (e) => {
										SetRecord("s42_messageslinkdisabled", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_RECORD_OPTIONS);

										if (e.currentTarget.checked)
											GlobalSetSidebarItemsStyle("none");
										else
											GlobalSetSidebarItemsStyle("");
									}
								}
							].map(LocalBuildCheckboxByCommonRule)),
							{
								class: "switcher-layout__list__separator"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Настройки ленты и постов"
							},
							...([
								{
									name: "beautifulfeedposts",
									title: "Кнопки оценки постов без теней",
									checked: GetRecord("s42_beautifulfeedposts") !== "0",
									onchange: (e) => {
										SetRecord("s42_beautifulfeedposts", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("beautifulfeedposts", e.currentTarget.checked);
									}
								},
								{
									name: "favouritesicon",
									title: "Красная иконка закладок",
									checked: GetRecord("s42_favouritesicon") !== "0",
									onchange: (e) => {
										SetRecord("s42_favouritesicon", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("favouritesicon", e.currentTarget.checked);
									}
								},
								{
									name: "favouritemarker",
									title: "Количество закладок в постах",
									checked: GetRecord("s42_favouritemarker") !== "0",
									onchange: (e) => {
										SetRecord("s42_favouritemarker", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);

										addFavouriteMarkerFlag = !!e.currentTarget.checked;

										if (addFavouriteMarkerFlag)
											GlobalStartFavouriteMarkerProcedure();
										else
											GlobalStopFavouriteMarkerProcedure();
									}
								}
							].map(LocalBuildCheckboxByCommonRule)),
							{
								class: "switcher-layout__list__separator"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Редактор постов"
							},
							...([
								{
									name: "fullpage_editor",
									title: "Автоматически раскрывать редактор на всю страницу при его открытии",
									checked: GetRecord("s42_fullpage_editor") === "1",
									onchange: (e) => {
										SetRecord("s42_fullpage_editor", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);

										SetFullpageEditor(e.currentTarget.checked);
									}
								},
								{
									name: "stars_in_editor",
									title: "Вернуть в редактор быстрые действия: вывод в ленту, якоря, скрытие блоков и т.п.",
									checked: GetRecord("s42_stars_in_editor") === "1",
									onchange: (e) => {
										SetRecord("s42_stars_in_editor", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("stars_in_editor", e.currentTarget.checked);
									}
								},
								{
									name: "previous_editor",
									title: "Старое оформление редактора",
									checked: GetRecord("s42_previous_editor") === "1",
									onchange: (e) => {
										SetRecord("s42_previous_editor", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("previous_editor", e.currentTarget.checked);
									}
								},
								{
									name: "hide_feed_top_mini_editor",
									title: "Скрыть мини-редактор в начале ленты",
									checked: GetRecord("s42_hide_feed_top_mini_editor") === "1",
									onchange: (e) => {
										SetRecord("s42_hide_feed_top_mini_editor", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("hide_feed_top_mini_editor", e.currentTarget.checked);
									}
								}
							].map(LocalBuildCheckboxByCommonRule)),
							{
								class: "switcher-layout__list__separator"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Карма и подписчики"
							},
							LocalBuildCheckboxByCommonRule({
								name: "karma",
								title: "Блок с кармой, подписчиками и подписками в шапке включён",
								checked: GetRecord("s42_karma") !== "off",
								onchange: (e) => {
									SetRecord("s42_karma", e.currentTarget.checked ? "on" : "off", DEFAULT_RECORD_OPTIONS);

									if (e.currentTarget.checked) {
										GEBI("switcher-layout__list__item--karma-cover").classList.remove("is-faded");
										SetStatsDash(true);
									} else {
										GEBI("switcher-layout__list__item--karma-cover").classList.add("is-faded");
										GR(GEBI("main_menu__auth__stats"));
									}
								}
							}),
							{
								id: "switcher-layout__list__item--karma-cover",
								class: GetRecord("s42_karma") === "off" ? "is-faded" : "",
								children: [
									{
										name: "karma_rating",
										title: "Количество кармы",
										checked: GetRecord("s42_karma_rating") !== "off",
										onchange: (e) => {
											SetRecord("s42_karma_rating", e.currentTarget.checked ? "on" : "off", DEFAULT_RECORD_OPTIONS);
											SetStatsDash(true);
										}
									},
									{
										name: "karma_subscribers",
										title: "Подписчики",
										checked: GetRecord("s42_karma_subscribers") !== "off",
										onchange: (e) => {
											SetRecord("s42_karma_subscribers", e.currentTarget.checked ? "on" : "off", DEFAULT_RECORD_OPTIONS);
											SetStatsDash(true);
										}
									},
									{
										name: "karma_subscriptions",
										title: "Подписки",
										checked: GetRecord("s42_karma_subscriptions") !== "off",
										onchange: (e) => {
											SetRecord("s42_karma_subscriptions", e.currentTarget.checked ? "on" : "off", DEFAULT_RECORD_OPTIONS);
											SetStatsDash(true);
										}
									}
								].map(LocalBuildCheckboxByCommonRule).concat({
									id: "switcher-layout__list__item--karma-cover__obfuscator"
								})
							},
							{
								class: "switcher-layout__list__separator"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Другие дополнительные модули"
							},
							...([
								{
									name: "gray_signs",
									title: "Серые оценки у постов и комментариев",
									checked: GetRecord("s42_gray_signs") === "1",
									onchange: (e) => {
										SetRecord("s42_gray_signs", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_RECORD_OPTIONS);
										ManageModule("gray_signs", e.currentTarget.checked);
									}
								},
								{
									name: "material",
									title: "Добавить оформление «Material»",
									subtitle: "Скруглённые углы у старых блоков, чуть больше «воздуха»",
									checked: GetRecord("s42_material") !== "0",
									onchange: (e) => {
										SetRecord("s42_material", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_RECORD_OPTIONS);
										ManageModule("material", e.currentTarget.checked);
									}
								},
								{
									name: "defaultscrollers",
									title: "Включить стандартные полосы прокрутки",
									checked: GetRecord("s42_defaultscrollers") === "1",
									onchange: (e) => {
										SetRecord("s42_defaultscrollers", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_RECORD_OPTIONS);

										if (e.currentTarget.checked)
											GlobalSetScrollers("default");
										else
											GlobalSetScrollers("custom");
									}
								},
								{
									name: "columns_narrow",
									title: "Прижать боковые колонки к центру экрана",
									subtitle: "Весь контент будет в центре. Заметнее всего на широких экранах",
									checked: GetRecord("s42_columns_narrow") === "1",
									onchange: (e) => {
										SetRecord("s42_columns_narrow", (e.currentTarget.checked ? 1 : 0).toString(), DEFAULT_RECORD_OPTIONS);
										ManageModule("columns_narrow", e.currentTarget.checked);
									}
								},
								{
									name: "verified",
									title: "Добавить галочки всем пользователям",
									checked: GetRecord("s42_verified") === "1",
									onchange: (e) => {
										SetRecord("s42_verified", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("verified", e.currentTarget.checked);
									}
								},
								{
									name: "hide_likes",
									title: "Спрятать все оценки и поля ввода",
									subtitle: "Например, в комментариях под записями",
									checked: GetRecord("s42_hide_likes") === "1",
									onchange: (e) => {
										SetRecord("s42_hide_likes", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("hide_likes", e.currentTarget.checked);
									}
								},
								{
									name: "com_rules",
									title: "Отключить рекламу",
									subtitle: "Фильтр регулярно обновляется",
									checked: GetRecord("s42_com_rules") !== "0",
									onchange: (e) => {
										SetRecord("s42_com_rules", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("com_rules", e.currentTarget.checked);
									}
								},
								{
									name: "add_possession_choice",
									title: "Отображать меню выбора между профилем и модерируемыми подсайтами в поле ввода комментария",
									subtitle: "β-версия",
									checked: GetRecord("s42_add_possession_choice") === "1",
									onchange: (e) => {
										SetRecord("s42_add_possession_choice", e.currentTarget.checked ? "1" : "0", DEFAULT_RECORD_OPTIONS);
										ManageModule("add_possession_choice", e.currentTarget.checked);
									}
								}
							].map(LocalBuildCheckboxByCommonRule)),
							{
								class: "switcher-layout__list__separator switcher-layout__list--for-small-screen"
							},
							{
								class: "switcher-layout__list--for-small-screen",
								id: "switcher-layout__close-button-container",
								child: {
									class: "mdl-js-button mdl-js-ripple-effect",
									mdlUpgrade: true,
									id: "switcher-layout__close-button",
									text: "Закрыть опции",
									onclick: () => LocalHidePanel(),
									contextSameAsClick: true
								}
							}
						].filter((switcherBlock) => !!switcherBlock)
					}
				]
			}
		},
		{
			id: "switcher-layout--obfuscator",
			attr: {
				style: "display: none;"
			},
			onclick: () => LocalHidePanel(),
			contextSameAsClick: true
		}
	], document.body, false);

	/**
	 * @param {CustomEventType} e
	 */
	const LocalShowPanel = (e) => {
		let smallScreenFlag = false;
		if ((window.innerWidth - e.clientX) * 2 + 500 > window.innerWidth) smallScreenFlag = true;
		if (window.innerHeight <= 660) smallScreenFlag = true;


		const switchersContainerMaxHeight = smallScreenFlag ? window.innerHeight - 60 : 600,
			  switchersContainerMaxWidth = smallScreenFlag ? window.innerWidth : 500,
			  switchersContainer = GEBI("switcher-layout"),
			  switchersScroller = GEBI("switcher-layout--scroller"),
			  switchersObfuscator = GEBI("switcher-layout--obfuscator");


		if (smallScreenFlag) {
			switchersContainer.classList.add("switcher-layout--small-screen");
			switchersContainer.style.removeProperty("right");
		} else {
			switchersContainer.style.right = (window.innerWidth - e.clientX) + "px";
			switchersContainer.classList.remove("switcher-layout--small-screen");
		}


		switchersContainer.style.width = 0;
		switchersContainer.style.height = 0;
		switchersContainer.style.opacity = 0;
		switchersContainer.style.display = "block";
		switchersScroller.style.overflowY = "hidden";
		switchersObfuscator.style.display = "block";


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
	};

	const LocalHidePanel = () => {
		const switchersContainer = GEBI("switcher-layout"),
			  switchersScroller = GEBI("switcher-layout--scroller"),
			  switchersObfuscator = GEBI("switcher-layout--obfuscator");


		switchersScroller.style.overflowY = "hidden";

		GlobalAnimation(4e2, (iProgress) => {
			switchersContainer.style.opacity = 1 - iProgress;
		}).then(() => {
			switchersContainer.style.opacity = 0;
			switchersContainer.style.display = "none";
			switchersObfuscator.style.display = "none";

			GR(switchersContainer);
			GR(switchersObfuscator);
		});
	};


	const switchersBtn = document.createElement("div");
		  switchersBtn.innerHTML = `<svg width="20" height="20" class="icon icon--v_gear" ><use xlink:href="#v_gear"></use></svg>`;
		  switchersBtn.id = "switchers-btn";
		  switchersBtn.className = "mdl-js-button mdl-js-ripple-effect";
		  switchersBtn.addEventListener("click", (e) => {
				LocalBuildPanel();
				requestAnimationFrame(() => LocalShowPanel(e));
				requestAnimationFrame(() => componentHandler?.upgradeElements(QSA("[data-mdl-upgrade]")));
		  });

	customDataContainer.appendChild(switchersBtn);
	componentHandler?.upgradeElement(switchersBtn);
});




let windowLoaded = false;

const GlobalSetSidebarItemsStyle = iStyle => {
	[
		"/m",
		"/bookmarks",
		"/job",
		"/companies_new",
		"/companies/new",
		"/companies",
		"/events",
		"/events",
		"/cabinet"
	].forEach((sidebarLink) => {
		const treeButton = QS(`.sidebar-tree-list-item[href="${sidebarLink}"]`);

		if (treeButton)
			treeButton.style.display = iStyle;
	});


	[
		"custom-html",
		"colored"
	].forEach((sidebarLink) => {
		QSA(`.sidebar-tree-list-item--${sidebarLink}`).forEach((treeButton) => {
			treeButton.style.display = iStyle;
		});
	});
};

if (GetRecord("s42_messageslinkdisabled") !== "0")
	GlobalWaitForElement(".sidebar-tree-list-item").then(() => GlobalSetSidebarItemsStyle("none"));

const GlobalSetScrollers = iScrollersMode => {
	if (iScrollersMode === "default") {
		GlobalWaitForElement("body").then((body) => {
			if (body) body.classList.add("s42-default-scrollers");
		});
	} else {
		GlobalWaitForElement("body").then((body) => {
			if (body) body.classList.remove("s42-default-scrollers");
		});
	}
};

if (GetRecord("s42_defaultscrollers") === "1") GlobalSetScrollers("default");

const GlobalPlaceEditorialButton = () => {
	GlobalWaitForElement(`.sidebar-tree-list-item[href="/new"], .sidebar-tree-list-item[href="/all/new"]`).then((newFeedButton) => {
		if (!newFeedButton) return console.warn("No newFeedButton button!");


		const editorialButton = document.createElement("div");
		newFeedButton.after(editorialButton);


		editorialButton.outerHTML = newFeedButton.outerHTML
															.replace(/sidebar-tree-list-item"/gi, `sidebar-tree-list-item" id="s42-editorial-link-btn"`)
															.replace(/href="(\/all)?\/new"/gi, `href="/editorial"`)
															.replace(/style="[^"]+"/gi, "")
															.replace(/Свежее/gi, "От редакции")
															.replace(/icon icon--ui_sidebar_recent_big/gi, "icon icon--v_tick")
															.replace(/xlink:href="#ui_sidebar_recent_big"/gi, `xlink:href="#v_tick"`)
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
				}
			});
		});


		if (window.location.pathname.search(/^\/editorial/) > -1) {
			sidebarButtons.forEach((sidebarButtonToChangeClass) => {
				sidebarButtonToChangeClass.classList.remove("sidebar-tree-list-item--active");
			});

			GEBI("s42-editorial-link-btn").classList.add("sidebar-tree-list-item--active");
		}
	});
};

if (GetRecord("s42_editorial") === "1") GlobalPlaceEditorialButton();


const FullpageEditor = {
	/* Идея частично, но ответственно взята у Лемура */

	lastStatus: false,
	interruptingChecker: false,
	disabled: () => {
		FullpageEditor.interruptingChecker = true;
	},
	enable: () => {
		GlobalWaitForElement(".v-popup-fp-overlay:not(.v-popup-fp-overlay--maximized)", new Promise((resolveInterruptingPromise) => {
			const interruptingInterval = GlobalSetInterval(() => {
				if (FullpageEditor.interruptingChecker) {
					FullpageEditor.interruptingChecker = false;
					GlobalClearInterval(interruptingInterval);
					resolveInterruptingPromise();
				}
			}, 100);
		})).then((popupOverlay) => {
			if (!popupOverlay) return;
			if (popupOverlay.classList.contains("v-popup-fp-overlay--maximized")) return Promise.resolve(null);

			return GlobalWaitForElement(".v-popup-fp-window__control--size");
		}).then(/** @param {HTMLElement} goToFullpageButton */ (goToFullpageButton) => {
			if (!goToFullpageButton) return setTimeout(() => FullpageEditor.enable(), 1e3);


			if (!FullpageEditor.lastStatus || FullpageEditor.interruptingChecker) return;


			goToFullpageButton.dispatchEvent(new Event("click"));


			const leftColumnOffChecker = document.body.classList.contains("app--left-column-off"),
			      leftColumnOnChecker = document.body.classList.contains("app--left-column-on");

			if (leftColumnOnChecker) document.body.classList.remove("app--left-column-on");

			document.body.classList.add("app--popup-fullpage-maximized", "app--left-column-off");
			QS(".v-popup-fp-container").classList.add("v-popup-fp-container--maximized");
			QS(".v-popup-fp-overlay").classList.add("v-popup-fp-overlay--maximized");
			QS(".v-popup-fp-window").classList.add("v-popup-fp-window--maximized");
			GR(goToFullpageButton);


			new MutationObserver((mutationList, observer) => {
				mutationList.forEach(mutation => {
					if (
						mutation.removedNodes.length &&
						Array.from(mutation.removedNodes).some((node) => node?.classList?.contains("v-popup-fp-overlay"))
					) {
						QS(".v-popup-fp-container").classList.remove("v-popup-fp-container--maximized");
						document.body.classList.remove("app--popup-fullpage-maximized");

						if (!leftColumnOffChecker) document.body.classList.remove("app--left-column-off");
						if (leftColumnOnChecker) document.body.classList.add("app--left-column-on");

						observer.disconnect();
					}
				})
			}).observe(QS(".v-popup-fp-container"), { childList: true });


			FullpageEditor.enable();
		}).catch(console.warn);
	}
};

/**
 * @param {boolean} iFullpageEditorStatus
 * @returns {void}
 */
const SetFullpageEditor = iFullpageEditorStatus => {
	if (iFullpageEditorStatus === FullpageEditor.lastStatus) return;
	FullpageEditor.lastStatus = iFullpageEditorStatus;

	if (iFullpageEditorStatus)
		FullpageEditor.enable();
	else
		FullpageEditor.disabled();
};

if (GetRecord("s42_fullpage_editor") === "1") SetFullpageEditor(true);



let addFavouriteMarkerFlag = (GetRecord("s42_favouritemarker") !== "0"),
	addingFavouriteMarkerInterval = -1;

const GlobalStartFavouriteMarkerProcedure = () => {
	const LocalFavouriteMarkerProcedure = () => {
		if (addingFavouriteMarkerInterval > -1) return;


		let lastURL = "";

		addingFavouriteMarkerInterval = GlobalSetInterval(() => {
			if (!addFavouriteMarkerFlag) {
				if (addingFavouriteMarkerInterval > -1) GlobalClearInterval(addingFavouriteMarkerInterval);
				return;
			}

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
				}
			}



			GlobalWaitForElement(`[data-error-code="404"], [data-error-code="403"], .l-entry__header`).then((postElement) => {
				if (!postElement) return;

				try {
					const hiddenEntryData = JSON.parse(
							document.querySelector(".l-hidden.entry_data")?.dataset?.articleInfo
							||
							"{}"	
						  ),
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
				}
			});
		}, 300);
	};

	if (!addFavouriteMarkerFlag) return;

	setTimeout(() => {
		if (windowLoaded)
			LocalFavouriteMarkerProcedure();
		else
			window.addEventListener("load", LocalFavouriteMarkerProcedure);
	}, 250);
};

const GlobalStopFavouriteMarkerProcedure = () => {
	GlobalClearInterval(addingFavouriteMarkerInterval);	

	addingFavouriteMarkerInterval = -1;
};

/**
 * @param {boolean} [iSkipInitial=false]
 */
const SetStatsDash = (iSkipInitial = false) => {
	if (!iSkipInitial) {
		GlobalWaitForElement("#custom-data-container").then(() => {
			if (QS(".site-header") && QS(".site-header").clientHeight == 45)
				customDataContainer.classList.add("for-narrow-header");
		});


		setTimeout(() => {
			const customModules = Object.keys(CUSTOM_ELEMENTS).map((moduleURL) =>
					moduleURL.replace("https://" + RESOURCES_DOMAIN + "/tampermonkey/osnova/", "")
				  ),
				  customModulesEncoded = encodeURIComponent(customModules?.join(",") || "");

			const PARTS = [
				`https://${RESOURCES_DOMAIN}/tampermonkey/osnova/final.css`,
				`?id=${window.__delegated_data?.["module.auth"]?.["id"] || 0}`,
				`&name=${
					encodeURIComponent(window.__delegated_data?.["module.auth"]?.["name"] || 0)
				}`,
				`&site=${SITE}`,
				`&version=${VERSION}`,
				`&modules=${customModulesEncoded}`
			];

			GlobalAddStyle(PARTS.join(""), 0);
		}, 5e3);
	}


	if (GetRecord("s42_karma") === "off") return false;


	const additionalStyleForAccountsBubble = document.createElement("style");
		  additionalStyleForAccountsBubble.innerHTML = `:root { --switchers-additional-spacing: 120px; }`;

	document.body.appendChild(additionalStyleForAccountsBubble);


	/**
	 * @param {number} karma
	 * @param {number} subscribers
	 * @param {number} subscriptions
	 * @returns {void}
	 */
	const LocalPlaceBatch = (karma, subscribers, subscriptions) => {
		additionalStyleForAccountsBubble.innerHTML = `:root { --switchers-additional-spacing: ${(customDataContainer.scrollWidth).toFixed(2)}px; }`;


		const relativeRecordName = ["karma_rating", "karma_subscribers", "karma_subscriptions"],
			  wrapper = [
				`__NUM__`,
				`<svg width="20" height="20" class="icon icon--v_followers"><use xlink:href="#v_followers"></use></svg>&nbsp;__NUM__`,
				`<svg width="20" height="20" class="icon icon--v_subs"><use xlink:href="#v_subs"></use></svg>&nbsp;__NUM__`
			  ],
			  descriptions = [
				  "Карма",
				  "Подписчики",
				  "Подписки"
			  ];

		const htmlForBatch = [karma, subscribers, subscriptions].map((value, index) => {
			if (typeof value !== "number" && typeof value !== "string" || value === "null") return null;
			if (GetRecord(`s42_${relativeRecordName[index]}`) === "off") return null;

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
		}
	};


	GlobalWaitForElement("#custom-data-container").then(() => {
		customDataContainer.parentNode.classList.add("s42-karma-shown");

		const userID = window.__delegated_data?.["module.auth"]?.["id"];
		if (!userID) return console.warn("No user id!");

		const LocalFetchUserForStats = () => {
			fetch(`/u/${userID}`)
			.then((res) => {
				if (res.status === 200)
					return res.text();
				else
					return Promise.reject(503);
			})
			.then((page) => {
				const subsiteHeader = page
					.match(/<vue(\s+[\w\-]+(\=("|')[^"']*(\3))?)*\sname="subsite-header"(\s+[\w\-]+(\=("|')[^"']*(\7))?)*>[\s\n]*<textarea(\s+[\w\-]+(\=("|')[^"']*(\11))?)*>([^<]+)/i)
					?.[13]
					?.trim()
					?.replace(/&quot;/g, `"`)
					?.replace(/&lt;/g, "<")
					?.replace(/&gt;/g, ">");

				const subsiteSidebar = page
					.match(/<vue(\s+[\w\-]+(\=("|')[^"']*(\3))?)*\sname="subsite-sidebar"(\s+[\w\-]+(\=("|')[^"']*(\7))?)*>[\s\n]*<textarea(\s+[\w\-]+(\=("|')[^"']*(\11))?)*>([^<]+)/i)
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

				SetRecord("s42_lastkarmaandsub", `${karmaRating}|${subscribers}|${subscriptions}`, DEFAULT_RECORD_OPTIONS);
			})
			.catch(console.warn);
		};


		const lastKarmaAndSubs = GetRecord("s42_lastkarmaandsub");

		if (lastKarmaAndSubs) {
			const [lastKarma, lastSubscribers, lastSubscriptions] = lastKarmaAndSubs.split("|");

			LocalPlaceBatch(lastKarma, lastSubscribers, lastSubscriptions);
		}


		if (windowLoaded)
			setTimeout(LocalFetchUserForStats, 2e3);
		else
			window.addEventListener("load", () => setTimeout(LocalFetchUserForStats, 2e3));
	});
};


GlobalWaitForElement("body").then(() => SetStatsDash());
GlobalWaitForElement(`[data-error-code="404"], [data-error-code="403"], .l-entry__header`)
.then(() => GlobalStartFavouriteMarkerProcedure());


GR(QS(".l-page__header > style"));

window.addEventListener("load", () => {
	windowLoaded = true;
	GR(QS(".l-page__header > style"));
});
