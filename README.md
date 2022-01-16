# Osnova Dark Theme
Userscript bringing dark theme to Osnova platform. Contains A LOT of subthemes and modules.

## How it works
Core file [`src/core.js`](./src/core.js) imports necessary utils. Its primary task is to apply chosen or default options on page load or on demand (e.g. attaching link to Ultra Dark Theme style or showing favourites marker) using dependent util/helper modules. Webpack bundles (via task `npm run build`) all javascript files in [`src`](./src) to single `build/osnova_dark_theme.js` (relative to root). Then this bundled file ready for _*monkey_, all [CSS and other resources](./resources) could be deployed to production server.

## Tasks
1. Install necessary dependencies – `npm i --force --production`
2. Build userscript with webpack config – `npm run build`

#### [LICENSE – GNU GPL v3](./LICENSE)

##### Introduction posts:
* [TJournal](https://tjournal.ru/137781#darkmode)
* [DTF](https://dtf.ru/666655#darkmode)

##### Available options
<p align="center">
	<img src="https://leonardo.osnova.io/2a64d1aa-8b1f-5918-834d-7e8cdb7d7391/" alt="Available options" width="500"/>
</p>
