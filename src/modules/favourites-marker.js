const { SetCustomInterval, ClearCustomInterval, WaitForElement, QSA, QS } = require('../util/dom.js');
const { GetRecord } = require('../util/storage.js');

let favouriteMarkerInterval = -1;

const StartFavouriteMarkerProcedure = () => {
  const favouriteMarkerEnabled = GetRecord('s42_favouritemarker') !== '0';

  const LocalFavouriteMarkerProcedure = () => {
    if (favouriteMarkerInterval > -1) return;

    let lastURL = '';

    favouriteMarkerInterval = SetCustomInterval(() => {
      if (!favouriteMarkerEnabled) {
        if (favouriteMarkerInterval > -1) ClearCustomInterval(favouriteMarkerInterval);
        return;
      }

      if (lastURL === window.location.pathname) return;
      if (QS('.main_progressbar--in_process')) return;

      lastURL = window.location.pathname;

      /* Actual Cache Procedure */
      let cURL = lastURL;
      let id = -2;

      if (cURL.slice(0, 3) === '/u/') {
        cURL = cURL.slice(1).split('/');
        if (cURL.length < 3) return;

        id = parseInt(cURL[2]);
        if (Number.isNaN(id)) return;
      } else {
        if (cURL.slice(0, 3) === '/m/') return;

        if (cURL.slice(0, 3) === '/s/') cURL = cURL.slice(3);
        else cURL = cURL.slice(1);

        if (!cURL) return;

        cURL = cURL.split('/');
        if (cURL.length >= 2) {
          id = parseInt(cURL[1]);
          if (Number.isNaN(id)) return;
        } else if (cURL.length) {
          id = parseInt(cURL[0]);
          if (Number.isNaN(id)) return;
        }
      }

      WaitForElement(`[data-error-code="404"], [data-error-code="403"], .l-entry__header`).then((postElement) => {
        if (!postElement) return;

        try {
          const hiddenEntryData = JSON.parse(QS('.l-hidden.entry_data')?.dataset?.articleInfo || '{}');
          const favouritesCount = hiddenEntryData.favorites;

          QSA('.l-entry .bookmark').forEach((bookmarkElem) => {
            const vueDataHashAttribute = bookmarkElem
              .getAttributeNames()
              .filter((attributeName) => /^data-v/i.test(attributeName))?.[0];
            if (!vueDataHashAttribute) return;

            const bookmarkTitle = QS('.bookmark__title', bookmarkElem) || document.createElement('div');
            bookmarkTitle.className = 'bookmark__title';
            bookmarkTitle.setAttribute(vueDataHashAttribute, '');
            bookmarkTitle.innerText = favouritesCount || '';

            bookmarkElem.appendChild(bookmarkTitle);
            bookmarkElem.classList.add('bookmark--s42-with-marker');

            bookmarkElem.addEventListener('click', (e) => {
              const active = (e.currentTarget || e.target).classList.contains('bookmark--active');
              const currentCount = parseInt(bookmarkTitle.innerText) || 0;

              if (active) bookmarkTitle.innerText = currentCount + 1;
              else bookmarkTitle.innerText = currentCount - 1;
            });
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Cannot place favourites counter', e);
        }
      });
    }, 300);
  };

  if (!favouriteMarkerEnabled) return;

  setTimeout(() => {
    if (document.readyState === 'complete') LocalFavouriteMarkerProcedure();
    else window.addEventListener('load', LocalFavouriteMarkerProcedure);
  }, 250);
};

const StopFavouriteMarkerProcedure = () => {
  ClearCustomInterval(favouriteMarkerInterval);

  favouriteMarkerInterval = -1;
};

WaitForElement(`[data-error-code="404"], [data-error-code="403"], .l-entry__header`).then(
  StartFavouriteMarkerProcedure
);

module.exports = {
  StartFavouriteMarkerProcedure,
  StopFavouriteMarkerProcedure,
};
