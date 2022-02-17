const DEFAULT_RECORD_OPTIONS = { infinite: true, Path: "/", Domain: window.location.hostname };
const ALL_RECORDS_NAMES = [
	"s42_always",
	"s42_system_theme",
	"s42_turn_off",
	"s42_no_themes",
	"s42_covfefe",
	"s42_blackchrome",
	"s42_vampire",
	"s42_deep_blue",
	"s42_filter",
	"s42_verified",
	"s42_hide_likes",
	"s42_add_possession_choice",
	"s42_karma",
	"s42_lastkarmaandsub",
	"s42_material",
	"s42_gray_signs",
	"s42_snow_by_neko",
	"s42_softer_black",
	"s42_messageslinkdisabled",
	"s42_bookmarkslinkdisabled",
	"s42_hide_menu_item_feed_popular",
	"s42_hide_menu_item_feed_new",
	"s42_hide_menu_item_feed_mine",
	"s42_hide_menu_item_rating",
	"s42_defaultscrollers",
	"s42_monochrome",
	"s42_qrcode",
	"s42_ultra_dark",
	"s42_vbscroller",
	"s42_editorial",
	"s42_columns_narrow",
	"s42_hidesubscriptions",
	"s42_beautifulfeedposts",
	"s42_favouritesicon",
	"s42_hide_recommendation_feed_after_comments",
	"s42_favouritemarker",
	"s42_previous_editor",
	"s42_hide_feed_top_mini_editor",
	"s42_fullpage_editor",
	"s42_stars_in_editor",
	"s42_hideviewsanddate",
	"s42_hideentriesbadge",
	"s42_donate",
	"s42_com_rules"
];

/**
 * @param {string} iName
 * @param {string} iValue
 * @param {{infinite?: true, erase?: true, Path?: string, Domain?: string}} iOptions
 * @returns {void}
 */
const SetCookie = (iName, iValue, iOptions) => {
	let cCookie = iName + "=" + encodeURIComponent(iValue);

	if (typeof iOptions !== "object") iOptions = new Object();

	if (iOptions.infinite)
		cCookie += "; Expires=" + new Date(new Date().getTime() + 1e11).toUTCString();
	else if (iOptions.erase)
		cCookie += "; Expires=" + new Date(new Date().getTime() - 1e7).toUTCString();

	delete iOptions.infinite;
	delete iOptions.erase;

	for (let key in iOptions) {
		if (iOptions[key]) {
			if (key === "Path")
				cCookie += `; ${key}=${iOptions[key]}`;
			else
				cCookie += `; ${key}=${encodeURIComponent(iOptions[key])}`;
		} else
			cCookie += "; " + key;
	}

	document.cookie = cCookie;
};

/**
 * @param {string} iName
 * @returns {string | undefined}
 */
const GetCookie = iName => {
	const matches = document.cookie.match(new RegExp("(?:^|; )" + iName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * @param {string} iName
 * @param {string} iValue
 * @param {{infinite?: true, erase?: true, Path?: string, Domain?: string}} [iOptions]
 * @returns {void}
 */
const SetRecord = (iName, iValue, iOptions) => {
	if (!iOptions || typeof iOptions !== "object") iOptions = DEFAULT_RECORD_OPTIONS;

	SetCookie(iName, iValue, iOptions);
	localStorage.setItem(iName, iValue);
};

/**
 * @param {string} iName
 * @returns {string | undefined}
 */
const GetRecord = iName => {
	const gotCookie = GetCookie(iName),
		  gotStorage = localStorage.getItem(iName);

	if (!gotStorage && !!gotCookie) {
		localStorage.setItem(iName, gotCookie);
		return gotCookie;
	} else if (!!gotStorage && !gotCookie) {
		SetCookie(iName, gotStorage, DEFAULT_RECORD_OPTIONS);
		return gotStorage;
	} else if (!!gotStorage && !!gotCookie && gotStorage !== gotCookie) {
		SetCookie(iName, gotStorage, DEFAULT_RECORD_OPTIONS);
		return gotStorage;
	} else {
		return gotStorage || gotCookie;
	}
};


window.S42_UNLOAD_COOKIES = () => ALL_RECORDS_NAMES.forEach((recordName) => SetCookie(recordName, "1", { erase: true, Path: "/", Domain: window.location.hostname }));
window.S42_UNLOAD_STORAGE = () => ALL_RECORDS_NAMES.forEach((recordName) => localStorage.removeItem(recordName));
window.S42_UNLOAD_ALL = () => {
	window.S42_UNLOAD_COOKIES();
	window.S42_UNLOAD_STORAGE();
}


module.exports = {
	SetRecord,
	GetRecord
};
