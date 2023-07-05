/**
 * Jul 2023
 * Original code from Andrey Anapasik a.k.a. Suvitruf
 * @see https://github.com/Suvitruf/dtf-scripts/blob/master/plus-popup-remover/plus_popup_remover.user.js
 * @license 'The Unlicense'
 */

const { GetRecord } = require('../util/storage.js');

const RemovePlusPopup = {
  lastStatus: false,
  interruptingChecker: false,
  disabled: () => {
    /** Remove observer */
    RemovePlusPopup.observer.disconnect();
    RemovePlusPopup.interruptingChecker = true;
  },
  enable: () => {
    RemovePlusPopup.interruptingChecker = false;
    /** Sub observer */
    RemovePlusPopup.observer.observe(RemovePlusPopup.getContainer(), {
      characterData: false,
      attributes: true,
      childList: true,
      subtree: false,
    });
  },

  /**
   * Root container (usually `document.body`)
   * @returns {HTMLElement}
   */
  getContainer: () => document.querySelector('.app--content-entry') || document.body,
  observer: new MutationObserver(() => {
    if (RemovePlusPopup.interruptingChecker) return;

    const plusPopup = document.querySelector('.plus-sheet');

    /** If popup is present */
    if (plusPopup) {
      const container = RemovePlusPopup.getContainer();
      if (!container) return;

      /** Restore scroll */
      container.style.overflow = '';
      /** Remove actual popup element */
      container.removeChild(plusPopup.parentNode.parentNode.parentNode);
    }
  }),
};

/**
 * @param {boolean} plusPopupRemovalStatus
 * @returns {void}
 */
const SetRemovePlusPopup = (plusPopupRemovalStatus) => {
  if (plusPopupRemovalStatus === RemovePlusPopup.lastStatus) return;
  RemovePlusPopup.lastStatus = plusPopupRemovalStatus;

  if (plusPopupRemovalStatus) RemovePlusPopup.enable();
  else RemovePlusPopup.disabled();
};

if (GetRecord('s42_remove_plus_popup') !== '0') setTimeout(() => SetRemovePlusPopup(true), Math.random() * 1000 + 1000);

module.exports = {
  RemovePlusPopup,
  SetRemovePlusPopup,
};
