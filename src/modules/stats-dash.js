const { RESOURCES_ROOT, SITE, VERSION } = require('../config/sites.js');
const { WaitForElement, AddStyle, CUSTOM_ELEMENTS, GEBI, GR, QS } = require('../util/dom.js');
const { GetRecord, SetRecord } = require('../util/storage.js');

/**
 * @param {boolean} [skipInitial]
 */
const SetStatsDash = (skipInitial) => {
  if (!skipInitial) {
    WaitForElement('#navigation-user-themes').then((navigationUserThemes) => {
      if (QS('.site-header') && QS('.site-header').clientHeight === 45)
        navigationUserThemes.classList.add('for-narrow-header');
    });

    setTimeout(() => {
      const customModules = Object.keys(CUSTOM_ELEMENTS).map((moduleURL) => moduleURL.replace(`${RESOURCES_ROOT}`, ''));
      const customModulesEncoded = encodeURIComponent(customModules?.join(',') || '');

      const PARTS = [
        `${RESOURCES_ROOT}final.css`,
        `?id=${window.__delegated_data?.['module.auth']?.id || 0}`,
        `&name=${encodeURIComponent(window.__delegated_data?.['module.auth']?.name || 0)}`,
        `&site=${SITE}`,
        `&version=${VERSION}`,
        `&modules=${customModulesEncoded}`,
      ];

      AddStyle(PARTS.join(''), 0);
    }, 5e3);
  }

  if (GetRecord('s42_karma') === 'off') return;

  const additionalStyleForAccountsBubble = document.createElement('style');
  additionalStyleForAccountsBubble.innerHTML = `:root { --switchers-additional-spacing: 120px; }`;

  document.body.appendChild(additionalStyleForAccountsBubble);
  document.body.classList.add('s42-stats-dash');

  /**
   * @param {number} karma
   * @param {number} subscribers
   * @param {number} subscriptions
   * @param {HTMLElement} navigationUserThemes
   * @returns {void}
   */
  const LocalPlaceBatch = (karma, subscribers, subscriptions, navigationUserThemes) => {
    const relativeRecordName = ['karma_rating', 'karma_subscribers', 'karma_subscriptions'];
    const wrapper = [
      `__NUM__`,
      `<svg width="20" height="20" class="icon icon--v_followers">\
			<use xlink:href="#v_followers"></use></svg>&nbsp;__NUM__`,
      `<svg width="20" height="20" class="icon icon--v_subs"><use xlink:href="#v_subs"></use></svg>&nbsp;__NUM__`,
    ];
    const descriptions = ['Карма', 'Подписчики', 'Подписки'];

    const htmlForBatch = [karma, subscribers, subscriptions]
      .map((value, index) => {
        if ((typeof value !== 'number' && typeof value !== 'string') || value === 'null') return null;
        if (GetRecord(`s42_${relativeRecordName[index]}`) === 'off') return null;

        return `<span title="${descriptions[index]}">${wrapper[index].replace('__NUM__', value)}</span>`;
      })
      .filter((value) => value !== null)
      .join('&nbsp;|&nbsp;');

    if (!htmlForBatch) {
      GR(GEBI('navigation-user-themes__stats'));
      return;
    }

    if (GEBI('navigation-user-themes__stats')) GEBI('navigation-user-themes__stats').innerHTML = htmlForBatch;
    else {
      const statsDash = document.createElement('a');
      statsDash.id = 'navigation-user-themes__stats';
      statsDash.innerHTML = htmlForBatch;
      statsDash.href = '/u/me';
      statsDash.target = '_self';

      navigationUserThemes.prepend(statsDash);
    }

    additionalStyleForAccountsBubble.innerHTML = `:root {
		--switchers-additional-spacing: ${navigationUserThemes.scrollWidth.toFixed(2)}px;\n}`;
  };

  WaitForElement('#navigation-user-themes').then((navigationUserThemes) => {
    navigationUserThemes.parentNode.classList.add('s42-karma-shown');

    const userID = window.__delegated_data?.['module.auth']?.id;
    if (!userID) return;

    const LocalFetchUserForStats = () => {
      fetch(`/u/${userID}`)
        .then((res) => {
          if (res.status === 200) return res.text();
          return Promise.reject(new Error(`Status code ${res.status} ${res.statusText} – ${res.url}`));
        })
        .then((page) => {
          const subsiteHeader = page
            .match(
              // eslint-disable-next-line max-len
              /<vue(\s+[\w-]+(=("|')[^"']*(\3))?)*\sname="subsite-header"(\s+[\w-]+(=("|')[^"']*(\7))?)*>[\s\n]*<textarea(\s+[\w-]+(=("|')[^"']*(\11))?)*>([^<]+)/i
            )?.[13]
            ?.trim()
            ?.replace(/&quot;/g, `"`)
            ?.replace(/&lt;/g, '<')
            ?.replace(/&gt;/g, '>');

          const subsiteSidebar = page
            .match(
              // eslint-disable-next-line max-len
              /<vue(\s+[\w-]+(=("|')[^"']*(\3))?)*\sname="subsite-sidebar"(\s+[\w-]+(=("|')[^"']*(\7))?)*>[\s\n]*<textarea(\s+[\w-]+(=("|')[^"']*(\11))?)*>([^<]+)/i
            )?.[13]
            ?.trim()
            ?.replace(/&quot;/g, `"`)
            ?.replace(/&lt;/g, '<')
            ?.replace(/&gt;/g, '>');

          const subsiteDataFromHeader = JSON.parse(subsiteHeader)?.header?.subsiteData;
          if (!subsiteDataFromHeader) return;

          let karmaRating = subsiteDataFromHeader.karma;

          if (karmaRating >= 10000)
            karmaRating = `${Math.floor(karmaRating / 1000)}&nbsp;${(karmaRating % 1000).toString().padStart(3, '0')}`;

          if (subsiteDataFromHeader.karma > 0) karmaRating = `+${karmaRating}`;
          else if (subsiteDataFromHeader.karma < 0) karmaRating = `-${karmaRating}`;

          const countersFromSubsiteSidebar = JSON.parse(subsiteSidebar)?.counters;
          if (!countersFromSubsiteSidebar) return;

          const { subscribers, subscriptions } = countersFromSubsiteSidebar;

          LocalPlaceBatch(karmaRating, subscribers, subscriptions, navigationUserThemes);

          SetRecord('s42_lastkarmaandsub', `${karmaRating}|${subscribers}|${subscriptions}`);
        })
        // eslint-disable-next-line no-console
        .catch(console.warn);
    };

    const lastKarmaAndSubs = GetRecord('s42_lastkarmaandsub');

    if (lastKarmaAndSubs) {
      const [lastKarma, lastSubscribers, lastSubscriptions] = lastKarmaAndSubs.split('|');

      LocalPlaceBatch(lastKarma, lastSubscribers, lastSubscriptions, navigationUserThemes);
    }

    if (document.readyState === 'complete') setTimeout(LocalFetchUserForStats, 2e3);
    else window.addEventListener('load', () => setTimeout(LocalFetchUserForStats, 2e3));
  });
};

const RemoveStatsDash = () => {
  document.body.classList.remove('s42-stats-dash');
  GR(GEBI('navigation-user-themes__stats'));
};

WaitForElement('body').then(() => SetStatsDash(false));

module.exports = {
  SetStatsDash,
  RemoveStatsDash,
};
