const { WaitForElement } = require("../util/dom");
const { GetRecord } = require("../util/storage");

/**
 * @param {"default" | "custom"} iScrollersMode
 * @returns {void}
 */
const SetScrollers = iScrollersMode => WaitForElement("body").then((body) => {
	if (!body) return;

	if (iScrollersMode === "default")
		body.classList.add("s42-default-scrollers");
	else
		body.classList.remove("s42-default-scrollers");
});

if (GetRecord("s42_defaultscrollers") === "1") SetScrollers("default");

module.exports = { SetScrollers };
