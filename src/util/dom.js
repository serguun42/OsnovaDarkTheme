const { RESOURCES_ROOT } = require('../config/sites.js');
const { ALL_MODULES } = require('./modules-list.js');

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
const GEBI = (query) => document.getElementById(query);

/**
 * Remove element
 *
 * @param {HTMLElement} elem
 * @returns {void}
 */
const GR = (elem) => elem?.remove?.();

/** @type {import('../../types').ObserverQueueItem[]} */
const observerQueue = [];

const mainObserber = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const { addedNodes, removedNodes, target, nextSibling, previousSibling } = mutation;
    const mutatedNodes = [...addedNodes, ...removedNodes, target, nextSibling, previousSibling];

    /**
     * @param {import('../../types').ObserverQueueItem} waitingElemSelector
     * @param {HTMLElement} addedNode
     * @returns {boolean}
     */
    const LocalCheckNode = (waitingElemSelector, addedNode) => {
      if (!(addedNode instanceof HTMLElement)) return false;

      let atLeastOneMatch = false;

      if (waitingElemSelector.tag) {
        if (waitingElemSelector.tag === addedNode.tagName.toLowerCase()) atLeastOneMatch = true;
        else return false;
      }

      if (waitingElemSelector.id) {
        if (waitingElemSelector.id === addedNode.id) atLeastOneMatch = true;
        else return false;
      }

      if (waitingElemSelector.className) {
        if (addedNode.classList.contains(waitingElemSelector.className)) atLeastOneMatch = true;
        else return false;
      }

      if (waitingElemSelector.attribute?.name) {
        if (addedNode.getAttribute(waitingElemSelector.attribute.name) === waitingElemSelector.attribute.value)
          atLeastOneMatch = true;
        else return false;
      }

      if (!atLeastOneMatch) return false;

      if (waitingElemSelector.not) {
        const notCheck = LocalCheckNode(waitingElemSelector.not, addedNode);
        if (notCheck) return false;
      }

      if (waitingElemSelector.parent) {
        const parentCheck = LocalCheckNode(waitingElemSelector.parent, addedNode.parentElement || addedNode.parentNode);
        return parentCheck;
      }

      return true;
    };

    observerQueue.forEach((waitingElemSelector, waitingElemIndex, waitingElemsArr) => {
      const foundNode = Array.from(mutatedNodes).find((addedNode) => LocalCheckNode(waitingElemSelector, addedNode));

      if (!foundNode) return;

      if (waitingElemSelector.resolver) waitingElemSelector.resolver(foundNode);

      waitingElemsArr.splice(waitingElemIndex, 1);
    });
  });
});

mainObserber.observe(document, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});

const INTERVALS_COUNTERS = {
  created: 0,
  deleted: 0,
};

if (process.env.NODE_ENV === 'development')
  window.S42_INTERVALS_COUNTERS = () =>
    // eslint-disable-next-line no-console
    console.warn(`INTERVALS_COUNTERS: ${JSON.stringify(INTERVALS_COUNTERS, false, '\t')}`);

/**
 * @param {() => void} callback
 * @param {number} delay
 * @returns {number}
 */
const SetCustomInterval = (callback, delay) => {
  if (!callback || !delay) return -1;

  ++INTERVALS_COUNTERS.created;
  return setInterval(callback, delay);
};

/**
 * @param {number} intervalID
 */
const ClearCustomInterval = (intervalID) => {
  if (intervalID < 0) return;

  try {
    clearInterval(intervalID);
    ++INTERVALS_COUNTERS.deleted;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
  }
};

/**
 * @param {string | import('../../types').ObserverQueueItem} elementSelector
 * @param {Promise} [waitForever=false]
 * @returns {Promise<HTMLElement>}
 */
