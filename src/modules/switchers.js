const { SITE_COLOR, SITE } = require("../config/sites");
const { WaitForElement, ManageModule, QS, QSA, GEBI, GlobalBuildLayout, Animate, GR } = require("../util/dom");
const { ADDITIONAL_DARK_MODULES_NAMES, ADDITIONAL_LIGHT_MODULES_NAMES, ALL_ADDITIONAL_MODULES } = require("../util/modules-list");
const { SetRecord, GetRecord } = require("../util/storage");
const { CheckForSystemDarkMode, CheckForScheduledNightMode } = require("../util/theme-handlers");
const { StartFavouriteMarkerProcedure, StopFavouriteMarkerProcedure } = require("./favourites-marker");
const { SetFullpageEditor } = require("./fullpage-editor");
const { SwitchLeftMenuMiscItems, SwitchLeftMenuBookmarks, PlaceEditorialButton } = require("./left-menu");
const { SetScrollers } = require("./scrollers");
const { SetStatsDash } = require("./stats-dash");


const navigationUserThemes = document.createElement("div");
	  navigationUserThemes.id = "navigation-user-themes";
	  navigationUserThemes.className = "for-big-header";

WaitForElement(window.innerWidth <= 719 ?
	".navigation-user.navigation-user--top-position" :
	".navigation-user:not(.navigation-user--top-position)"
).then((navigationUser) => {
	(navigationUser.parentElement || navigationUser).after(navigationUserThemes);


	/**
	 * @param {CustomEventType} e
	 */
	const LocalOnTimeChange = (e) => {
		[
			"always",
			"system_theme",
			"turn_off",
			"no_themes"
		].forEach((timeOption) => SetRecord(
			`s42_${timeOption}`, (e.currentTarget.value === timeOption ? 1 : 0).toString()
		));


		ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => ManageModule(darkModuleName, false));
		ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => ManageModule(lightModuleName, false));


		if (e.currentTarget.value === "always") {
			QS(`meta[name="theme-color"]`)?.setAttribute("content", "#232323");

			ManageModule("dark", true);
			ManageModule(`${SITE}_dark`, true, true);
			ManageModule("light", false);
			ManageModule("no_themes", false);

			ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
				if (GetRecord("s42_" + darkModuleName) === "1")
					ManageModule(darkModuleName, true);
			});
		} else if (e.currentTarget.value === "system_theme") {
			if (CheckForSystemDarkMode()) {
				QS(`meta[name="theme-color"]`)?.setAttribute("content", "#232323");

				ManageModule("dark", true);
				ManageModule(`${SITE}_dark`, true, true);
				ManageModule("light", false);
				ManageModule("no_themes", false);

				ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
					if (GetRecord("s42_" + darkModuleName) === "1")
						ManageModule(darkModuleName, true);
				});
			} else {
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
		} else if (e.currentTarget.value === "turn_off") {
			QS(`meta[name="theme-color"]`)?.setAttribute("content", SITE_COLOR);

			ManageModule("dark", false);
			ManageModule(`${SITE}_dark`, false, true);
			ManageModule("light", true);
			ManageModule("no_themes", false);

			ADDITIONAL_LIGHT_MODULES_NAMES.forEach((lightModuleName) => {
				if (GetRecord("s42_" + lightModuleName) === "1")
					ManageModule(lightModuleName, true);
			});
		} else if (e.currentTarget.value === "no_themes") {
			QS(`meta[name="theme-color"]`)?.removeAttribute("content");

			ManageModule("dark", false);
			ManageModule(`${SITE}_dark`, false, true);
			ManageModule("light", false);
			ManageModule("no_themes", true);
		} else {
			if (CheckForScheduledNightMode()) {
				QS(`meta[name="theme-color"]`)?.setAttribute("content", "#232323");

				ManageModule("dark", true);
				ManageModule(`${SITE}_dark`, true, true);
				ManageModule("light", false);
				ManageModule("no_themes", false);

				ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => {
					if (GetRecord("s42_" + darkModuleName) === "1")
						ManageModule(darkModuleName, true);
				});
			} else {
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
		}
	};

	/**
	 * @returns {ElementDescriptorType[]}
	 */
	const LocalBuildTimeSwitchers = () => [
		{
			what: "always",
			label: `Тёмная тема с выбранными дополнениями всегда включена`,
			checked: GetRecord("s42_always") === "1"
		},
		{
			what: "system_theme",
			label: `Синхронизировать с системной темой`,
			sublabel: `Если в браузере и/или системе выбрана тёмная тема, то она будет применена и в расширении. При смене на системную светлую, расширение автоматически применит светлую тему к сайту с доступными и выбранными дополнениями`,
			checked: GetRecord("s42_system_theme") === "1"
		},
		{
			what: "usual",
			label: `По расписанию`,
			sublabel: `Выбранная тёмная тема применяется после заката и до восхода, время определяется динамически (солнцестояние – равноденствие – солнцестояние и т.д.)`,
			checked: GetRecord("s42_always") !== "1" && GetRecord("s42_system_theme") !== "1" && GetRecord("s42_turn_off") !== "1" && GetRecord("s42_no_themes") !== "1"
		},
		{
			what: "turn_off",
			label: `Тёмная тема и дополнения для тёмной темы всегда отключены`,
			sublabel: `Вместо этого применяется слегка модифицированная светлая тема и, если вы выберете отдельно, дополнения к ней.`,
			checked: GetRecord("s42_turn_off") === "1"
		},
		{
			what: "no_themes",
			label: `Не применять никакие темы никогда`,
			sublabel: `Всё так же можно подключить дополнительные модули: красные закладки, скрытие кнопок в левом меню и прочее. См. «Выбор модулей»`,
			checked: GetRecord("s42_no_themes") === "1"
		}
	].map((timeSwitcher) => ({
		tag: "li",
		class: "switcher-layout__list__item",
		child: {
			tag: "label",
			class: "mdl-radio mdl-js-radio mdl-js-ripple-effect",
			attr: {
				for: timeSwitcher.what
			},
			data: {
				mdlUpgrade: true
			},
			children: [
				{
					tag: "input",
					class: "mdl-radio__button",
					id: timeSwitcher.what,
					attr: {
						type: "radio",
						name: "time",
						value: timeSwitcher.what,
						...(timeSwitcher.checked === true ? { checked: "checked" } : {})
					},
					listeners: {
						change: LocalOnTimeChange
					}
				},
				{
					tag: "span",
					class: "mdl-radio__label",
					html: timeSwitcher.label
				},
				timeSwitcher.sublabel ? {
					tag: "span",
					class: "mdl-radio__sub-label",
					html: timeSwitcher.sublabel
				} : null
			].filter((child) => !!child)
		}
	}));

	const LocalHideDonate = () => {
		SetRecord("s42_donate", Date.now().toString());

		QSA(".switcher-layout__list__donate").forEach((donatePromoteElemToHide, donatePromoteElemToHideIndex) => {
			donatePromoteElemToHide.style.overflow = "hidden";
			let initHeight = donatePromoteElemToHide.scrollHeight,
				initMargin = 12;

			Animate(4e2, (iProgress) => {
				donatePromoteElemToHide.style.height = initHeight * (1 - iProgress) + "px";
				donatePromoteElemToHide.style.marginBottom = initMargin * (1 - iProgress) + "px";

				if (!donatePromoteElemToHideIndex)
					donatePromoteElemToHide.style.marginTop = initMargin * (1 - iProgress) + "px";
			}, "ease-in-out").then(() => GR(donatePromoteElemToHide));
		});
	};

	/**
	 * @param {CustomEventType} e
	 */
	const LocalOnAdditionalDarkThemesChange = (e) => {
		ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) => SetRecord(
			`s42_${darkModuleName}`, (e.currentTarget.value === darkModuleName ? 1 : 0).toString()
		));

		if (GetRecord("s42_no_themes") === "1") return;

		if (ADDITIONAL_DARK_MODULES_NAMES.includes(e.currentTarget.value)) {
			if (
				(
					GetRecord("s42_turn_off")             &&
					parseInt(GetRecord("s42_turn_off"))
				) || (
					!CheckForScheduledNightMode()         &&
					GetRecord("s42_always") !== "1"       &&
					GetRecord("s42_turn_off") !== "1"
				) || (
					!CheckForSystemDarkMode()            &&
					GetRecord("s42_system_theme") !== "1" &&
					GetRecord("s42_turn_off") !== "1"
				)
			) {
				QS(`[for="always"]`).classList.add("is-checked");
				QS(`[value="always"]`).checked = true;
				QS(`[for="system_theme"]`).classList.remove("is-checked");
				QS(`[value="system_theme"]`).checked = false;
				QS(`[for="usual"]`).classList.remove("is-checked");
				QS(`[value="usual"]`).checked = false;
				QS(`[for="turn_off"]`).classList.remove("is-checked");
				QS(`[value="turn_off"]`).checked = false;

				SetRecord("s42_always", "1");
				SetRecord("s42_system_theme", "0");
				SetRecord("s42_turn_off", "0");

				ManageModule("dark", true);
				ManageModule(`${SITE}_dark`, true, true);
				ManageModule("monochrome", false);
				ManageModule("light", false);
			}
		}

		ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) =>
			ManageModule(darkModuleName, e.currentTarget.value === darkModuleName)
		);
	};

	/**
	 * @returns {ElementDescriptorType[]}
	 */
	const LocalBuildAdditionalDarkThemes = () => ALL_ADDITIONAL_MODULES.filter((addModule) => addModule.dark).concat({ name: "nothing" }).map((addDarkModule) => ({
		tag: "li",
		class: "switcher-layout__list__item",
		child: {
			tag: "label",
			class: "mdl-radio mdl-js-radio mdl-js-ripple-effect",
			attr: {
				for: addDarkModule.name
			},
			data: {
				mdlUpgrade: true
			},
			children: [
				{
					tag: "input",
					class: "mdl-radio__button",
					id: addDarkModule.name,
					attr: {
						type: "radio",
						name: "add-dark",
						value: addDarkModule.name,
						...((
							addDarkModule.name === "nothing"
								? ALL_ADDITIONAL_MODULES.filter((addModuleChecking) => addModuleChecking.dark).every(
										(addModuleChecking) => GetRecord(`s42_${addModuleChecking.name}`) !== "1"
									)
								: GetRecord(`s42_${addDarkModule.name}`) === "1"
						)
							? { checked: "checked" }
							: {}),
					},
					listeners: {
						change: LocalOnAdditionalDarkThemesChange
					}
				},
				{
					tag: "span",
					class: "mdl-radio__label",
					text: addDarkModule.title || "Без дополнений к тёмной теме"
				}
			]
		}
	}));

	/**
	 * @param {CustomEventType} e
	 */
	const LocalOnAdditionalLightThemesChange = (e) => {
		SetRecord("s42_monochrome", (e.currentTarget.value === "monochrome" ? 1 : 0).toString());

		if (GetRecord("s42_no_themes") === "1") return;

		if (
			e.currentTarget.value === "monochrome"
		) {
			if (
				GetRecord("s42_turn_off") !== "1" || CheckForScheduledNightMode() || CheckForSystemDarkMode()
			) {
				QS(`[for="always"]`).classList.remove("is-checked");
				QS(`[value="always"]`).checked = false;
				QS(`[for="system_theme"]`).classList.add("is-checked");
				QS(`[value="system_theme"]`).checked = false;
				QS(`[for="usual"]`).classList.remove("is-checked");
				QS(`[value="usual"]`).checked = false;
				QS(`[for="turn_off"]`).classList.add("is-checked");
				QS(`[value="turn_off"]`).checked = true;

				SetRecord("s42_always", "0");
				SetRecord("s42_system_theme", "0");
				SetRecord("s42_turn_off", "1");


				ADDITIONAL_DARK_MODULES_NAMES.forEach((darkModuleName) =>
					ManageModule(darkModuleName, e.currentTarget.value === darkModuleName)
				);
				ManageModule("dark", false);
				ManageModule(`${SITE}_dark`, false, true);
				ManageModule("light", true);
			}
		}

		ManageModule("monochrome", e.currentTarget.value === "monochrome");
	};

	/**
	 * @returns {ElementDescriptorType[]}
	 */
	const LocalBuildAdditionalLightThemes = () => ALL_ADDITIONAL_MODULES.filter((addModule) => addModule.light).concat({ name: "nothing-light" }).map((addLightModule) => ({
		tag: "li",
		class: "switcher-layout__list__item",
		child: {
			tag: "label",
			class: "mdl-radio mdl-js-radio mdl-js-ripple-effect",
			attr: {
				for: addLightModule.name
			},
			data: {
				mdlUpgrade: true
			},
			children: [
				{
					tag: "input",
					class: "mdl-radio__button",
					id: addLightModule.name,
					data: {
						mdlEventWating: true
					},
					attr: {
						type: "radio",
						name: "add-light",
						value: addLightModule.name,
						...((
							addLightModule.name === "nothing-light"
								? ALL_ADDITIONAL_MODULES.filter((addModuleChecking) => addModuleChecking.light).every(
										(addModuleChecking) => GetRecord(`s42_${addModuleChecking.name}`) !== "1"
									)
								: GetRecord(`s42_${addLightModule.name}`) === "1"
						)
							? { checked: "checked" }
							: {}),
					},
					listeners: {
						change: LocalOnAdditionalLightThemesChange
					}
				},
				{
					tag: "span",
					class: "mdl-radio__label",
					text: addLightModule.title || "Без дополнений к светлой теме"
				}
			]
		}
	}));

	/**
	 * @param {{name: string, title: string, subtitle?: string, checked: boolean, onchange: (e: CustomEventType) => void}} checkboxRule
	 * @returns {ElementDescriptorType}
	 */
	const LocalBuildCheckboxByCommonRule = (checkboxRule) => ({
		tag: "li",
		class: "switcher-layout__list__item",
		child: {
			tag: "label",
			class: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect",
			attr: {
				for: checkboxRule.name
			},
			data: {
				mdlUpgrade: true
			},
			onclick: (e) => {
				const input = e.currentTarget.children[0];
				if (input) {
					e.preventDefault();

					const checked = !!input.checked;

					if (checked)
						e.currentTarget.classList.remove("is-checked");
					else
						e.currentTarget.classList.add("is-checked");

					input.checked = !checked;

					checkboxRule.onchange({ currentTarget: input });

					return false;
				}
			},
			children: [
				{
					tag: "input",
					class: "mdl-checkbox__input",
					attr: {
						type: "checkbox",
						...(checkboxRule.checked ? { checked: "" } : {})
					},
					listeners: {
						change: checkboxRule.onchange
					}
				},
				{
					tag: "span",
					class: "mdl-checkbox__label",
					text: checkboxRule.title
				},
				checkboxRule.subtitle ? {
					tag: "span",
					class: "mdl-checkbox__sub-label",
					html: checkboxRule.subtitle
				} : null
			]
		}
	});


	const LocalBuildPanel = () => GlobalBuildLayout([
		{
			id: "switcher-layout",
			attr: {
				style: "display: none; opacity: 0;"
			},
			child: {
				id: "switcher-layout--scroller",
				children: [
					{
						class: "switcher-layout__header",
						children: [
							{
								tag: "span",
								text: "Выбор тем"
							},
							{
								tag: "span",
								class: "switcher-layout__header__supporting-text",
								id: "switcher-layout__scroll-to-modules-part",
								text: "Выбор модулей находится чуть ниже",
								onclick: () => GEBI("switcher-layout__choosing-modules-part").scrollIntoView({ behavior: "smooth" })
							}
						]
					},
					{
						tag: "ul",
						id: "switcher-layout__list",
						children: [
							{
								class: "switcher-layout__list__subheader",
								text: "Когда включать"
							},
							...LocalBuildTimeSwitchers(),
							...((Date.now() - parseInt(GetRecord("s42_donate")) || 0) > 86400 * 5 * 1e3 ? [
								{
									class: "switcher-layout__list__separator switcher-layout__list__donate",
									onclick: LocalHideDonate
								},
								{
									tag: "a",
									class: "switcher-layout__list__subheader switcher-layout__list__donate",
									attr: {
										href: "https://sobe.ru/na/dark_mode",
										target: "_blank",
										style: `color: ${SITE_COLOR}; text-decoration: underline;`
									},
									text: "Поддержать автора",
									onclick: LocalHideDonate
								},
								{
									tag: "li",
									class: "switcher-layout__list__subheader switcher-layout__list__donate",
									text: "Можете просто скрыть это сообщение, нажав на него или сюда 👆🏻",
									onclick: LocalHideDonate
								}
							] : []),
							{ class: "switcher-layout__list__separator" },
							{
								class: "switcher-layout__list__subheader",
								text: "Выбор дополнений к тёмной теме"
							},
							...LocalBuildAdditionalDarkThemes(),
							{ class: "switcher-layout__list__separator" },
							{
								class: "switcher-layout__list__subheader",
								text: "Выбор дополнений к светлой теме"
							},
							...LocalBuildAdditionalLightThemes(),
							{
								class: "switcher-layout__list__separator",
								id: "switcher-layout__choosing-modules-part"
							},
							{
								class: "switcher-layout__header",
								text: "Выбор модулей"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Кнопки в левом меню"
							},
							...([
								{
									name: "hideentriesbadge",
									title: "Скрыть индикатор новых записей",
									checked: GetRecord("s42_hideentriesbadge") === "1",
									onchange: (e) => {
										SetRecord("s42_hideentriesbadge", e.currentTarget.checked ? "1" : "0");
										ManageModule("hideentriesbadge", e.currentTarget.checked);
									}
								},
								{
									name: "editorial",
									title: "Добавить кнопку «От редакции»",
									checked: GetRecord("s42_editorial") === "1",
									onchange: (e) => {
										SetRecord("s42_editorial", e.currentTarget.checked ? "1" : "0");

										if (e.currentTarget.checked)
											PlaceEditorialButton();
										else
											GR(GEBI("s42-editorial-link-btn"));
									}
								},
								{
									name: "bookmarkslinkdisabled",
									title: "Скрыть кнопку «Закладки»",
									checked: GetRecord("s42_bookmarkslinkdisabled") !== "0",
									onchange: (e) => {
										SetRecord("s42_bookmarkslinkdisabled", (e.currentTarget.checked ? 1 : 0).toString());

										if (e.currentTarget.checked)
											SwitchLeftMenuBookmarks("none");
										else
											SwitchLeftMenuBookmarks("");
									}
								},
								{
									name: "hidesubscriptions",
									title: "Скрыть кнопку «Подписки»",
									checked: GetRecord("s42_hidesubscriptions") === "1",
									onchange: (e) => {
										SetRecord("s42_hidesubscriptions", e.currentTarget.checked ? "1" : "0");
										ManageModule("hidesubscriptions", e.currentTarget.checked);
									}
								},
								{
									name: "messageslinkdisabled",
									title: "Скрыть кнопки «Вакансии», «Кабинет», «Мероприятия» и т.п.",
									checked: GetRecord("s42_messageslinkdisabled") !== "0",
									onchange: (e) => {
										SetRecord("s42_messageslinkdisabled", (e.currentTarget.checked ? 1 : 0).toString());

										if (e.currentTarget.checked)
											SwitchLeftMenuMiscItems("none");
										else
											SwitchLeftMenuMiscItems("");
									}
								}
							].map(LocalBuildCheckboxByCommonRule)),
							{
								class: "switcher-layout__list__separator"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Настройки ленты и постов"
							},
							...([
								{
									name: "beautifulfeedposts",
									title: "Кнопки оценки постов без теней",
									checked: GetRecord("s42_beautifulfeedposts") !== "0",
									onchange: (e) => {
										SetRecord("s42_beautifulfeedposts", e.currentTarget.checked ? "1" : "0");
										ManageModule("beautifulfeedposts", e.currentTarget.checked);
									}
								},
								{
									name: "favouritesicon",
									title: "Красная иконка закладок",
									checked: GetRecord("s42_favouritesicon") !== "0",
									onchange: (e) => {
										SetRecord("s42_favouritesicon", e.currentTarget.checked ? "1" : "0");
										ManageModule("favouritesicon", e.currentTarget.checked);
									}
								},
								{
									name: "favouritemarker",
									title: "Количество закладок в постах",
									checked: GetRecord("s42_favouritemarker") !== "0",
									onchange: (e) => {
										SetRecord("s42_favouritemarker", e.currentTarget.checked ? "1" : "0");

										if (e.currentTarget.checked)
											StartFavouriteMarkerProcedure();
										else
											StopFavouriteMarkerProcedure();
									}
								}
							].map(LocalBuildCheckboxByCommonRule)),
							{
								class: "switcher-layout__list__separator"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Редактор постов"
							},
							...([
								{
									name: "fullpage_editor",
									title: "Автоматически раскрывать редактор на всю страницу при его открытии",
									checked: GetRecord("s42_fullpage_editor") === "1",
									onchange: (e) => {
										SetRecord("s42_fullpage_editor", e.currentTarget.checked ? "1" : "0");

										SetFullpageEditor(e.currentTarget.checked);
									}
								},
								{
									name: "stars_in_editor",
									title: "Вернуть в редактор быстрые действия: вывод в ленту, якоря, скрытие блоков и т.п.",
									checked: GetRecord("s42_stars_in_editor") === "1",
									onchange: (e) => {
										SetRecord("s42_stars_in_editor", e.currentTarget.checked ? "1" : "0");
										ManageModule("stars_in_editor", e.currentTarget.checked);
									}
								},
								{
									name: "previous_editor",
									title: "Старое оформление редактора",
									checked: GetRecord("s42_previous_editor") === "1",
									onchange: (e) => {
										SetRecord("s42_previous_editor", e.currentTarget.checked ? "1" : "0");
										ManageModule("previous_editor", e.currentTarget.checked);
									}
								},
								{
									name: "hide_feed_top_mini_editor",
									title: "Скрыть мини-редактор в начале ленты",
									checked: GetRecord("s42_hide_feed_top_mini_editor") === "1",
									onchange: (e) => {
										SetRecord("s42_hide_feed_top_mini_editor", e.currentTarget.checked ? "1" : "0");
										ManageModule("hide_feed_top_mini_editor", e.currentTarget.checked);
									}
								}
							].map(LocalBuildCheckboxByCommonRule)),
							{
								class: "switcher-layout__list__separator"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Карма и подписчики"
							},
							LocalBuildCheckboxByCommonRule({
								name: "karma",
								title: "Блок с кармой, подписчиками и подписками в шапке включён",
								checked: GetRecord("s42_karma") !== "off",
								onchange: (e) => {
									SetRecord("s42_karma", e.currentTarget.checked ? "on" : "off");

									if (e.currentTarget.checked) {
										GEBI("switcher-layout__list__item--karma-cover").classList.remove("is-faded");
										SetStatsDash(true);
									} else {
										GEBI("switcher-layout__list__item--karma-cover").classList.add("is-faded");
										GR(GEBI("navigation-user-themes__stats"));
									}
								}
							}),
							{
								id: "switcher-layout__list__item--karma-cover",
								class: GetRecord("s42_karma") === "off" ? "is-faded" : "",
								children: [
									{
										name: "karma_rating",
										title: "Количество кармы",
										checked: GetRecord("s42_karma_rating") !== "off",
										onchange: (e) => {
											SetRecord("s42_karma_rating", e.currentTarget.checked ? "on" : "off");
											SetStatsDash(true);
										}
									},
									{
										name: "karma_subscribers",
										title: "Подписчики",
										checked: GetRecord("s42_karma_subscribers") !== "off",
										onchange: (e) => {
											SetRecord("s42_karma_subscribers", e.currentTarget.checked ? "on" : "off");
											SetStatsDash(true);
										}
									},
									{
										name: "karma_subscriptions",
										title: "Подписки",
										checked: GetRecord("s42_karma_subscriptions") !== "off",
										onchange: (e) => {
											SetRecord("s42_karma_subscriptions", e.currentTarget.checked ? "on" : "off");
											SetStatsDash(true);
										}
									}
								].map(LocalBuildCheckboxByCommonRule).concat({
									id: "switcher-layout__list__item--karma-cover__obfuscator"
								})
							},
							{
								class: "switcher-layout__list__separator"
							},
							{
								class: "switcher-layout__list__subheader",
								text: "Другие дополнительные модули"
							},
							...([
								{
									name: "snow_by_neko",
									title: "Добавить снег на фоне",
									subtitle: `Designed by <a href="https://dtf.ru/u/2819-neko-natum" target="_blank" style="text-decoration: underline;">Neko Natum</a>`,
									checked: GetRecord("s42_snow_by_neko") === "1",
									onchange: (e) => {
										SetRecord("s42_snow_by_neko", e.currentTarget.checked ? "1" : "0");
										ManageModule("snow_by_neko", e.currentTarget.checked);
									}
								},
								{
									name: "com_rules",
									title: "Отключить рекламу",
									subtitle: "Фильтр регулярно обновляется",
									checked: GetRecord("s42_com_rules") !== "0",
									onchange: (e) => {
										SetRecord("s42_com_rules", e.currentTarget.checked ? "1" : "0");
										ManageModule("com_rules", e.currentTarget.checked);
									}
								},
								{
									name: "add_possession_choice",
									title: "Отображать меню выбора между профилем и модерируемыми подсайтами в поле ввода комментария",
									subtitle: "β-версия",
									checked: GetRecord("s42_add_possession_choice") === "1",
									onchange: (e) => {
										SetRecord("s42_add_possession_choice", e.currentTarget.checked ? "1" : "0");
										ManageModule("add_possession_choice", e.currentTarget.checked);
									}
								},
								{
									name: "defaultscrollers",
									title: "Вернуть стандартные полосы прокрутки",
									checked: GetRecord("s42_defaultscrollers") === "1",
									onchange: (e) => {
										SetRecord("s42_defaultscrollers", (e.currentTarget.checked ? 1 : 0).toString());

										if (e.currentTarget.checked)
											SetScrollers("default");
										else
											SetScrollers("custom");
									}
								},
								{
									name: "columns_narrow",
									title: "Прижать боковые колонки к центру экрана",
									subtitle: "Весь контент будет в центре. Заметнее всего на широких экранах",
									checked: GetRecord("s42_columns_narrow") === "1",
									onchange: (e) => {
										SetRecord("s42_columns_narrow", (e.currentTarget.checked ? 1 : 0).toString());
										ManageModule("columns_narrow", e.currentTarget.checked);
									}
								},
								{
									name: "gray_signs",
									title: "Серые оценки у постов и комментариев",
									checked: GetRecord("s42_gray_signs") === "1",
									onchange: (e) => {
										SetRecord("s42_gray_signs", (e.currentTarget.checked ? 1 : 0).toString());
										ManageModule("gray_signs", e.currentTarget.checked);
									}
								},
								{
									name: "hide_likes",
									title: "Спрятать все оценки и поля ввода",
									subtitle: "Например, в комментариях под записями",
									checked: GetRecord("s42_hide_likes") === "1",
									onchange: (e) => {
										SetRecord("s42_hide_likes", e.currentTarget.checked ? "1" : "0");
										ManageModule("hide_likes", e.currentTarget.checked);
									}
								}
							].map(LocalBuildCheckboxByCommonRule)),
							{
								class: "switcher-layout__list__separator switcher-layout__list--for-small-screen"
							},
							{
								class: "switcher-layout__list--for-small-screen",
								id: "switcher-layout__close-button-container",
								child: {
									class: "mdl-js-button mdl-js-ripple-effect",
									mdlUpgrade: true,
									id: "switcher-layout__close-button",
									text: "Закрыть опции",
									onclick: LocalHidePanel,
									contextSameAsClick: true
								}
							}
						].filter((switcherBlock) => !!switcherBlock)
					}
				]
			}
		},
		{
			id: "switcher-layout--obfuscator",
			attr: {
				style: "display: none;"
			},
			onclick: LocalHidePanel,
			contextSameAsClick: true
		}
	], document.body, false);

	/**
	 * @param {CustomEventType} e
	 */
	const LocalShowPanel = (e) => {
		let smallScreenFlag = false;
		if ((window.innerWidth - e.clientX) * 2 + 500 > window.innerWidth) smallScreenFlag = true;
		if (window.innerHeight <= 660) smallScreenFlag = true;


		const switchersContainerMaxHeight = smallScreenFlag ? window.innerHeight - 60 : 600,
			  switchersContainerMaxWidth = smallScreenFlag ? window.innerWidth : 500,
			  switchersContainer = GEBI("switcher-layout"),
			  switchersScroller = GEBI("switcher-layout--scroller"),
			  switchersObfuscator = GEBI("switcher-layout--obfuscator");


		if (smallScreenFlag) {
			switchersContainer.classList.add("switcher-layout--small-screen");
			switchersContainer.style.removeProperty("right");
		} else {
			switchersContainer.style.right = (window.innerWidth - e.clientX) + "px";
			switchersContainer.classList.remove("switcher-layout--small-screen");
		}


		switchersContainer.style.width = 0;
		switchersContainer.style.height = 0;
		switchersContainer.style.opacity = 0;
		switchersContainer.style.display = "block";
		switchersScroller.style.overflowY = "hidden";
		switchersObfuscator.style.display = "block";


		Animate(4e2, (iProgress) => {
			switchersContainer.style.width = iProgress * switchersContainerMaxWidth + "px";
			switchersContainer.style.height = iProgress * switchersContainerMaxHeight + "px";

			if (iProgress < 0.25)
				switchersContainer.style.opacity = iProgress * 4;
			else
				switchersContainer.style.opacity = 1;
		}).then(() => switchersScroller.style.overflowY = "auto");
	};

	const LocalHidePanel = () => {
		const switchersContainer = GEBI("switcher-layout"),
			  switchersScroller = GEBI("switcher-layout--scroller"),
			  switchersObfuscator = GEBI("switcher-layout--obfuscator");


		switchersScroller.style.overflowY = "hidden";

		Animate(4e2, (iProgress) => switchersContainer.style.opacity = 1 - iProgress)
		.then(() => {
			switchersContainer.style.display = "none";
			switchersObfuscator.style.display = "none";

			GR(switchersContainer);
			GR(switchersObfuscator);
		});
	};


	const navigationUserThemesSwitcherButton = document.createElement("div");
		  navigationUserThemesSwitcherButton.innerHTML = `<svg width="20" height="20" class="icon icon--v_gear"><use xlink:href="#v_gear"></use></svg>`;
		  navigationUserThemesSwitcherButton.id = "navigation-user-themes__switcher-button";
		  navigationUserThemesSwitcherButton.className = "mdl-js-button mdl-js-ripple-effect";
		  navigationUserThemesSwitcherButton.addEventListener("click", (e) => {
				LocalBuildPanel();
				requestAnimationFrame(() => LocalShowPanel(e));
				requestAnimationFrame(() => componentHandler?.upgradeElements(QSA("[data-mdl-upgrade]")));
		  });

	navigationUserThemes.appendChild(navigationUserThemesSwitcherButton);
	componentHandler?.upgradeElement(navigationUserThemesSwitcherButton);
});


module.exports = {};
