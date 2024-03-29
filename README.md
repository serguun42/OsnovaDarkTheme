# Osnova Dark Theme

Userscript bringing dark theme to Osnova platform. Contains A LOT of subthemes and modules.

## How it works

Core file [`src/core.js`](./src/core.js) imports necessary utils and modules. Its primary task is to apply chosen or default options on page load or on demand (e.g. attaching link to _Ultra Dark Theme_ style or showing favourites marker). Webpack bundles all JS files in [`src`](./src) to single `build/osnova-dark-theme.user.js` – this bundled file is ready for use in _\*monkey_.

All [CSS and other resources](./resources) could be deployed to production server without any minification. For minification see `npm run resources` command.

## Building with npm

1. Install necessary dependencies – `npm i --production`
2. Bundle userscript with [webpack](https://webpack.js.org/) and [`@serguun42/webpack-userscript-plugin`](https://www.npmjs.com/package/@serguun42/webpack-userscript-plugin) – `npm run build`
3. Minify all css with [postcss](https://github.com/postcss/postcss), [cssnano](https://cssnano.co/) and [autoprefixer](https://github.com/postcss/autoprefixer) and dump it to `build/` folder – `npm run resources`

## Development

1. Install all dependencies – `npm i`
2. Build userscript in [watch mode](https://webpack.js.org/configuration/watch/) – `npm run dev`, output to `dev/osnova-dark-theme.user.js`
3. Check project with ESLint – `npm run lint`

## About

-   [Introduction post](https://dtf.ru/666655#darkmode)
-   [Updates posts](https://dtf.ru/tag/darktheme)

<h4 align="center">Options available for end-user</h4>
<p align="center">
	<img src="https://leonardo.osnova.io/95bdcba1-e4d5-52f2-ad62-569f55f33027/" alt="Available options" width="500"/>
</p>

#### [License – GNU GPL v3](./LICENSE)
