const { QSA, WaitForElement, GR, GEBI, QS } = require('../util/dom.js');
const { GetRecord } = require('../util/storage.js');

/**
 * Generic/core function to turn on/off left menu links/items
 *
 * @param {"block" | "none"} settingDisplayStyle
 * @param {string[]} [linksHrefs] Array of links by their href to be switched to `settingDisplayStyle`
 * @param {string[]} [linksClasses] Array of links by part of their class to be switched to `settingDisplayStyle`
 * @returns {void}
 */
const SwitchMenuGeneric = (settingDisplayStyle, linksHrefs = [], linksClasses = []) => {
  if (typeof settingDisplayStyle !== 'string') return;

  if (linksHrefs instanceof Array)
    linksHrefs.forEach((sidebarLinkHref) =>
      QSA(`.sidebar-tree-list-item[href="${sidebarLinkHref}"]`).forEach((treeButton) => {
        treeButton.style.display = settingDisplayStyle;
      })
    );

  if (linksClasses instanceof Array)
    linksClasses.forEach((sidebarLinkClass) =>
      QSA(`.sidebar-tree-list-item${sidebarLinkClass}`).forEach((treeButton) => {
        treeButton.style.display = settingDisplayStyle;
      })
    );
};

/**
 * @param {"block" | "none"} settingDisplayStyle
 */
const SwitchLeftMenuFeedPopular = (settingDisplayStyle) => SwitchMenuGeneric(settingDisplayStyle, ['/popular'], []);

/**
 * @param {"block" | "none"} settingDisplayStyle
 */
const SwitchLeftMenuFeedNew = (settingDisplayStyle) => SwitchMenuGeneric(settingDisplayStyle, ['/new'], []);

/**
 * @param {"block" | "none"} settingDisplayStyle
 */
const SwitchLeftMenuFeedMine = (settingDisplayStyle) => SwitchMenuGeneric(settingDisplayStyle, ['/my', '/my/new'], []);

/**
 * @param {"block" | "none"} settingDisplayStyle
 */
const SwitchLeftMenuBookmarks = (settingDisplayStyle) => SwitchMenuGeneric(settingDisplayStyle, ['/bookmarks'], []);

/**
 * @param {"block" | "none"} settingDisplayStyle
 */
const SwitchLeftMenuBusiness = (settingDisplayStyle) =>
  SwitchMenuGeneric(
    settingDisplayStyle,
    [
      '/m',
      'https://vc.ru/job',
      '/job',
      '/companies_new',
      '/companies/new',
      '/companies',
      '/events',
      '/events',
      '/cabinet',
    ],
    ['--custom-html', '--colored']
  );

/**
 * @param {"block" | "none"} settingDisplayStyle
 */
const SwitchLeftMenuRating = (settingDisplayStyle) => SwitchMenuGeneric(settingDisplayStyle, ['/rating'], []);

/**
 * @param {"block" | "none"} settingDisplayStyle
 */
const SwitchLeftMenuBottomLinks = (settingDisplayStyle) => {
  const sidebarFooter = QS('.sidebar__footer');
  if (!sidebarFooter) return;

  sidebarFooter.style.display = settingDisplayStyle;
};

if (GetRecord('s42_hide_menu_item_feed_popular') === '1')
  WaitForElement('.sidebar-tree-list-item').then(() => SwitchLeftMenuFeedPopular('none'));

if (GetRecord('s42_hide_menu_item_feed_new') === '1')
  WaitForElement('.sidebar-tree-list-item').then(() => SwitchLeftMenuFeedNew('none'));

if (GetRecord('s42_hide_menu_item_feed_mine') === '1')
  WaitForElement('.sidebar-tree-list-item').then(() => SwitchLeftMenuFeedMine('none'));

if (GetRecord('s42_bookmarkslinkdisabled') === '1')
  WaitForElement('.sidebar-tree-list-item').then(() => SwitchLeftMenuBookmarks('none'));

if (GetRecord('s42_messageslinkdisabled') !== '0')
  WaitForElement('.sidebar-tree-list-item').then(() => SwitchLeftMenuBusiness('none'));

if (GetRecord('s42_hide_menu_item_rating') === '1')
  WaitForElement('.sidebar-tree-list-item').then(() => SwitchLeftMenuRating('none'));

if (GetRecord('s42_hide_menu_bottom_links') === '1')
  WaitForElement('.sidebar-tree-list-item').then(() => SwitchLeftMenuBottomLinks('none'));

const PlaceEditorialButton = () => {
  WaitForElement(`.sidebar-tree-list-item[href="/bookmarks"]`).then((bookmarksLeftMenuItem) => {
    if (!bookmarksLeftMenuItem) {
      // eslint-disable-next-line no-console
      console.warn('No <bookmarksLeftMenuItem>');
      return;
    }

    const editorialButton = document.createElement('div');
    bookmarksLeftMenuItem.after(editorialButton);

    editorialButton.outerHTML = bookmarksLeftMenuItem.outerHTML
      .replace(/sidebar-tree-list-item"/gi, `sidebar-tree-list-item" id="s42-editorial-link-btn"`)
      .replace(/href="\/bookmarks"/gi, `href="/editorial"`)
      .replace(/style="[^"]+"/gi, '')
      .replace(/Закладки/gi, 'От редакции')
      .replace(/v_bookmark/gi, 'v_tick')
      .replace(/sidebar-tree-list-item--active/gi, '');

    GR(QS('.sidebar-tree-list-item__badge', editorialButton));

    const sidebarButtons = QSA('.sidebar-tree-list-item');
    sidebarButtons.forEach((sidebarButton) => {
      sidebarButton.addEventListener('click', () => {
        sidebarButtons.forEach((sidebarButtonToChangeClass) => {
          if (sidebarButton !== sidebarButtonToChangeClass)
            sidebarButtonToChangeClass.classList.remove('sidebar-tree-list-item--active');
        });

        if (sidebarButton.id === 's42-editorial-link-btn')
          sidebarButton.classList.add('sidebar-tree-list-item--active');
      });
    });

    if (window.location.pathname.search(/^\/editorial/) > -1) {
      sidebarButtons.forEach((sidebarButtonToChangeClass) => {
        sidebarButtonToChangeClass.classList.remove('sidebar-tree-list-item--active');
      });

      GEBI('s42-editorial-link-btn').classList.add('sidebar-tree-list-item--active');
    }
  });
};

if (GetRecord('s42_editorial') === '1') PlaceEditorialButton();

module.exports = {
  SwitchLeftMenuFeedPopular,
  SwitchLeftMenuFeedNew,
  SwitchLeftMenuFeedMine,
  SwitchLeftMenuBookmarks,
  SwitchLeftMenuBusiness,
  SwitchLeftMenuRating,
  SwitchLeftMenuBottomLinks,
  PlaceEditorialButton,
};
