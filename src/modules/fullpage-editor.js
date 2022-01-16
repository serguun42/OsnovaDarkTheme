const { WaitForElement, SetCustomInterval, ClearCustomInterval, QS, GR } = require("../util/dom");
const { GetRecord } = require("../util/storage");


const FullpageEditor = {
	/* Идея частично, но ответственно взята у Лемура */

	lastStatus: false,
	interruptingChecker: false,
	disabled: () => {
		FullpageEditor.interruptingChecker = true;
	},
	enable: () => {
		WaitForElement(".v-popup-fp-overlay:not(.v-popup-fp-overlay--maximized)", new Promise((resolveInterruptingPromise) => {
			const interruptingInterval = SetCustomInterval(() => {
				if (FullpageEditor.interruptingChecker) {
					FullpageEditor.interruptingChecker = false;
					ClearCustomInterval(interruptingInterval);
					resolveInterruptingPromise();
				}
			}, 100);
		})).then((popupOverlay) => {
			if (!popupOverlay) return;
			if (popupOverlay.classList.contains("v-popup-fp-overlay--maximized")) return Promise.resolve(null);

			return WaitForElement(".v-popup-fp-window__control--size");
		}).then(/** @param {HTMLElement} goToFullpageButton */ (goToFullpageButton) => {
			if (!goToFullpageButton) return setTimeout(() => FullpageEditor.enable(), 1e3);


			if (!FullpageEditor.lastStatus || FullpageEditor.interruptingChecker) return;


			goToFullpageButton.dispatchEvent(new Event("click"));


			const leftColumnOffChecker = document.body.classList.contains("app--left-column-off"),
			      leftColumnOnChecker = document.body.classList.contains("app--left-column-on");

			if (leftColumnOnChecker) document.body.classList.remove("app--left-column-on");

			document.body.classList.add("app--popup-fullpage-maximized", "app--left-column-off");
			QS(".v-popup-fp-container").classList.add("v-popup-fp-container--maximized");
			QS(".v-popup-fp-overlay").classList.add("v-popup-fp-overlay--maximized");
			QS(".v-popup-fp-window").classList.add("v-popup-fp-window--maximized");
			GR(goToFullpageButton);


			new MutationObserver((mutationList, observer) => {
				mutationList.forEach(mutation => {
					if (
						mutation.removedNodes.length &&
						Array.from(mutation.removedNodes).some((node) => node?.classList?.contains("v-popup-fp-overlay"))
					) {
						QS(".v-popup-fp-container").classList.remove("v-popup-fp-container--maximized");
						document.body.classList.remove("app--popup-fullpage-maximized");

						if (!leftColumnOffChecker) document.body.classList.remove("app--left-column-off");
						if (leftColumnOnChecker) document.body.classList.add("app--left-column-on");

						observer.disconnect();
					}
				})
			}).observe(QS(".v-popup-fp-container"), { childList: true });


			FullpageEditor.enable();
		}).catch(console.warn);
	}
};

/**
 * @param {boolean} iFullpageEditorStatus
 * @returns {void}
 */
const SetFullpageEditor = iFullpageEditorStatus => {
	if (iFullpageEditorStatus === FullpageEditor.lastStatus) return;
	FullpageEditor.lastStatus = iFullpageEditorStatus;

	if (iFullpageEditorStatus)
		FullpageEditor.enable();
	else
		FullpageEditor.disabled();
};

if (GetRecord("s42_fullpage_editor") === "1") SetFullpageEditor(true);


module.exports = {
	FullpageEditor,
	SetFullpageEditor
}
