const DEFAULT_RECORD_OPTIONS = { infinite: true, Path: '/', Domain: window.location.hostname };
const ALL_RECORDS_NAMES = [
  's42_always',
  's42_system_theme',
  's42_turn_off',
  's42_no_themes',
  's42_covfefe',
  's42_blackchrome',
  's42_vampire',
  's42_deep_blue',
  's42_filter',
  's42_verified',
  's42_hide_likes',
  's42_add_possession_choice',
  's42_karma',
  's42_lastkarmaandsub',
  's42_material',
  's42_gray_signs',
  's42_hide_fire_effect',
  's42_snow_by_neko',
  's42_softer_black',
  's42_messageslinkdisabled',
  's42_bookmarkslinkdisabled',
  's42_hide_menu_item_feed_popular',
  's42_hide_menu_item_feed_new',
  's42_hide_menu_item_feed_mine',
  's42_hide_menu_item_rating',
  's42_hide_menu_bottom_links',
  's42_hide_menu_support_link',
  's42_defaultscrollers',
  's42_monochrome',
  's42_qrcode',
  's42_ultra_dark',
  's42_vbscroller',
  's42_editorial',
  's42_columns_narrow',
  's42_hidesubscriptions',
  's42_beautifulfeedposts',
  's42_favouritesicon',
  's42_hide_menu_item_feed_mine_unread',
  's42_hide_recommendation_feed_after_comments',
  's42_hide_stats_in_feed',
  's42_favouritemarker',
  's42_previous_editor',
  's42_hide_feed_top_mini_editor',
  's42_fullpage_editor',
  's42_remove_plus_popup',
  's42_stars_in_editor',
  's42_hideviewsanddate',
  's42_hideentriesbadge',
  's42_donate',
  's42_com_rules',
  's42_hide_all_badges',
  's42_hide_plus_badge',
  's42_hide_verified_badge',
];

/**
 * @param {string} cookieName
 * @param {string} cookieValue
 * @param {{ infinite?: true, erase?: true, Path?: string, Domain?: string }} cookieOptions
 * @returns {void}
 */
const SetCookie = (cookieName, cookieValue, cookieOptions) => {
  let writingCookie = `${cookieName}=${encodeURIComponent(cookieValue)}`;

  if (typeof cookieOptions !== 'object') cookieOptions = {};

  if (cookieOptions.infinite) writingCookie += `; Expires=${new Date(new Date().getTime() + 1e11).toUTCString()}`;
  else if (cookieOptions.erase) writingCookie += `; Expires=${new Date(new Date().getTime() - 1e7).toUTCString()}`;

  delete cookieOptions.infinite;
  delete cookieOptions.erase;

  Object.keys(cookieOptions).forEach((key) => {
    if (cookieOptions[key]) {
      if (key === 'Path') writingCookie += `; ${key}=${cookieOptions[key]}`;
      else writingCookie += `; ${key}=${encodeURIComponent(cookieOptions[key])}`;
    } else writingCookie += `; ${key}`;
  });

  document.cookie = writingCookie;
};

/**
 * @param {string} cookieName
 * @returns {string | undefined}
 */
const GetCookie = (cookieName) => {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${cookieName.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`)
  );

  return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * @param {string} recordName
 * @param {string} recordValue
 * @param {{infinite?: true, erase?: true, Path?: string, Domain?: string}} [recordOptions]
 * @returns {void}
 */
const SetRecord = (recordName, recordValue, recordOptions) => {
  if (!recordOptions || typeof recordOptions !== 'object') recordOptions = DEFAULT_RECORD_OPTIONS;

  SetCookie(recordName, recordValue, recordOptions);
  localStorage.setItem(recordName, recordValue);
};

/**
 * @param {string} recordName
 * @returns {string | undefined}
 */
const GetRecord = (recordName) => {
  const gotCookie = GetCookie(recordName);
  const gotStorage = localStorage.getItem(recordName);

  if (!gotStorage && !!gotCookie) {
    localStorage.setItem(recordName, gotCookie);
    return gotCookie;
  }
  if (!!gotStorage && !gotCookie) {
    SetCookie(recordName, gotStorage, DEFAULT_RECORD_OPTIONS);
    return gotStorage;
  }
  if (!!gotStorage && !!gotCookie && gotStorage !== gotCookie) {
    SetCookie(recordName, gotStorage, DEFAULT_RECORD_OPTIONS);
    return gotStorage;
  }
  return gotStorage || gotCookie;
};

window.S42_UNLOAD_COOKIES = () =>
  ALL_RECORDS_NAMES.forEach((recordName) =>
    SetCookie(recordName, '1', { erase: true, Path: '/', Domain: window.location.hostname })
  );
window.S42_UNLOAD_STORAGE = () => ALL_RECORDS_NAMES.forEach((recordName) => localStorage.removeItem(recordName));
window.S42_UNLOAD_ALL = () => {
  window.S42_UNLOAD_COOKIES();
  window.S42_UNLOAD_STORAGE();
};

module.exports = {
  SetRecord,
  GetRecord,
};
