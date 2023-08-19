const { SITE_COLOR, SITE } = require('../config/sites.js');
const { WaitForElement, ManageModule, QS, QSA, GEBI, GlobalBuildLayout, Animate, GR } = require('../util/dom.js');
const {
  ADDITIONAL_DARK_MODULES_NAMES,
  ADDITIONAL_LIGHT_MODULES_NAMES,
  ADDITIONAL_MODULES,
} = require('../util/modules-list.js');
const { SetRecord, GetRecord } = require('../util/storage.js');
const { IsSystemDarkMode, IsScheduledNightMode } = require('../util/theme-handlers.js');
const { StartFavouriteMarkerProcedure, StopFavouriteMarkerProcedure } = require('./favourites-marker.js');
const { SetFullpageEditor } = require('./fullpage-editor.js');
const {
  SwitchLeftMenuBusiness,
  SwitchLeftMenuBookmarks,
  PlaceEditorialButton,
  SwitchLeftMenuFeedPopular,
  SwitchLeftMenuFeedNew,
  SwitchLeftMenuFeedMine,
  SwitchLeftMenuRating,
  SwitchLeftMenuBottomLinks,
} = require('./left-menu.js');
const { SetRemovePlusPopup } = require('./remove-plus-popup.js');
const { SetScrollers } = require('./scrollers.js');
const { SetStatsDash, RemoveStatsDash } = require('./scrollers.js');

const navigationUserThemes = document.createElement('div');
navigationUserThemes.id = 'navigation-user-themes';

