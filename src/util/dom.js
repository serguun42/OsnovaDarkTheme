const { RESOURCES_ROOT } = require("../config/sites");
const { ALL_MODULES } = require("./modules-list");

/**
 * @param {String} query
 * @param {HTMLElement} [parent]
 * @returns {HTMLElement}
 */
const QS = (query, parent) => (parent || document).querySelector(query);

/**
 * @param {String} query
 * @param {HTMLElement} [parent]
 * @returns {HTMLElement[]}
 */
const QSA = (query, parent) => Array.from((parent || document).querySelectorAll(query));

/**
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
 * @typedef {Object} ObserverQueueItem
 * @property {string} [tag]
 * @property {string} [id]
 * @property {string} [className]
 * @property {{name: string, value: string}} [attribute]
 * @property {ObserverQueueItem} [parent]
 * @property {ObserverQueueItem} [not]
 * @property {(foundElem: HTMLElement) => void} resolver
 */
/** @type {ObserverQueueItem[]} */
const observerQueue = [];

const mainObserber = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		const { addedNodes, removedNodes, target, nextSibling, previousSibling } = mutation;
		const mutatedNodes = [...addedNodes, ...removedNodes, target, nextSibling, previousSibling];


		/**
		 * @param {ObserverQueueItem} waitingElemSelector
		 * @param {HTMLElement} addedNode
		 * @returns {boolean}
		 */
		const LocalCheckNode = (waitingElemSelector, addedNode) => {
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

			if (waitingElemSelector.className) {
				if (addedNode.classList.contains(waitingElemSelector.className))
					atLeastOneMatch = true;
				else
					return false;
			}

			if (waitingElemSelector.attribute?.name) {
				if (addedNode.getAttribute(waitingElemSelector.attribute.name) === waitingElemSelector.attribute.value)
					atLeastOneMatch = true;
				else
					return false;
			}

			if (!atLeastOneMatch) return false;

			if (waitingElemSelector.not) {
				const notCheck = LocalCheckNode(waitingElemSelector.not, addedNode);
				if (notCheck) return false;
			}

			if (waitingElemSelector.parent) {
				const parentCheck = LocalCheckNode(waitingElemSelector.parent, addedNode.parentElement || addedNode.parentNode);
				return parentCheck;
			} else
				return true;
		};


		observerQueue.forEach((waitingElemSelector, waitingElemIndex, waitingElemsArr) => {
			const foundNode = Array.from(mutatedNodes).find((addedNode) => LocalCheckNode(waitingElemSelector, addedNode));

			if (!foundNode) return;

			if (waitingElemSelector.resolver)
				waitingElemSelector.resolver(foundNode);

			waitingElemsArr.splice(waitingElemIndex, 1);
		});
	});
});

mainObserber.observe(document, {
	childList: true,
	subtree: true,
	attributes: false,
	characterData: false
});

const INTERVALS_COUNTERS = {
	created: 0,
	deleted: 0
}

if (process.env.NODE_ENV === "development")
	window.S42_INTERVALS_COUNTERS = () => console.warn(`INTERVALS_COUNTERS: ${JSON.stringify(INTERVALS_COUNTERS, false, "\t")}`);

/**
 * @param {() => void} iCallback
 * @param {number} iDelay
 * @returns {number}
 */
const SetCustomInterval = (iCallback, iDelay) => {
	if (!iCallback || !iDelay) return -1;

	++INTERVALS_COUNTERS.created;
	return setInterval(iCallback, iDelay);
}

/**
 * @param {number} iIntervalID
 */
const ClearCustomInterval = iIntervalID => {
	if (iIntervalID < 0) return;

	try {
		clearInterval(iIntervalID);
		++INTERVALS_COUNTERS.deleted;
	} catch (e) {
		console.warn(e);
	}
}

/**
 * @param {string | ObserverQueueItem} iKey
 * @param {false | Promise} [iWaitAlways=false]
 * @returns {Promise<HTMLElement>}
 */
