const ADDITIONAL_MODULES = [
	{
		name: "ultra_dark",
		title: "Ultra Dark",
		default: false,
		dark: true,
		priority: 4
	},
	{
		name: "deep_blue",
		title: "Deep Blue",
		default: false,
		dark: true,
		priority: 4
	},
	{
		name: "covfefe",
		title: "Covfefe",
		default: false,
		dark: true,
		priority: 4
	},
	{
		name: "blackchrome",
		title: "Black Monochrome",
		default: false,
		dark: true,
		priority: 4
	},
	{
		name: "vampire",
		title: "«Кроваво-чёрное ничто»",
		default: false,
		dark: true,
		priority: 4
	},
	{
		name: "monochrome",
		title: "Monochrome",
		default: false,
		light: true,
		priority: 4
	},


	{
		name: "stars_in_editor",
		title: "Вернуть в редактор быстрые действия: вывод в ленту, якоря, скрытие блоков и т.п",
		default: false,
		priority: 5
	},
	{
		name: "previous_editor",
		title: "Старое оформление редактора постов",
		default: false,
		priority: 5
	},
	{
		name: "hide_feed_top_mini_editor",
		title: "Скрыть мини-редактор в начале ленты",
		default: false,
		priority: 5
	},
	{
		name: "hidesubscriptions",
		title: "Скрыть кнопку подписок",
		default: true,
		priority: 5
	},
	{
		name: "hideentriesbadge",
		title: "Скрыть индикатор новых записей",
		default: false,
		priority: 5
	},
	{
		name: "beautifulfeedposts",
		title: "Кнопки оценки постов без теней",
		default: true,
		priority: 5
	},
	{
		name: "gray_signs",
		title: "Серые оценки у постов и комментариев",
		default: false,
		priority: 5
	},
	{
		name: "hide_likes",
		title: "Спрятать все оценки и поля ввода",
		default: false,
		priority: 6
	},
	{
		name: "favouritesicon",
		title: "Красная иконка закладок",
		default: true,
		priority: 5
	},
	{
		name: "hide_recommendation_feed_after_comments",
		title: "Скрыть рекомендуемые посты после комментариев",
		default: true,
		priority: 5
	},
	{
		name: "snow_by_neko",
		title: "Добавить снег на фоне",
		default: false,
		priority: 5
	},
	{
		name: "softer_black",
		title: "Более мягкий фон в подтемах «Ultra Dark», «Кроваво-чёрное ничто» и «Black Monochrome»",
		default: false,
		priority: 5
	},
	{
		name: "columns_narrow",
		title: "Прижать боковые колонки к центру экрана",
		default: false,
		priority: 5
	},
	{
		name: "verified",
		title: "Добавить галочки всем пользователям",
		default: false,
		priority: 6
	},
	{
		name: "hide_verified_badge",
		title: "Убрать галочки у всех пользователей",
		default: false,
		priority: 6
	},
	{
		name: "hide_plus_badge",
		title: "Убрать значки Plus",
		default: false,
		priority: 6
	},
	{
		name: "hide_all_badges",
		title: "Убрать все значки",
		default: false,
		priority: 6
	},
	{
		name: "no_themes",
		title: "Не применять никакие темы никогда",
		default: false,
		priority: 1
	},
	{
		name: "com_rules",
		title: "Отключить рекламу",
		default: true,
		priority: 0
	}
];

const ALL_MODULES = [
	{
		name: "light",
		default: true,
		light: true,
		priority: 2
	},
	{
		name: "dark",
		default: true,
		dark: true,
		priority: 2
	},
	{
		name: "tjournal",
		default: true,
		light: true,
		priority: 1
	},
	{
		name: "tjournal_dark",
		default: true,
		dark: true,
		priority: 3
	},
	{
		name: "dtf",
		default: true,
		light: true,
		priority: 1
	},
	{
		name: "dtf_dark",
		default: true,
		dark: true,
		priority: 3
	},
	{
		name: "vc",
		default: true,
		light: true,
		priority: 1
	},
	{
		name: "vc_dark",
		default: true,
		dark: true,
		priority: 3
	},
	...ADDITIONAL_MODULES
];

const ADDITIONAL_DARK_MODULES_NAMES = ADDITIONAL_MODULES.filter((module) => !!module.dark).map((module) => module.name);

const ADDITIONAL_LIGHT_MODULES_NAMES = ADDITIONAL_MODULES.filter((module) => !!module.light).map((module) => module.name);

module.exports = {
	ADDITIONAL_MODULES,
	ALL_MODULES,
	ADDITIONAL_DARK_MODULES_NAMES,
	ADDITIONAL_LIGHT_MODULES_NAMES
};