/** RIP TJ 😢. LONG LIVE ALASKA! */
(SITE === 'tjournal'
  ? new Promise((resolve) => {
      setTimeout(resolve, 5000);
    }).then(() => WaitForElement('.app__header-logo'))
  : WaitForElement(window.innerWidth <= 719 ? '.site-header__section--create' : '.navigation-user')
).then((navigationContainer) => {
  if (!navigationContainer) return;

  if (SITE === 'tjournal') navigationContainer.after(navigationUserThemes);
  else if (window.innerWidth <= 719) {
    navigationContainer.prepend(navigationUserThemes);
    navigationUserThemes.classList.add('for-mobile-screen');
  } else (navigationContainer.parentElement || navigationContainer).append(navigationUserThemes);

  /**
   * @returns {import('../../types').ElementDescriptorType[]}
   */
  const TimeSwitchers = () =>
    [
      {
        what: 'always',
        label: `Тёмная тема с выбранными дополнениями всегда включена`,
        checked: GetRecord('s42_always') === '1',
      },
      {
        what: 'system_theme',
        label: `Синхронизировать с системной темой`,
        sublabel: `Если в браузере и/или системе выбрана тёмная тема,\
				то она будет применена и в расширении. При смене на системную\
				светлую, расширение автоматически применит светлую тему к сайту\
				с доступными и выбранными дополнениями`,
        checked: GetRecord('s42_system_theme') === '1',
      },
      {
        what: 'usual',
        label: `По расписанию`,
        sublabel: `Выбранная тёмная тема применяется после заката и до восхода,\
				время определяется динамически (солнцестояние – равноденствие – солнцестояние и т.д.)`,
        checked:
          GetRecord('s42_always') !== '1' &&
          GetRecord('s42_system_theme') !== '1' &&
          GetRecord('s42_turn_off') !== '1' &&
          GetRecord('s42_no_themes') !== '1',
      },
      {
        what: 'turn_off',
        label: `Тёмная тема и дополнения для тёмной темы всегда отключены`,
        sublabel: `Вместо этого применяется слегка модифицированная светлая тема и,\
				если вы выберете отдельно, дополнения к ней.`,
        checked: GetRecord('s42_turn_off') === '1',
      },
      {
        what: 'no_themes',
        label: `Не применять никакие темы никогда`,
        sublabel: `Всё так же можно подключить дополнительные модули: красные закладки,\
				скрытие кнопок в левом меню и прочее. См. «Выбор модулей»`,
        checked: GetRecord('s42_no_themes') === '1',
      },
    ].map((timeSwitcher) => ({
      class: 'switcher-layout__list__item',
      child: {
        tag: 'label',
        class: 'mdl-radio mdl-js-radio mdl-js-ripple-effect',
        attr: {
          for: timeSwitcher.what,
        },
        data: {
          mdlUpgrade: true,
        },
        children: [
          {
            tag: 'input',
            class: 'mdl-radio__button',
            id: timeSwitcher.what,
            attr: {
              type: 'radio',
              name: 'time',
              value: timeSwitcher.what,
              ...(timeSwitcher.checked === true ? { checked: 'checked' } : {}),
            },
            listeners: {
              change: () => {
                ['always', 'system_theme', 'turn_off', 'no_themes'].forEach((timeOption) =>
                  SetRecord(`s42_${timeOption}`, timeSwitcher.what === timeOption ? '1' : '0')
                );

                ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => ManageModule(darkModuleName, false));
                ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => ManageModule(lightModuleName, false));

                if (timeSwitcher.what === 'always') {
                  QS(`meta[name="theme-color"]`)?.setAttribute('content', '#232323');

                  ManageModule('dark', true);
                  ManageModule(`${SITE}_dark`, true, true);
                  ManageModule('light', false);
                  ManageModule('no_themes', false);

                  ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
                    if (GetRecord(`s42_${darkModuleName}`) === '1') ManageModule(darkModuleName, true);
                  });
                } else if (timeSwitcher.what === 'system_theme') {
                  if (IsSystemDarkMode()) {
                    QS(`meta[name="theme-color"]`)?.setAttribute('content', '#232323');

                    ManageModule('dark', true);
                    ManageModule(`${SITE}_dark`, true, true);
                    ManageModule('light', false);
                    ManageModule('no_themes', false);

                    ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
                      if (GetRecord(`s42_${darkModuleName}`) === '1') ManageModule(darkModuleName, true);
                    });
                  } else {
                    QS(`meta[name="theme-color"]`)?.setAttribute('content', SITE_COLOR);

                    ManageModule('dark', false);
                    ManageModule(`${SITE}_dark`, false, true);
                    ManageModule('light', true);
                    ManageModule('no_themes', false);

                    ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
                      if (GetRecord(`s42_${lightModuleName}`) === '1') ManageModule(lightModuleName, true);
                    });
                  }
                } else if (timeSwitcher.what === 'turn_off') {
                  QS(`meta[name="theme-color"]`)?.setAttribute('content', SITE_COLOR);

                  ManageModule('dark', false);
                  ManageModule(`${SITE}_dark`, false, true);
                  ManageModule('light', true);
                  ManageModule('no_themes', false);

                  ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
                    if (GetRecord(`s42_${lightModuleName}`) === '1') ManageModule(lightModuleName, true);
                  });
                } else if (timeSwitcher.what === 'no_themes') {
                  QS(`meta[name="theme-color"]`)?.removeAttribute('content');

                  ManageModule('dark', false);
                  ManageModule(`${SITE}_dark`, false, true);
                  ManageModule('light', false);
                  ManageModule('no_themes', true);
                } else if (IsScheduledNightMode()) {
                  QS(`meta[name="theme-color"]`)?.setAttribute('content', '#232323');

                  ManageModule('dark', true);
                  ManageModule(`${SITE}_dark`, true, true);
                  ManageModule('light', false);
                  ManageModule('no_themes', false);

                  ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
                    if (GetRecord(`s42_${darkModuleName}`) === '1') ManageModule(darkModuleName, true);
                  });
                } else {
                  QS(`meta[name="theme-color"]`)?.setAttribute('content', SITE_COLOR);

                  ManageModule('dark', false);
                  ManageModule(`${SITE}_dark`, false, true);
                  ManageModule('light', true);
                  ManageModule('no_themes', false);

                  ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
                    if (GetRecord(`s42_${lightModuleName}`) === '1') ManageModule(lightModuleName, true);
                  });
                }
              },
            },
          },
          {
            tag: 'span',
            class: 'mdl-radio__label',
            html: timeSwitcher.label,
          },
          timeSwitcher.sublabel
            ? {
                tag: 'span',
                class: 'mdl-radio__sub-label',
                html: timeSwitcher.sublabel,
              }
            : null,
        ],
      },
    }));

  const donateIsShown = parseInt(GetRecord('s42_donate'))
    ? Date.now() - parseInt(GetRecord('s42_donate')) > 1000 * 60 * 60 * 24 * 30 * 2
    : true;

  const HideDonate = () => {
    SetRecord('s42_donate', Date.now().toString());

    QSA('.switcher-layout__list__donate').forEach((donatePromoteElemToHide, donatePromoteElemToHideIndex) => {
      donatePromoteElemToHide.style.overflow = 'hidden';

      const initHeight = donatePromoteElemToHide.scrollHeight;
      const initMargin = parseInt(getComputedStyle(donatePromoteElemToHide).marginTop) || 0;

      Animate(
        400,
        (progress) => {
          donatePromoteElemToHide.style.height = `${initHeight * (1 - progress)}px`;
          donatePromoteElemToHide.style.marginBottom = `${initMargin * (1 - progress)}px`;

          if (!donatePromoteElemToHideIndex)
            donatePromoteElemToHide.style.marginTop = `${initMargin * (1 - progress)}px`;
        },
        'ease-in-out'
      ).then(() => GR(donatePromoteElemToHide));
    });
  };

  /**
   * @returns {import('../../types').ElementDescriptorType[]}
   */
  const DarkThemesSwitchers = () =>
    ADDITIONAL_MODULES.filter((addModule) => addModule.dark)
      .concat({ name: 'nothing' })
      .map((addDarkModule) => ({
        class: 'switcher-layout__list__item',
        child: {
          tag: 'label',
          class: 'mdl-radio mdl-js-radio mdl-js-ripple-effect',
          attr: {
            for: addDarkModule.name,
          },
          data: {
            mdlUpgrade: true,
          },
          children: [
            {
              tag: 'input',
              class: 'mdl-radio__button',
              id: addDarkModule.name,
              attr: {
                type: 'radio',
                name: 'add-dark',
                value: addDarkModule.name,
                ...((
                  addDarkModule.name === 'nothing'
                    ? ADDITIONAL_MODULES.filter((additionalModule) => additionalModule.dark).every(
                        (additionalModule) => GetRecord(`s42_${additionalModule.name}`) !== '1'
                      )
                    : GetRecord(`s42_${addDarkModule.name}`) === '1'
                )
                  ? { checked: 'checked' }
                  : {}),
              },
              listeners: {
                change: () => {
                  ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) =>
                    SetRecord(`s42_${darkModuleName}`, addDarkModule.name === darkModuleName ? '1' : '0')
                  );

                  if (GetRecord('s42_no_themes') === '1') return;

                  if (ADDITIONAL_DARK_MODULES_NAMES.includes(addDarkModule.name)) {
                    if (
                      (GetRecord('s42_turn_off') && parseInt(GetRecord('s42_turn_off'))) ||
                      (!IsScheduledNightMode() &&
                        GetRecord('s42_always') !== '1' &&
                        GetRecord('s42_turn_off') !== '1') ||
                      (!IsSystemDarkMode() &&
                        GetRecord('s42_system_theme') !== '1' &&
                        GetRecord('s42_turn_off') !== '1')
                    ) {
                      QS(`[for="always"]`).classList.add('is-checked');
                      QS(`[value="always"]`).checked = true;
                      QS(`[for="system_theme"]`).classList.remove('is-checked');
                      QS(`[value="system_theme"]`).checked = false;
                      QS(`[for="usual"]`).classList.remove('is-checked');
                      QS(`[value="usual"]`).checked = false;
                      QS(`[for="turn_off"]`).classList.remove('is-checked');
                      QS(`[value="turn_off"]`).checked = false;

                      SetRecord('s42_always', '1');
                      SetRecord('s42_system_theme', '0');
                      SetRecord('s42_turn_off', '0');

                      ManageModule('dark', true);
                      ManageModule(`${SITE}_dark`, true, true);
                      ManageModule('monochrome', false);
                      ManageModule('light', false);
                    }
                  }

                  ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) =>
                    ManageModule(darkModuleName, addDarkModule.name === darkModuleName)
                  );
                },
              },
            },
            {
              tag: 'span',
              class: 'mdl-radio__label',
              text: addDarkModule.title || 'Без дополнений к тёмной теме',
            },
          ],
        },
      }));

  /**
   * @returns {import('../../types').ElementDescriptorType[]}
   */
  const LightThemesSwitchers = () =>
    ADDITIONAL_MODULES.filter((addModule) => addModule.light)
      .concat({ name: 'nothing-light' })
      .map((addLightModule) => ({
        class: 'switcher-layout__list__item',
        child: {
          tag: 'label',
          class: 'mdl-radio mdl-js-radio mdl-js-ripple-effect',
          attr: {
            for: addLightModule.name,
          },
          data: {
            mdlUpgrade: true,
          },
          children: [
            {
              tag: 'input',
              class: 'mdl-radio__button',
              id: addLightModule.name,
              attr: {
                type: 'radio',
                name: 'add-light',
                value: addLightModule.name,
                ...((
                  addLightModule.name === 'nothing-light'
                    ? ADDITIONAL_MODULES.filter((additionalModule) => additionalModule.light).every(
                        (additionalModule) => GetRecord(`s42_${additionalModule.name}`) !== '1'
                      )
                    : GetRecord(`s42_${addLightModule.name}`) === '1'
                )
                  ? { checked: 'checked' }
                  : {}),
              },
              listeners: {
                change: () => {
                  SetRecord('s42_monochrome', addLightModule.name === 'monochrome' ? '1' : '0');

                  if (GetRecord('s42_no_themes') === '1') return;

                  if (addLightModule.name === 'monochrome') {
                    if (GetRecord('s42_turn_off') !== '1' || IsScheduledNightMode() || IsSystemDarkMode()) {
                      QS(`[for="always"]`).classList.remove('is-checked');
                      QS(`[value="always"]`).checked = false;
                      QS(`[for="system_theme"]`).classList.add('is-checked');
                      QS(`[value="system_theme"]`).checked = false;
                      QS(`[for="usual"]`).classList.remove('is-checked');
                      QS(`[value="usual"]`).checked = false;
                      QS(`[for="turn_off"]`).classList.add('is-checked');
                      QS(`[value="turn_off"]`).checked = true;

                      SetRecord('s42_always', '0');
                      SetRecord('s42_system_theme', '0');
                      SetRecord('s42_turn_off', '1');

                      ADDITIONAL_LIGHT_MODULES_NAMES.forEach((darkModuleName) =>
                        ManageModule(darkModuleName, addLightModule.name === darkModuleName)
                      );
                      ManageModule('dark', false);
                      ManageModule(`${SITE}_dark`, false, true);
                      ManageModule('light', true);
                    }
                  }

                  ManageModule('monochrome', addLightModule.name === 'monochrome');
                },
              },
            },
            {
              tag: 'span',
              class: 'mdl-radio__label',
              text: addLightModule.title || 'Без дополнений к светлой теме',
            },
          ],
        },
      }));

  /**
   * @returns {import('../../types').ElementDescriptorType[]}
   */
  const UserBadgesOptions = () =>
    [
      {
        name: 'verified',
        title: 'Добавить галочки всем пользователям',
      },
      {
        name: 'hide_verified_badge',
        title: 'Убрать галочки у всех пользователей',
      },
      {
        name: 'hide_plus_badge',
        title: 'Убрать значки Plus',
      },
      {
        name: 'hide_all_badges',
        title: 'Убрать все значки',
      },
      {
        name: null,
        title: 'Не изменять отображение значков пользователей',
      },
    ].map((userBadgeOption, _, allOptions) => ({
      class: 'switcher-layout__list__item',
      child: {
        tag: 'label',
        class: 'mdl-radio mdl-js-radio mdl-js-ripple-effect',
        attr: {
          for: `user-badge-option-${userBadgeOption.name}`,
        },
        data: {
          mdlUpgrade: true,
        },
        children: [
          {
            tag: 'input',
            class: 'mdl-radio__button',
            id: `user-badge-option-${userBadgeOption.name}`,
            attr: {
              type: 'radio',
              name: 'add-light',
              value: `user-badge-option-${userBadgeOption.name}`,
              ...((
                !userBadgeOption.name
                  ? ADDITIONAL_MODULES.filter((additionalModule) => {
                      const userBadgeOptionNames = allOptions.map((option) => option.name).filter(Boolean);
                      return userBadgeOptionNames.includes(additionalModule.name);
                    }).every((additionalModule) => GetRecord(`s42_${additionalModule.name}`) !== '1')
                  : GetRecord(`s42_${userBadgeOption.name}`) === '1'
              )
                ? { checked: 'checked' }
                : {}),
            },
            listeners: {
              change: () => {
                allOptions.forEach((option) => {
                  if (!option.name) return;

                  SetRecord(`s42_${option.name}`, '0');
                  ManageModule(option.name, false);
                });

                if (!userBadgeOption.name) return;

                SetRecord(`s42_${userBadgeOption.name}`, '1');
                ManageModule(userBadgeOption.name, true);
              },
            },
          },
          {
            tag: 'span',
            class: 'mdl-radio__label',
            text: userBadgeOption.title,
          },
        ],
      },
    }));

  /**
   * @param {import('../../types').SwitcherCheckboxRule} checkboxRule
   * @returns {ElementDescriptorType}
   */
  const CheckboxBuilder = (checkboxRule) => ({
    class: 'switcher-layout__list__item',
    child: {
      tag: 'label',
      class: 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect',
      attr: {
        for: checkboxRule.name,
      },
      data: {
        mdlUpgrade: true,
      },
      onclick: (e) => {
        const input = e.currentTarget.children[0];
        if (!input) return true;

        e.preventDefault();

        const checked = !!input.checked;

        if (checked) e.currentTarget.classList.remove('is-checked');
        else e.currentTarget.classList.add('is-checked');

        input.checked = !checked;

        checkboxRule.onchange({ currentTarget: input });

        return false;
      },
      children: [
        {
          tag: 'input',
          class: 'mdl-checkbox__input',
          attr: {
            type: 'checkbox',
            ...(checkboxRule.checked ? { checked: '' } : {}),
          },
          listeners: {
            change: checkboxRule.onchange,
          },
        },
        {
          tag: 'span',
          class: 'mdl-checkbox__label',
          text: checkboxRule.title,
        },
        checkboxRule.subtitle
          ? {
              tag: 'span',
              class: 'mdl-checkbox__sub-label',
              html: checkboxRule.subtitle,
            }
          : null,
      ],
    },
  });

  const HidePanel = () => {
    const switchersContainer = GEBI('switcher-layout');
    const switchersScroller = GEBI('switcher-layout--scroller');
    const switchersObfuscator = GEBI('switcher-layout--obfuscator');

    switchersScroller.style.overflowY = 'hidden';

    Animate(4e2, (progress) => {
      switchersContainer.style.opacity = 1 - progress;
    }).then(() => {
      switchersContainer.style.display = 'none';
      switchersObfuscator.style.display = 'none';

      GR(switchersContainer);
      GR(switchersObfuscator);
    });
  };

  /**
   * @param {MouseEvent} e
   */
  const ShowPanel = (e) => {
    const isScreenSmall = e.clientX < 600 || window.innerHeight <= 660;

    const switchersContainerMaxHeight = window.innerHeight * 0.9;
    const switchersContainerMaxWidth = isScreenSmall ? window.innerWidth : 500;
    const switchersContainer = GEBI('switcher-layout');
    const switchersScroller = GEBI('switcher-layout--scroller');
    const switchersObfuscator = GEBI('switcher-layout--obfuscator');

    if (isScreenSmall) {
      switchersContainer.classList.add('switcher-layout--small-screen');
      switchersContainer.style.removeProperty('right');
    } else {
      switchersContainer.style.right = `${window.innerWidth - e.clientX}px`;
      switchersContainer.classList.remove('switcher-layout--small-screen');
    }

    switchersContainer.style.width = 0;
    switchersContainer.style.height = 0;
    switchersContainer.style.opacity = 0;
    switchersContainer.style.display = 'block';
    switchersScroller.style.overflowY = 'hidden';
    switchersObfuscator.style.display = 'block';

    Animate(5e2, (progress) => {
      switchersContainer.style.width = `${progress * switchersContainerMaxWidth}px`;
      switchersContainer.style.height = `${progress * switchersContainerMaxHeight}px`;

      if (progress < 0.25) switchersContainer.style.opacity = progress * 4;
      else switchersContainer.style.opacity = 1;
    }).then(() => {
      switchersScroller.style.overflowY = 'auto';
    });
  };

  const BuildPanel = () =>
    GlobalBuildLayout(
      [
        {
          id: 'switcher-layout',
          attr: {
            style: 'display: none; opacity: 0;',
          },
          child: {
            id: 'switcher-layout--scroller',
            children: [
              {
                class: 'switcher-layout__header',
                children: [
                  {
                    tag: 'span',
                    text: 'Выбор тем',
                  },
                  {
                    tag: 'span',
                    class: 'switcher-layout__header__supporting-text',
                    id: 'switcher-layout__scroll-to-modules-part',
                    text: 'Выбор модулей находится чуть ниже',
                    onclick: () =>
                      GEBI('switcher-layout__choosing-modules-part').scrollIntoView({ behavior: 'smooth' }),
                  },
                ],
              },
              {
                class: 'switcher-layout__list',
                children: [
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Когда включать',
                  },
                  ...TimeSwitchers(),
                  ...(donateIsShown
                    ? [
                        {
                          class: 'switcher-layout__list__separator switcher-layout__list__donate',
                          onclick: HideDonate,
                        },
                        {
                          tag: 'a',
                          class: 'switcher-layout__list__subheader switcher-layout__list__donate',
                          attr: {
                            href: 'https://dtf.ru/1447609',
                            target: '_blank',
                            style: `color: ${SITE_COLOR}; text-decoration: underline;`,
                          },
                          text: 'Поддержать автора',
                          onclick: HideDonate,
                        },
                        {
                          class: 'switcher-layout__list__subheader switcher-layout__list__donate',
                          text: 'Это сообщение можно скрыть, просто нажав на него 👈',
                          onclick: HideDonate,
                        },
                      ]
                    : []),
                  { class: 'switcher-layout__list__separator' },
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Выбор дополнений к тёмной теме',
                  },
                  ...DarkThemesSwitchers(),
                  { class: 'switcher-layout__list__separator' },
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Выбор дополнений к светлой теме',
                  },
                  ...LightThemesSwitchers(),
                ],
              },
              {
                class: 'switcher-layout__list__separator',
                id: 'switcher-layout__choosing-modules-part',
              },
              {
                class: 'switcher-layout__header',
                text: 'Выбор модулей',
              },
              {
                class: 'switcher-layout__list',
                children: [
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Кнопки в левом меню',
                  },
                  ...[
                    {
                      name: 'hide_menu_item_feed_popular',
                      title: 'Скрыть кнопку ленты «Популярное»',
                      checked: GetRecord('s42_hide_menu_item_feed_popular') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hide_menu_item_feed_popular', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) SwitchLeftMenuFeedPopular('none');
                        else SwitchLeftMenuFeedPopular('');
                      },
                    },
                    {
                      name: 'hide_menu_item_feed_new',
                      title: 'Скрыть кнопку ленты «Свежее»',
                      checked: GetRecord('s42_hide_menu_item_feed_new') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hide_menu_item_feed_new', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) SwitchLeftMenuFeedNew('none');
                        else SwitchLeftMenuFeedNew('');
                      },
                    },
                    {
                      name: 'hide_menu_item_feed_mine',
                      title: 'Скрыть кнопку ленты «Моя лента»',
                      checked: GetRecord('s42_hide_menu_item_feed_mine') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hide_menu_item_feed_mine', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) SwitchLeftMenuFeedMine('none');
                        else SwitchLeftMenuFeedMine('');
                      },
                    },
                    {
                      name: 'hide_menu_item_feed_mine_unread',
                      title: 'Скрыть метку непрочитанного у кнопки «Моя лента»',
                      checked: GetRecord('s42_hide_menu_item_feed_mine_unread') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hide_menu_item_feed_mine_unread', e.currentTarget.checked ? '1' : '0');
                        ManageModule('hide_menu_item_feed_mine_unread', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'bookmarkslinkdisabled',
                      title: 'Скрыть кнопку «Закладки»',
                      checked: GetRecord('s42_bookmarkslinkdisabled') === '1',
                      onchange: (e) => {
                        SetRecord('s42_bookmarkslinkdisabled', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) SwitchLeftMenuBookmarks('none');
                        else SwitchLeftMenuBookmarks('');
                      },
                    },
                    {
                      name: 'hidesubscriptions',
                      title: 'Скрыть кнопку «Подписки»',
                      checked: GetRecord('s42_hidesubscriptions') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_hidesubscriptions', e.currentTarget.checked ? '1' : '0');
                        ManageModule('hidesubscriptions', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'hide_menu_item_rating',
                      title: 'Скрыть кнопку «Рейтинг»',
                      checked: GetRecord('s42_hide_menu_item_rating') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hide_menu_item_rating', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) SwitchLeftMenuRating('none');
                        else SwitchLeftMenuRating('');
                      },
                    },
                    {
                      name: 'messageslinkdisabled',
                      title: 'Скрыть кнопки «Вакансии», «Кабинет», «Мероприятия» и т.п.',
                      checked: GetRecord('s42_messageslinkdisabled') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_messageslinkdisabled', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) SwitchLeftMenuBusiness('none');
                        else SwitchLeftMenuBusiness('');
                      },
                    },
                    {
                      name: 'editorial',
                      title: 'Добавить кнопку «От редакции»',
                      checked: GetRecord('s42_editorial') === '1',
                      onchange: (e) => {
                        SetRecord('s42_editorial', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) PlaceEditorialButton();
                        else GR(GEBI('s42-editorial-link-btn'));
                      },
                    },
                    {
                      name: 'hideentriesbadge',
                      title: 'Скрыть индикатор новых записей',
                      checked: GetRecord('s42_hideentriesbadge') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hideentriesbadge', e.currentTarget.checked ? '1' : '0');
                        ManageModule('hideentriesbadge', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'hide_menu_bottom_links',
                      title: 'Скрыть ссылки внизу левого меню',
                      subtitle: 'О проекте, правила, помощь, ссылки на соцсети и приложения',
                      checked: GetRecord('s42_hide_menu_bottom_links') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hide_menu_bottom_links', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) SwitchLeftMenuBottomLinks('none');
                        else SwitchLeftMenuBottomLinks('');
                      },
                    },
                  ].map(CheckboxBuilder),
                  {
                    class: 'switcher-layout__list__separator',
                  },
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Настройки ленты и постов',
                  },
                  ...[
                    {
                      name: 'beautifulfeedposts',
                      title: 'Кнопки оценки постов без круглых теней',
                      checked: GetRecord('s42_beautifulfeedposts') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_beautifulfeedposts', e.currentTarget.checked ? '1' : '0');
                        ManageModule('beautifulfeedposts', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'favouritesicon',
                      title: 'Красная иконка закладок',
                      checked: GetRecord('s42_favouritesicon') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_favouritesicon', e.currentTarget.checked ? '1' : '0');
                        ManageModule('favouritesicon', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'favouritemarker',
                      title: 'Показывать количество закладок',
                      subtitle: 'Работает только для постов на страницах материалов, но не в ленте или профиле',
                      checked: GetRecord('s42_favouritemarker') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_favouritemarker', e.currentTarget.checked ? '1' : '0');
                        ManageModule('favouritemarker', e.currentTarget.checked);

                        if (e.currentTarget.checked) StartFavouriteMarkerProcedure();
                        else StopFavouriteMarkerProcedure();
                      },
                    },
                    {
                      name: 'hide_recommendation_feed_after_comments',
                      title: 'Скрыть рекомендуемые посты после комментариев',
                      checked: GetRecord('s42_hide_recommendation_feed_after_comments') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_hide_recommendation_feed_after_comments', e.currentTarget.checked ? '1' : '0');
                        ManageModule('hide_recommendation_feed_after_comments', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'hide_stats_in_feed',
                      title: 'Скрыть статистику просмотров в ленте',
                      subtitle: 'Статистика остаётся видимой внутри постов',
                      checked: GetRecord('s42_hide_stats_in_feed') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_hide_stats_in_feed', e.currentTarget.checked ? '1' : '0');
                        ManageModule('hide_stats_in_feed', e.currentTarget.checked);
                      },
                    },
                  ].map(CheckboxBuilder),
                  {
                    class: 'switcher-layout__list__separator',
                  },
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Редактор постов',
                  },
                  ...[
                    {
                      name: 'fullpage_editor',
                      title: 'Разворачивать редактор на всю страницу',
                      subtitle: 'Автоматически растягивает на полный экран маленький блок редактора при его открытии',
                      checked: GetRecord('s42_fullpage_editor') === '1',
                      onchange: (e) => {
                        SetRecord('s42_fullpage_editor', e.currentTarget.checked ? '1' : '0');

                        SetFullpageEditor(e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'stars_in_editor',
                      title: 'Вернуть в редактор быстрые действия',
                      subtitle: 'Кнопки вывода в ленту, якорей и скрытых блоков',
                      checked: GetRecord('s42_stars_in_editor') === '1',
                      onchange: (e) => {
                        SetRecord('s42_stars_in_editor', e.currentTarget.checked ? '1' : '0');
                        ManageModule('stars_in_editor', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'previous_editor',
                      title: 'Старое оформление редактора',
                      subtitle: `Кнопки сохранения, предпросмотра, автоформатирования и «редакторские+»\
																инструменты будут наверху`,
                      checked: GetRecord('s42_previous_editor') === '1',
                      onchange: (e) => {
                        SetRecord('s42_previous_editor', e.currentTarget.checked ? '1' : '0');
                        ManageModule('previous_editor', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'hide_feed_top_mini_editor',
                      title: 'Скрыть мини-редактор в начале ленты',
                      subtitle: 'Оставляет редактор в вашем профиле и подсайтах',
                      checked: GetRecord('s42_hide_feed_top_mini_editor') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hide_feed_top_mini_editor', e.currentTarget.checked ? '1' : '0');
                        ManageModule('hide_feed_top_mini_editor', e.currentTarget.checked);
                      },
                    },
                  ].map(CheckboxBuilder),
                  {
                    class: 'switcher-layout__list__separator',
                  },
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Карма и подписчики',
                  },
                  CheckboxBuilder({
                    name: 'karma',
                    title: 'Блок с вашими кармой, подписчиками и подписками в шапке',
                    subtitle: 'Не рекомендуется включать на маленьких экранах',
                    checked: GetRecord('s42_karma') !== 'off',
                    onchange: (e) => {
                      SetRecord('s42_karma', e.currentTarget.checked ? 'on' : 'off');

                      if (e.currentTarget.checked) {
                        GEBI('switcher-layout__list__item--karma-cover').classList.remove('is-faded');
                        SetStatsDash(true);
                      } else {
                        GEBI('switcher-layout__list__item--karma-cover').classList.add('is-faded');
                        RemoveStatsDash();
                      }
                    },
                  }),
                  {
                    id: 'switcher-layout__list__item--karma-cover',
                    class: GetRecord('s42_karma') === 'off' ? 'is-faded' : '',
                    children: [
                      {
                        name: 'karma_rating',
                        title: 'Количество кармы',
                        checked: GetRecord('s42_karma_rating') !== 'off',
                        onchange: (e) => {
                          SetRecord('s42_karma_rating', e.currentTarget.checked ? 'on' : 'off');
                          SetStatsDash(true);
                        },
                      },
                      {
                        name: 'karma_subscribers',
                        title: 'Подписчики',
                        checked: GetRecord('s42_karma_subscribers') !== 'off',
                        onchange: (e) => {
                          SetRecord('s42_karma_subscribers', e.currentTarget.checked ? 'on' : 'off');
                          SetStatsDash(true);
                        },
                      },
                      {
                        name: 'karma_subscriptions',
                        title: 'Подписки',
                        checked: GetRecord('s42_karma_subscriptions') !== 'off',
                        onchange: (e) => {
                          SetRecord('s42_karma_subscriptions', e.currentTarget.checked ? 'on' : 'off');
                          SetStatsDash(true);
                        },
                      },
                    ]
                      .map(CheckboxBuilder)
                      .concat({
                        id: 'switcher-layout__list__item--karma-cover__obfuscator',
                      }),
                  },
                  {
                    class: 'switcher-layout__list__separator',
                  },
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Настройки отображения значков',
                  },
                  ...UserBadgesOptions(),
                  {
                    class: 'switcher-layout__list__separator',
                  },
                  {
                    class: 'switcher-layout__list__subheader',
                    text: 'Другие модули',
                  },
                  ...[
                    {
                      name: 'remove_plus_popup',
                      title: 'Скрывать попап Plus',
                      subtitle: [
                        'Всегда скрывать попап с предложением подписки Plus –',
                        'эта опция будет блокировать попап даже в случае, если вы умышленно хотите его открыть',
                        '(в этом случае, уберите галочку у этой опции, а затем поставьте заново)',
                      ].join(' '),
                      checked: GetRecord('s42_remove_plus_popup') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_remove_plus_popup', e.currentTarget.checked ? '1' : '0');

                        SetRemovePlusPopup(e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'hide_fire_effect',
                      title: 'Скрывать эффект огонька у выделенных комментариев',
                      subtitle: 'Также скрывать кнопку покупки этого эффекта',
                      checked: GetRecord('s42_hide_fire_effect') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_hide_fire_effect', e.currentTarget.checked ? '1' : '0');
                        ManageModule('hide_fire_effect', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'snow_by_neko',
                      title: 'Добавить снег на фоне',
                      subtitle: `Designed by <a
												href="https://dtf.ru/u/2819-neko-natum"
												target="_blank"
												style="text-decoration: underline;"
											>
												Neko Natum
											</a>`,
                      checked: GetRecord('s42_snow_by_neko') === '1',
                      onchange: (e) => {
                        SetRecord('s42_snow_by_neko', e.currentTarget.checked ? '1' : '0');
                        ManageModule('snow_by_neko', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'softer_black',
                      title: 'Более мягкий фон в подтемах «Ultra Dark», «Кроваво-чёрное ничто» и «Black Monochrome»',
                      subtitle: 'Заменяет абслютный чёрный (#000) на 7% серый (#121212)',
                      checked: GetRecord('s42_softer_black') === '1',
                      onchange: (e) => {
                        SetRecord('s42_softer_black', e.currentTarget.checked ? '1' : '0');
                        ManageModule('softer_black', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'defaultscrollers',
                      title: 'Вернуть стандартные полосы прокрутки',
                      checked: GetRecord('s42_defaultscrollers') === '1',
                      onchange: (e) => {
                        SetRecord('s42_defaultscrollers', e.currentTarget.checked ? '1' : '0');

                        if (e.currentTarget.checked) SetScrollers('default');
                        else SetScrollers('custom');
                      },
                    },
                    {
                      name: 'columns_narrow',
                      title: 'Прижать боковые колонки к центру экрана',
                      subtitle: 'Весь контент будет в центре. Заметнее всего на широких экранах',
                      checked: GetRecord('s42_columns_narrow') === '1',
                      onchange: (e) => {
                        SetRecord('s42_columns_narrow', e.currentTarget.checked ? '1' : '0');
                        ManageModule('columns_narrow', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'gray_signs',
                      title: 'Серые оценки у постов и комментариев',
                      checked: GetRecord('s42_gray_signs') === '1',
                      onchange: (e) => {
                        SetRecord('s42_gray_signs', e.currentTarget.checked ? '1' : '0');
                        ManageModule('gray_signs', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'hide_likes',
                      title: 'Спрятать все оценки и поля ввода',
                      subtitle: 'Например, в комментариях под записями',
                      checked: GetRecord('s42_hide_likes') === '1',
                      onchange: (e) => {
                        SetRecord('s42_hide_likes', e.currentTarget.checked ? '1' : '0');
                        ManageModule('hide_likes', e.currentTarget.checked);
                      },
                    },
                    {
                      name: 'com_rules',
                      title: 'Отключить рекламу',
                      subtitle: 'Фильтр регулярно обновляется',
                      checked: GetRecord('s42_com_rules') !== '0',
                      onchange: (e) => {
                        SetRecord('s42_com_rules', e.currentTarget.checked ? '1' : '0');
                        ManageModule('com_rules', e.currentTarget.checked);
                      },
                    },
                  ].map(CheckboxBuilder),
                  {
                    class: 'switcher-layout__list__separator switcher-layout__list--for-small-screen',
                  },
                  {
                    class: 'switcher-layout__list--for-small-screen',
                    id: 'switcher-layout__close-button-container',
                    child: {
                      class: 'mdl-js-button mdl-js-ripple-effect',
                      mdlUpgrade: true,
                      id: 'switcher-layout__close-button',
                      text: 'Закрыть опции',
                      onclick: HidePanel,
                      contextSameAsClick: true,
                    },
                  },
                ].filter((switcherBlock) => !!switcherBlock),
              },
            ],
          },
        },
        {
          id: 'switcher-layout--obfuscator',
          attr: {
            style: 'display: none;',
          },
          onclick: HidePanel,
          contextSameAsClick: true,
        },
      ],
      document.body,
      false
    );

  const pageContainsGearIcon = /v_gear/i.test(document.documentElement.innerHTML);

  const navigationUserThemesSwitcherButton = document.createElement('div');
  navigationUserThemesSwitcherButton.innerHTML = pageContainsGearIcon
    ? `<svg width="20" height="20" class="icon icon--v_gear"><use xlink:href="#v_gear"></use></svg>`
    : `<svg
			viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'
		 	width='20' height='20' class='icon icon--v_gear' fill='currentColor'
		>
			<path
				fill-rule='evenodd' clip-rule='evenodd'
		  	d='M11.997 2c-.824 0-1.506.177-2.039.588-.524.404-.772.934-.926 
				1.336l-.18.491c-.196.543-.269.747-.604.918-.363.186-.596.137-1.129.023a18.62
				18.62 0 00-.547-.11c-.427-.078-.99-.135-1.602.085-.614.22-1.14.668-1.617
				1.331-.457.636-.66 1.287-.593 1.957.063.624.351 1.138.592 1.518.112.176.208.318.296.446a7
				7 0 01.369.587c.162.3.244.558.244.83 0
				.26-.08.512-.243.812-.118.216-.23.382-.364.579-.09.13-.188.276-.303.458-.242.383-.529.9-.591
				1.524-.067.67.134 1.324.593 1.961.477.663 1.003 1.111 1.616 1.332.611.22 1.174.164
				1.602.086.214-.039.394-.077.548-.11.532-.112.766-.161
				1.129.025.335.172.408.375.603.918.05.14.108.301.181.49.154.403.402.934.926
				1.337.533.41 1.215.588 2.04.588.823 0 1.505-.177 2.038-.588.524-.403.772-.934.926
				-1.336.073-.19.131-.352.181-.491.195-.543.27-.746.604-.918.363-.186.597-.137
				1.13-.024.154.032.333.07.548.11.427.077.99.133 1.6-.087.615-.22 1.14-.67
				1.617-1.332.459-.637.66-1.29.593-1.96-.062-.625-.349-1.142-.59-1.525a15.718 15.718 0
				00-.304-.459c-.133-.196-.246-.362-.363-.578-.164-.3-.244-.552-.244-.812
				0-.272.082-.53.245-.83.117-.217.232-.386.369-.587.087-.128.183-.27.295
				-.446.241-.38.53-.894.592-1.518.067-.67-.135-1.321-.593-1.957C20.165 6
				19.64 5.551 19.025 5.33c-.611-.219-1.175-.162-1.602-.084-.215.04-.394
				.078-.548.11-.533.114-.766.163-1.128-.022-.336-.172-.409-.376-.604-.919a24.05 24.05 0
				00-.18-.49c-.155-.403-.403-.933-.927-1.337-.533-.41-1.215-.588-2.039-.588zm5.529
				14.727c-.584-.138-1.628-.385-2.69.16h-.002c-1.114.571-1.468 1.653-1.659
				2.237-.03.092-.056.172-.08.235-.113.294-.196.405-.28.469-.073.056-.273.172-.818.172-.545
				0-.745-.116-.819-.172-.082-.064-.166-.175-.279-.469a5.33 5.33 0 01-.08-.235c-.19-.584
				-.544-1.666-1.659-2.237-1.063-.545-2.107-.298-2.69-.16-.1.024-.186.044-.256.057-.294.053-.445.044-.568
				0-.12-.043-.347-.17-.67-.618-.23-.32-.236-.497-.226-.594.014-.143.088-.331.292-.654.048
				-.076.113-.173.187-.284.171-.254.388-.578.545-.866.258-.473.487-1.06.487-1.768
				0-.714-.227-1.304-.486-1.782-.16-.296-.38-.622-.552-.877a13.423 13.423 0
				01-.182-.276c-.205-.322-.277-.507-.29-.646-.01-.093-.006-.268.226-.589.322-.449
				.55-.574.668-.617.123-.044.274-.053.567 0 .07.014.156.034.256.058.584.139
				1.628.388 2.692-.158 1.115-.571 1.468-1.653 1.659-2.237.03-.092.056-.172.08-.235
				.113-.294.197-.405.28-.468.073-.057.273-.173.818-.173.545 0
				.745.116.819.173.083.063.166.174.279.468.024.063.05.143.08.235.191.584.544
				1.666 1.66 2.237 1.063.546 2.108.297 2.692.158.1-.024.185-.044.256-.057.293-.054.444-.045.567 0
				.119.042.346.168.669.616.23.321.235.496.226.59-.014.138-.086.323-.29.645-.048.075-.111.169-.183
				.276l-.552.877c-.259.478-.486 1.068-.486 1.782 0 .709.23 1.295.487
				1.768.157.288.374.612.545.866.074.11.14.208.187.284.205.323.278.511
				.292.654.01.097.004.274-.226.594-.323.449-.55.575-.67.618-.123.044-.274.053-.567
				0a6.36 6.36 0 01-.256-.056z'
			></path>
			<path
				fill-rule='evenodd'
				clip-rule='evenodd'
				d='M12 8a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 100 4 2 2 0 000-4z'
			></path>
		</svg>`;
  navigationUserThemesSwitcherButton.className =
    'navigation-user-themes__switcher-button mdl-js-button mdl-js-ripple-effect';
  navigationUserThemesSwitcherButton.addEventListener('click', (e) => {
    BuildPanel();
    requestAnimationFrame(() => ShowPanel(e));
    requestAnimationFrame(() => {
      // eslint-disable-next-line no-undef
      if (typeof componentHandler !== 'undefined') componentHandler.upgradeElements(QSA('[data-mdl-upgrade]'));
    });
  });

  navigationUserThemes.append(navigationUserThemesSwitcherButton);
  // eslint-disable-next-line no-undef
  if (typeof componentHandler !== 'undefined') componentHandler.upgradeElement(navigationUserThemesSwitcherButton);
});

module.exports = {};