const WaitForElement = (iKey, iWaitAlways = false) => {
	const existing = QS(iKey);
	if (existing) return Promise.resolve(existing);


	/**
	 * @param {string} fullSingleQuery
	 * @returns {Promise<HTMLElement>}
	 */
	const LocalWaitUntilSignleElem = (fullSingleQuery) => {
		/**
		 * @param {string} subSingleQuery
		 * @returns {ObserverQueueItem | null}
		 */
		const LocalBuildObserverQueueItem = (subSingleQuery) => {
			if (!subSingleQuery) return null;

			const parentMatch = subSingleQuery.match(/^(?<parent>.*)(?:\s\>\s)(?<child>[^\>]+)$/);
			if (parentMatch)
				subSingleQuery = parentMatch.groups?.["child"];

			const tagName = subSingleQuery.split(/#|\.|\[/)[0],
				  id = subSingleQuery.match(/#([\w\-]+)/i)?.[1],
				  className = subSingleQuery.match(/\.([\w\-]+(\.[\w\-]+)*)/)?.[1],
				  attributeMatch = subSingleQuery.match(/\[(?<attributeName>[\w\-]+)=(["'])(?<attributeValue>[^"']+)\2\]/i) || [];

			/** @type {ObserverQueueItem} */
			const observerQueueSubItem = {};
			if (tagName) observerQueueSubItem.tag = tagName;
			if (id) observerQueueSubItem.id = id;
			if (className) observerQueueSubItem.className = className;
			if (attributeMatch[1] && attributeMatch[2])
				observerQueueSubItem.attribute = {
					name: attributeMatch?.groups?.["attributeName"],
					value: attributeMatch?.groups?.["attributeValue"]
				};

			if (parentMatch)
				observerQueueSubItem.parent = LocalBuildObserverQueueItem(parentMatch.groups?.["parent"]);

			return observerQueueSubItem;
		}


		const selectorMainPart = fullSingleQuery.split(":not(")[0],
			  selectorNotPart = fullSingleQuery.split(":not(")[1]?.slice(0, -1),
			  selectorForQueue = LocalBuildObserverQueueItem(selectorMainPart);

		if (selectorNotPart)
			selectorForQueue.not = LocalBuildObserverQueueItem(selectorNotPart);


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
				const backupInterval = SetCustomInterval(() => {
					const found = QS(fullSingleQuery);

					if (found) {
						ClearCustomInterval(backupInterval);
						return resolve(found);
					}

					if (++intervalCounter > 50 && !iWaitAlways) {
						ClearCustomInterval(backupInterval);
						return resolve(null);
					}

					if (iWaitAlways && iWaitAlways instanceof Promise)
						iWaitAlways.then(() => {
							ClearCustomInterval(backupInterval);
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
const Animate = (iDuration, iStyleSettingFunc, iCurveStyle = "ease-in-out", iSkipProgress = 0) => new Promise((resolve) => {
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

/** @type {{ [customElementName: string]: HTMLElement }} */
const CUSTOM_ELEMENTS = {};

/**
 * @param {string} iModuleName
 * @param {boolean} iStatus
 * @param {boolean} [iWithoutPrefix=false]
 */
const ManageModule = (iModuleName, iStatus, iWithoutPrefix = false) => {
	if (iModuleName === "dark" && iStatus)
		WaitForElement("body").then((body) => {
			if (body) body.classList.add("s42-is-dark");
		});

	if (iModuleName === "light" && iStatus)
		WaitForElement("body").then((body) => {
			if (body) body.classList.remove("s42-is-dark");
		});


	const moduleURL = `${RESOURCES_ROOT}${(iWithoutPrefix ? "" : "osnova_") + iModuleName}.css`;

	if (CUSTOM_ELEMENTS[moduleURL] && !iStatus) {
		WaitForElement("body").then((body) => {
			if (body) body.classList.remove(`s42-${iModuleName.replace(/^osnova_/, "").replace(/_/g, "-")}`);
		});

		GR(CUSTOM_ELEMENTS[moduleURL]);
		delete CUSTOM_ELEMENTS[moduleURL];
	} else if (!CUSTOM_ELEMENTS[moduleURL] && iStatus) {
		const moduleSpecWithPriority = ALL_MODULES.find((moduleSpec) => moduleSpec.name === iModuleName);

		AddStyle(moduleURL, moduleSpecWithPriority.priority, iModuleName);
	}
};

/**
 * @param {string} iLink
 * @param {number} iPriority
 * @param {string} [iModuleName]
 */
const AddStyle = (iLink, iPriority, iModuleName = "") => {
	const stylesNode = document.createElement("link");
		  stylesNode.setAttribute("data-priority", iPriority);
		  stylesNode.setAttribute("data-author", "serguun42");
		  stylesNode.setAttribute("rel", "stylesheet");
		  stylesNode.setAttribute("href", iLink);


	if (iModuleName) {
		WaitForElement("body").then((body) => {
			if (body) body.classList.add(`s42-${iModuleName.replace(/^osnova_/, "").replace(/_/g, "-")}`);
		});
	}


	WaitForElement(`#container-for-custom-elements-${iPriority}`).then(
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
const AddScript = (iLink, iPriority) => {
	const scriptNode = document.createElement("script");
		  scriptNode.setAttribute("data-priority", iPriority);
		  scriptNode.setAttribute("data-author", "serguun42");
		  scriptNode.setAttribute("src", iLink);


	WaitForElement(`#container-for-custom-elements-${iPriority}`).then(
		/** @param {HTMLElement} containerToPlace */ (containerToPlace) => {
			if (!containerToPlace) return;

			containerToPlace.appendChild(scriptNode);
			CUSTOM_ELEMENTS[iLink] = scriptNode;
		}
	);
};

/**
 * @typedef {Event & MouseEvent & TouchEvent & KeyboardEvent & { currentTarget: HTMLElement }} GenericEventType
 */
/**
 * @callback GlobalBuildLayoutListenerCallback
 * @param {GenericEventType} e
 */
/**
 * @typedef {object} ElementDescriptorType
 * @property {string} [tag]
 * @property {string} [class]
 * @property {string} [id]
 * @property {string} [text]
 * @property {string} [html]
 * @property {boolean} [ripple]
 * @property {boolean} [mdlUpgrade]
 * @property {(thisElem: HTMLElement) => void} [mounted]
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
 * @param {string | number | Function} iAdditionalHandlingPropertyValue
 * @param {ElementDescriptorType} iElemDesc
 * @param {HTMLElement} iDocElem
 * @param {HTMLElement} iParentElem
 * @returns {void}
 */
/**
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
	const LocalBuildElement = (element) => {
		if (!element) return;

		const docElem = document.createElement(element.tag || "div");
		if (element.class) docElem.className = element.class;
		if (element.id) docElem.id = element.id;
		if (element.data)
			for (const dataPropName in element.data)
				docElem.dataset[dataPropName] = (
					typeof element.data[dataPropName] == "object" ?
						JSON.stringify(element.data[dataPropName])
					:
						(element.data[dataPropName] === true ? "" : element.data[dataPropName])
				);
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

			if (element.contextSameAsClick)
				docElem.addEventListener("contextmenu", (e) => {
					e.preventDefault();
					element.onclick(e);
					return false;
				});
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


		if (typeof element.mounted == "function")
			element.mounted(docElem);
	};


	if (elements instanceof Array)
		elements.forEach((element) => LocalBuildElement(element));
	else
		LocalBuildElement(elements);
};

module.exports = {
	QS, QSA, GEBI, GR,
	SetCustomInterval,
	ClearCustomInterval,
	WaitForElement,
	Animate,
	CUSTOM_ELEMENTS,
	ManageModule,
	AddStyle,
	AddScript,
	GlobalBuildLayout
};
