const { RESOURCES_ROOT, SITE, SITE_COLOR } = require('../config/sites.js');
const { ManageModule, QS, GEBI, AddStyle, WaitForElement, AddScript } = require('./dom.js');
const {
  ADDITIONAL_DARK_MODULES_NAMES,
  ADDITIONAL_LIGHT_MODULES_NAMES,
  ADDITIONAL_MODULES,
  ALL_MODULES,
} = require('./modules-list.js');
const { GetRecord } = require('./storage.js');

/** Create containers for resources */
WaitForElement('body').then((body) => {
  if (!body) return;

  const maxPriority = ALL_MODULES.reduce((accumulator, moduleSpec) => {
    if (moduleSpec.priority > accumulator) return moduleSpec.priority;

    return accumulator;
  }, 0);

  for (let i = 0; i <= maxPriority; i++) {
    if (!GEBI(`container-for-custom-elements-${i}`)) {
      const container = document.createElement('div');
      container.id = `container-for-custom-elements-${i}`;
      container.dataset.author = 'serguun42';

      body.appendChild(container);
    }
  }
});

AddStyle(`${RESOURCES_ROOT}mdl-switchers.css`, 0);
AddStyle(`${RESOURCES_ROOT}switchers.css`, 0);
AddScript(`${RESOURCES_ROOT}getmdl.min.js`, 0);

/**
 * @returns {boolean}
 */
const IsScheduledNightMode = () => {
  const DATE = new Date(2023, 2, 21, 7, 30);
  const IS_DAY_LENGTH_INCREASING =
    DATE.getMonth() < 5 ||
    (DATE.getMonth() === 11 && DATE.getDate() > 22) ||
    (DATE.getMonth() === 5 && DATE.getDate() < 22);
  const TARGET_HOURS = {
    winter: {
      sunrise: 10,
      sunset: 15,
    },
    summer: {
      sunrise: 7,
      sunset: 21,
    },
  };

  const SOLSTICE_START = IS_DAY_LENGTH_INCREASING
    ? new Date(DATE.getFullYear() - (DATE.getMonth() !== 11), 11, 22).getTime()
    : new Date(DATE.getFullYear(), 5, 22).getTime();
  const SOLSTICE_END = IS_DAY_LENGTH_INCREASING
    ? new Date(DATE.getFullYear() + (DATE.getMonth() === 11), 5, 22).getTime()
    : new Date(DATE.getFullYear(), 11, 22).getTime();

  const PROGRESS = (DATE.getTime() - SOLSTICE_START) / (SOLSTICE_END - SOLSTICE_START);
  const TODAY_SUNRISE = IS_DAY_LENGTH_INCREASING
    ? TARGET_HOURS.winter.sunrise - (TARGET_HOURS.winter.sunrise - TARGET_HOURS.summer.sunrise) * PROGRESS
    : TARGET_HOURS.summer.sunrise + (TARGET_HOURS.winter.sunrise - TARGET_HOURS.summer.sunrise) * PROGRESS;
  const TODAY_SUNSET = IS_DAY_LENGTH_INCREASING
    ? TARGET_HOURS.winter.sunset + (TARGET_HOURS.summer.sunset - TARGET_HOURS.winter.sunset) * PROGRESS
    : TARGET_HOURS.summer.sunset - (TARGET_HOURS.summer.sunset - TARGET_HOURS.winter.sunset) * PROGRESS;

  if (DATE.getHours() < Math.floor(TODAY_SUNRISE)) return true;
  if (DATE.getHours() === Math.floor(TODAY_SUNRISE) && DATE.getMinutes() <= Math.floor((TODAY_SUNRISE % 1) * 60))
    return true;
  if (DATE.getHours() > Math.floor(TODAY_SUNSET)) return true;
  if (DATE.getHours() === Math.floor(TODAY_SUNSET) && DATE.getMinutes() >= Math.floor((TODAY_SUNSET % 1) * 60))
    return true;

  return false;
};

/**
 * @returns {boolean}
 */
const IsSystemDarkMode = () =>
  ((typeof matchMedia !== 'undefined' && matchMedia) || window.matchMedia)?.('(prefers-color-scheme: dark)')?.matches;

/**
 * Listens to system theme change
 */
((typeof matchMedia !== 'undefined' && matchMedia) || window.matchMedia)?.(
  '(prefers-color-scheme: dark)'
)?.addEventListener('change', (mediaQueryListEvent) => {
  if (GetRecord('s42_system_theme') !== '1') return;

  ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => ManageModule(darkModuleName, false));
  ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => ManageModule(lightModuleName, false));

  if (mediaQueryListEvent.matches) {
    /** System theme changed to dark */
    QS(`meta[name="theme-color"]`)?.setAttribute('content', '#232323');

    ManageModule('dark', true);
    ManageModule(`${SITE}_dark`, true, true);
    ManageModule('light', false);
    ManageModule('no_themes', false);

    ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
      if (GetRecord(`s42_${darkModuleName}`) === '1') ManageModule(darkModuleName, true);
    });
  } else {
    /** System theme changed to ligth */
    QS(`meta[name="theme-color"]`)?.setAttribute('content', SITE_COLOR);

    ManageModule('dark', false);
    ManageModule(`${SITE}_dark`, false, true);
    ManageModule('light', true);
    ManageModule('no_themes', false);

    ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
      if (GetRecord(`s42_${lightModuleName}`) === '1') ManageModule(lightModuleName, true);
    });
  }
});

/**
 * @param {boolean} nightMode
 * @returns {void}
 */
const SetMode = (nightMode) => {
  if (window.top === window) window.top.S42_DARK_THEME_ENABLED = nightMode;

  WaitForElement('body').then((body) => {
    if (!body) return;

    if (nightMode) body.classList.add('s42-is-dark');
    else body.classList.remove('s42-is-dark');
  });

  AddStyle(`${RESOURCES_ROOT}${SITE}.css`, 1, SITE);

  if (GetRecord('s42_no_themes') !== '1') {
    if (nightMode) {
      AddStyle(`${RESOURCES_ROOT}osnova_dark.css`, 2, 'dark');
      AddStyle(`${RESOURCES_ROOT}${SITE}_dark.css`, 3, `${SITE}_dark`);

      WaitForElement(`meta[name="theme-color"]`).then((meta) => {
        if (meta) meta.setAttribute('content', '#232323');
      });
    } else {
      AddStyle(`${RESOURCES_ROOT}osnova_light.css`, 2, 'light');

      QS(`meta[name="theme-color"]`)?.setAttribute('content', SITE_COLOR);
    }
  }

  ADDITIONAL_MODULES.forEach((addon) => {
    if (GetRecord(`s42_${addon.name}`)) {
      if (!parseInt(GetRecord(`s42_${addon.name}`))) return;
    } else if (!addon.default) return;

    if (addon.dark === true && !nightMode) return;
    if (addon.light === true && nightMode) return;

    if ((addon.dark || addon.light) && GetRecord('s42_no_themes') === '1') return;

    AddStyle(`${RESOURCES_ROOT}osnova_${addon.name}.css`, addon.priority, addon.name);
  });
};

if (GetRecord('s42_turn_off') === '1') SetMode(false);
else if (GetRecord('s42_always') === '1') SetMode(true);
else if (GetRecord('s42_system_theme') === '1') SetMode(IsSystemDarkMode());
else SetMode(IsScheduledNightMode());

module.exports = {
  IsScheduledNightMode,
  IsSystemDarkMode,
  SetMode,
};
