const { WaitForElement } = require('../util/dom.js');
const { GetRecord } = require('../util/storage.js');

/**
 * @param {"default" | "custom"} scrollersMode
 * @returns {void}
 */
const SetScrollers = (scrollersMode) =>
  WaitForElement('body').then((body) => {
    if (!body) return;

    if (scrollersMode === 'default') body.classList.add('s42-default-scrollers');
    else body.classList.remove('s42-default-scrollers');
  });

if (GetRecord('s42_defaultscrollers') === '1') SetScrollers('default');

module.exports = { SetScrollers };
