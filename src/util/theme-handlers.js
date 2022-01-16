const { RESOURCES_ROOT, SITE, SITE_COLOR } = require("../config/sites");
const { ManageModule, QS, GEBI, AddStyle, WaitForElement, AddScript } = require("./dom");
const { ADDITIONAL_DARK_MODULES_NAMES, ADDITIONAL_LIGHT_MODULES_NAMES, ALL_ADDITIONAL_MODULES, ALL_MODULES } = require("./modules-list");
const { GetRecord } = require("./storage");


/** Create containers for resources */
WaitForElement("body").then((body) => {
	if (!body) return;

	const maxPriority = ALL_MODULES.reduce((accumulator, moduleSpec) => {
		if (moduleSpec.priority > accumulator)
			return moduleSpec.priority;
		else
			return accumulator;
	}, 0);

	for (let i = 0; i <= maxPriority; i++) {
		if (!GEBI("container-for-custom-elements-" + i)) {
			const container = document.createElement("div");
				  container.id = "container-for-custom-elements-" + i;
				  container.dataset.author = "serguun42";

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
const CheckForScheduledNightMode = () => {
	const
		DATE = new Date(),
		CURRENT_TENDENCY = (DATE.getMonth() < 5 || (DATE.getMonth() === 11 && DATE.getDate() > 22) || (DATE.getMonth() === 5 && DATE.getDate() < 22)),
		SCHEDULE = {
			winter: {
				sunrise: 9,
				sunset: 16
			},
			summer: {
				sunrise: 6,
				sunset: 21
			}
		},
		SESSION_START = CURRENT_TENDENCY ? new Date(DATE.getFullYear(), 11, 22) : new Date(DATE.getFullYear(), 5, 22),
		SESSION_END = CURRENT_TENDENCY ? new Date(DATE.getFullYear(), 5, 22) : new Date(DATE.getFullYear(), 11, 22);

	let nightModeFlag = false;


	if (CURRENT_TENDENCY) {
		if (DATE.getMonth() === 11)
			SESSION_END.setFullYear(DATE.getFullYear() + 1);
		else
			SESSION_START.setFullYear(DATE.getFullYear() - 1);
	}


	const
		RATIO = (+DATE - SESSION_START) / (+SESSION_END - SESSION_START),
		TODAY_SUNRISE =
			CURRENT_TENDENCY
			?
				SCHEDULE.winter.sunrise - (SCHEDULE.winter.sunrise - SCHEDULE.summer.sunrise) * RATIO
			:
				SCHEDULE.summer.sunrise + (SCHEDULE.winter.sunrise - SCHEDULE.summer.sunrise) * RATIO
		,
		TODAY_SUNSET =
			CURRENT_TENDENCY
			?
				SCHEDULE.winter.sunset + (SCHEDULE.summer.sunset - SCHEDULE.winter.sunset) * RATIO
			:
				SCHEDULE.summer.sunset - (SCHEDULE.summer.sunset - SCHEDULE.winter.sunset) * RATIO
		;


	if (DATE.getHours() < Math.floor(TODAY_SUNRISE))
		nightModeFlag = true;
	else if (DATE.getHours() == Math.floor(TODAY_SUNRISE) & DATE.getMinutes() <= Math.floor((TODAY_SUNRISE % 1) * 60))
		nightModeFlag = true;
	else if (DATE.getHours() > Math.floor(TODAY_SUNSET))
		nightModeFlag = true;
	else if (DATE.getHours() == Math.floor(TODAY_SUNSET) & DATE.getMinutes() >= Math.floor((TODAY_SUNSET % 1) * 60))
		nightModeFlag = true;

	return nightModeFlag;
};

/**
 * @returns {boolean}
 */
const CheckForSystemDarkMode = () => (
	typeof matchMedia !== "undefined" && matchMedia || window.matchMedia
)?.("(prefers-color-scheme: dark)")?.matches;

/**
 * Listens to system theme change
 */
(
	typeof matchMedia !== "undefined" && matchMedia || window.matchMedia
)?.("(prefers-color-scheme: dark)")?.addEventListener("change", (mediaQueryListEvent) => {
	if (GetRecord("s42_system_theme") !== "1") return;

	ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => ManageModule(darkModuleName, false));
	ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => ManageModule(lightModuleName, false));

	if (mediaQueryListEvent.matches) { /** System theme changed to dark */
		QS(`meta[name="theme-color"]`)?.setAttribute("content", "#232323");

		ManageModule("dark", true);
		ManageModule(`${SITE}_dark`, true, true);
		ManageModule("light", false);
		ManageModule("no_themes", false);

		ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
			if (GetRecord("s42_" + darkModuleName) === "1")
				ManageModule(darkModuleName, true);
		});
	} else { /** System theme changed to ligth */
		QS(`meta[name="theme-color"]`)?.setAttribute("content", SITE_COLOR);

		ManageModule("dark", false);
		ManageModule(`${SITE}_dark`, false, true);
		ManageModule("light", true);
		ManageModule("no_themes", false);

		ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
			if (GetRecord("s42_" + lightModuleName) === "1")
				ManageModule(lightModuleName, true);
		});
	}
});

/**
 * @param {boolean} iNightMode
 * @returns {void}
 */
const SetMode = iNightMode => {
	if (window.top === window) window.top.S42_DARK_THEME_ENABLED = iNightMode;

	WaitForElement("body").then((body) => {
		if (!body) return;

		if (iNightMode)
			body.classList.add("s42-is-dark");
		else
			body.classList.remove("s42-is-dark");
	});

	AddStyle(`${RESOURCES_ROOT}${SITE}.css`, 1, SITE);


	if (GetRecord("s42_no_themes") !== "1") {
		if (iNightMode) {
			AddStyle(`${RESOURCES_ROOT}osnova_dark.css`, 2, "dark");
			AddStyle(`${RESOURCES_ROOT}${SITE}_dark.css`, 3, `${SITE}_dark`);

			WaitForElement(`meta[name="theme-color"]`).then((meta) => {
				if (meta) meta.setAttribute("content", "#232323");
			});
		} else {
			AddStyle(`${RESOURCES_ROOT}osnova_light.css`, 2, "light");

			QS(`meta[name="theme-color"]`)?.setAttribute("content", SITE_COLOR);
		}
	}


	ALL_ADDITIONAL_MODULES.forEach((addon) => {
		if (GetRecord("s42_" + addon.name)) {
			if (!parseInt(GetRecord("s42_" + addon.name))) return false;
		} else {
			if (!addon.default) return false;
		}


		if (addon.dark === true && !iNightMode) return false;
		if (addon.light === true && iNightMode) return false;

		if ((addon.dark || addon.light) && GetRecord("s42_no_themes") === "1") return false;

		AddStyle(`${RESOURCES_ROOT}osnova_${addon.name}.css`, addon.priority, addon.name);
	});
};

if (GetRecord("s42_turn_off") === "1")
	SetMode(false);
else if (GetRecord("s42_always") === "1")
	SetMode(true);
else if (GetRecord("s42_system_theme") === "1")
	SetMode(CheckForSystemDarkMode());
else
	SetMode(CheckForScheduledNightMode());



module.exports = {
	CheckForScheduledNightMode,
	CheckForSystemDarkMode,
	SetMode
};
	