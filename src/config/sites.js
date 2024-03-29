const { VERSION } = process.env;
const RESOURCES_ROOT =
  process.env.NODE_ENV === 'development'
    ? 'https://localhost/tampermonkey/osnova/resources/' // whatever
    : 'https://serguun42.ru/tampermonkey/osnova/';
const SITE =
  typeof window !== 'undefined' ? window.location.hostname.match(/(?:^|\.)([^.]+)\.(?:[^.]+)$/i)?.[1] : 'dtf' || 'dtf';
/** @type {string} */
const SITE_COLOR = {
  tjournal: '#E8A427',
  dtf: '#66D7FF',
  vc: '#E25A76',
}[SITE];

module.exports = {
  VERSION,
  RESOURCES_ROOT,
  SITE,
  SITE_COLOR,
};
