const { GR, WaitForElement } = require('../util/dom.js');

const RemoveCustomStyles = () =>
  WaitForElement('.l-page__header > style, #custom_subsite_css').then((customStyle) => {
    GR(customStyle);
    RemoveCustomStyles();
  });

if (document.readyState === 'complete') RemoveCustomStyles();
else window.addEventListener('load', RemoveCustomStyles);

module.exports = {};