const WaitForElement = (elementSelector, waitForever) => {
  const existing = QS(elementSelector);
  if (existing) return Promise.resolve(existing);

  /**
   * @param {string} fullSingleQuery
   * @returns {Promise<HTMLElement>}
   */
  const LocalWaitUntilSignleElem = (fullSingleQuery) => {
    /**
     * @param {string} subSingleQuery
     * @returns {import('../../types').ObserverQueueItem | null}
     */
    const LocalBuildObserverQueueItem = (subSingleQuery) => {
      if (!subSingleQuery) return null;

      const parentMatch = subSingleQuery.match(/^(?<parent>.*)(?:\s>\s)(?<child>[^>]+)$/);
      if (parentMatch) subSingleQuery = parentMatch.groups?.child;

      const tagName = subSingleQuery.split(/#|\.|\[/)[0];
      const id = subSingleQuery.match(/#([\w-]+)/i)?.[1];
      const className = subSingleQuery.match(/\.([\w-]+(\.[\w-]+)*)/)?.[1];
      const attributeMatch =
        subSingleQuery.match(/\[(?<attributeName>[\w-]+)=(["'])(?<attributeValue>[^"']+)\2\]/i) || [];

      /** @type {import('../../types').ObserverQueueItem} */
      const observerQueueSubItem = {};
      if (tagName) observerQueueSubItem.tag = tagName;
      if (id) observerQueueSubItem.id = id;
      if (className) observerQueueSubItem.className = className;
      if (attributeMatch[1] && attributeMatch[2])
        observerQueueSubItem.attribute = {
          name: attributeMatch?.groups?.attributeName,
          value: attributeMatch?.groups?.attributeValue,
        };

      if (parentMatch) observerQueueSubItem.parent = LocalBuildObserverQueueItem(parentMatch.groups?.parent);

      return observerQueueSubItem;
    };

    const selectorMainPart = fullSingleQuery.split(':not(')[0];
    const selectorNotPart = fullSingleQuery.split(':not(')[1]?.slice(0, -1);
    const selectorForQueue = LocalBuildObserverQueueItem(selectorMainPart);

    if (selectorNotPart) selectorForQueue.not = LocalBuildObserverQueueItem(selectorNotPart);

    return new Promise((resolve) => {
      observerQueue.push({
        ...selectorForQueue,
        resolver: resolve,
      });

      setTimeout(() => {
        const foundQueueItemIndex = observerQueue.findIndex(({ resolver }) => resolver === resolve);

        if (foundQueueItemIndex < 0) return;

        observerQueue.splice(foundQueueItemIndex, 1);

        let intervalCounter = 0;
        const backupInterval = SetCustomInterval(() => {
          const found = QS(fullSingleQuery);

          if (found) {
            ClearCustomInterval(backupInterval);
            resolve(found);
            return;
          }

          if (++intervalCounter > 50 && !waitForever) {
            ClearCustomInterval(backupInterval);
            resolve(null);
            return;
          }

          if (waitForever && waitForever instanceof Promise)
            waitForever
              .then(() => {
                ClearCustomInterval(backupInterval);
                return resolve(null);
              })
              // eslint-disable-next-line no-console
              .catch(console.warn);
        }, 300);
      }, 1e3);
    });
  };

  return Promise.race(elementSelector.split(', ').map(LocalWaitUntilSignleElem));
};

/**
 * @param {number} duration
 * @param {(progress: number) => void} styleSettingFunc - Function for setting props by progress
 * @param {import('../../types').AnimationCurveStyle} [curveStyle="ease-in-out"] - Curve Style
 * @param {number} [skipProgress=0] - How many of progress to skip, ranges from `0` to `1`
 * @returns {Promise<null>}
 */
const Animate = (duration, styleSettingFunc, curveStyle = 'ease-in-out', skipProgress = 0) =>
  new Promise((resolve) => {
    const startTime = performance.now();

    const LocalAnimation = (passedTime) => {
      passedTime -= startTime;
      if (passedTime < 0) passedTime = 0;

      let cProgress = passedTime / duration + skipProgress;
      if (cProgress < 1) {
        if (curveStyle === 'ease-in-out') {
          if (cProgress < 0.5) cProgress = (cProgress * 2) ** 2.75 / 2;
          else cProgress = 1 - ((1 - cProgress) * 2) ** 2.75 / 2;
        } else if (curveStyle === 'ease-in-out-slow') {
          if (cProgress < 0.5) cProgress = (cProgress * 2) ** 2.25 / 2;
          else cProgress = 1 - ((1 - cProgress) * 2) ** 2.25 / 2;
        } else if (curveStyle === 'ease-in') {
          cProgress **= 1.75;
        } else if (curveStyle === 'ease-out') {
          cProgress = 1 - (1 - cProgress) ** 1.75;
        } else if (curveStyle === 'ripple') {
          cProgress = 0.6 * cProgress ** (1 / 3) + 1.8 * cProgress ** (2 / 3) - 1.4 * cProgress;
        }

        styleSettingFunc(cProgress);

        requestAnimationFrame(LocalAnimation);
      } else {
        styleSettingFunc(1);

        resolve();
      }
    };

    requestAnimationFrame(LocalAnimation);
  });

/** @type {{ [customElementName: string]: HTMLElement }} */
const CUSTOM_ELEMENTS = {};

/**
 * @param {string} url
 * @param {number} priority
 * @param {string} [moduleName]
 */
const AddStyle = (url, priority, moduleName = '') => {
  const stylesNode = document.createElement('link');
  stylesNode.setAttribute('data-priority', priority);
  stylesNode.setAttribute('data-author', 'serguun42');
  stylesNode.setAttribute('rel', 'stylesheet');
  stylesNode.setAttribute('href', url);

  if (moduleName) {
    WaitForElement('body').then((body) => {
      if (body) body.classList.add(`s42-${moduleName.replace(/^osnova_/, '').replace(/_/g, '-')}`);
    });
  }

  WaitForElement(`#container-for-custom-elements-${priority}`).then(
    /** @param {HTMLElement} containerToPlace */ (containerToPlace) => {
      if (!containerToPlace) return;

      containerToPlace.appendChild(stylesNode);
      CUSTOM_ELEMENTS[url] = stylesNode;
    }
  );
};

/**
 * @param {string} moduleName
 * @param {boolean} enable
 * @param {boolean} [removePrefix]
 */
const ManageModule = (moduleName, enable, removePrefix) => {
  if (moduleName === 'dark' && enable)
    WaitForElement('body').then((body) => {
      if (body) body.classList.add('s42-is-dark');
    });

  if (moduleName === 'light' && enable)
    WaitForElement('body').then((body) => {
      if (body) body.classList.remove('s42-is-dark');
    });

  const moduleURL = `${RESOURCES_ROOT}${(removePrefix ? '' : 'osnova_') + moduleName}.css`;

  if (CUSTOM_ELEMENTS[moduleURL] && !enable) {
    WaitForElement('body').then((body) => {
      if (body) body.classList.remove(`s42-${moduleName.replace(/^osnova_/, '').replace(/_/g, '-')}`);
    });

    GR(CUSTOM_ELEMENTS[moduleURL]);
    delete CUSTOM_ELEMENTS[moduleURL];
  } else if (!CUSTOM_ELEMENTS[moduleURL] && enable) {
    const moduleSpecWithPriority = ALL_MODULES.find((moduleSpec) => moduleSpec.name === moduleName);

    AddStyle(moduleURL, moduleSpecWithPriority.priority, moduleName);
  }
};

/**
 * @param {string} url
 * @param {number} priority
 */
const AddScript = (url, priority) => {
  const scriptNode = document.createElement('script');
  scriptNode.setAttribute('data-priority', priority);
  scriptNode.setAttribute('data-author', 'serguun42');
  scriptNode.setAttribute('src', url);

  WaitForElement(`#container-for-custom-elements-${priority}`).then(
    /** @param {HTMLElement} containerToPlace */ (containerToPlace) => {
      if (!containerToPlace) return;

      containerToPlace.appendChild(scriptNode);
      CUSTOM_ELEMENTS[url] = scriptNode;
    }
  );
};

/**
 * @param {import('../../types').ElementDescriptorType[] | import('../../types').ElementDescriptorType} descriptors
 * @param {HTMLElement} container
 * @param {boolean} [clearContainer]
 * @returns {void}
 */
const GlobalBuildLayout = (descriptors, container, clearContainer = true) => {
  if (clearContainer) container.innerHTML = null;

  /**
   * @param {import('../../types').ElementDescriptorType} descriptor
   */
  const LocalBuildElement = (descriptor) => {
    if (!descriptor) return;

    const docElem = document.createElement(descriptor.tag || 'div');
    if (descriptor.class) docElem.className = descriptor.class;
    if (descriptor.id) docElem.id = descriptor.id;
    if (descriptor.data)
      Object.keys(descriptor.data).forEach((dataPropName) => {
        docElem.dataset[dataPropName] =
          typeof descriptor.data[dataPropName] === 'object'
            ? JSON.stringify(descriptor.data[dataPropName])
            : descriptor.data[dataPropName] === true
            ? ''
            : descriptor.data[dataPropName];
      });
    if (descriptor.tags)
      Object.keys(descriptor.tags).forEach((attributeName) =>
        docElem.setAttribute(attributeName, descriptor.tags[attributeName])
      );
    if (descriptor.attr)
      Object.keys(descriptor.attr).forEach((attributeName) =>
        docElem.setAttribute(attributeName, descriptor.attr[attributeName])
      );

    if ('text' in descriptor && descriptor.text !== null) docElem.innerText = descriptor.text;
    else if ('html' in descriptor && descriptor.html !== null) docElem.innerHTML = descriptor.html;
    else if (descriptor.children) GlobalBuildLayout(descriptor.children, docElem, false);
    else if (descriptor.child) GlobalBuildLayout(descriptor.child, docElem, false);

    if (descriptor.ripple) docElem.classList.add('mdl-js-button', 'mdl-js-ripple-effect');
    if ((descriptor.mdlUpgrade || descriptor.ripple) && typeof componentHandler !== 'undefined')
      // eslint-disable-next-line no-undef
      componentHandler.upgradeElement(docElem);

    if (descriptor.onclick) {
      docElem.addEventListener('click', descriptor.onclick);

      if (descriptor.contextSameAsClick)
        docElem.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          descriptor.onclick(e);
          return false;
        });
    }

    if (descriptor.listener)
      Object.keys(descriptor.listener).forEach((listenerName) =>
        docElem.addEventListener(listenerName, descriptor.listener[listenerName])
      );

    if (descriptor.listeners)
      Object.keys(descriptor.listeners).forEach((listenerName) =>
        docElem.addEventListener(listenerName, descriptor.listeners[listenerName])
      );

    container.appendChild(docElem);

    if (typeof descriptor.mounted === 'function') descriptor.mounted(docElem);
  };

  if (descriptors instanceof Array) descriptors.forEach((descriptor) => LocalBuildElement(descriptor));
  else LocalBuildElement(descriptors);
};

module.exports = {
  QS,
  QSA,
  GEBI,
  GR,
  SetCustomInterval,
  ClearCustomInterval,
  WaitForElement,
  Animate,
  CUSTOM_ELEMENTS,
  ManageModule,
  AddStyle,
  AddScript,
  GlobalBuildLayout,
};
