const { SetCustomInterval, ClearCustomInterval, WaitForElement, QSA } = require("../util/dom");
const { GetRecord } = require("../util/storage");

let addFavouriteMarkerFlag = (GetRecord("s42_favouritemarker") !== "0"),
	addingFavouriteMarkerInterval = -1;

const StartFavouriteMarkerProcedure = () => {
	const LocalFavouriteMarkerProcedure = () => {
		if (addingFavouriteMarkerInterval > -1) return;


		let lastURL = "";

		addingFavouriteMarkerInterval = SetCustomInterval(() => {
			if (!addFavouriteMarkerFlag) {
				if (addingFavouriteMarkerInterval > -1) ClearCustomInterval(addingFavouriteMarkerInterval);
				return;
			}

			if (lastURL === window.location.pathname) return;
			if (document.querySelector(".main_progressbar--in_process")) return;

			lastURL = window.location.pathname;


			/* Actual Cache Procedure */
			let cURL = lastURL,
				id = -2;

			if (cURL.slice(0, 3) === "/u/") {
				cURL = cURL.slice(1).split("/");
				if (cURL.length < 3) return;

				id = parseInt(cURL[2]);
				if (isNaN(id)) return;
			} else {
				if (cURL.slice(0, 3) === "/m/") return;

				if (cURL.slice(0, 3) === "/s/")
					cURL = cURL.slice(3);
				else
					cURL = cURL.slice(1);

				if (!cURL) return;

				cURL = cURL.split("/");
				if (cURL.length >= 2) {
					id = parseInt(cURL[1]);
					if (isNaN(id)) return;
				} else if (cURL.length) {
					id = parseInt(cURL[0]);
					if (isNaN(id)) return;
				}
			}



			WaitForElement(`[data-error-code="404"], [data-error-code="403"], .l-entry__header`)
			.then((postElement) => {
				if (!postElement) return;

				try {
					const hiddenEntryData = JSON.parse(
							document.querySelector(".l-hidden.entry_data")?.dataset?.articleInfo
							||
							"{}"	
						  ),
						  favouritesCount = hiddenEntryData["favorites"];

					QSA(".l-entry .favorite_marker").forEach((favouriteMarkerElem) => {
						favouriteMarkerElem.classList.remove("favorite_marker--zero");

						const favouriteMarkerCountElem = favouriteMarkerElem.querySelector(".favorite_marker__count")
														 || document.createElement("div");
							  favouriteMarkerCountElem.className = "favorite_marker__count";
							  favouriteMarkerCountElem.innerText = favouritesCount || "";

						favouriteMarkerElem.appendChild(favouriteMarkerCountElem);

						favouriteMarkerElem.addEventListener("click", (e) => {
							const active = (e.currentTarget || e.target).classList.contains("favorite_marker--active"),
								  currentCount = parseInt(favouriteMarkerCountElem.innerText) || 0;

							if (active)
								favouriteMarkerCountElem.innerText = (currentCount + 1);
							else
								favouriteMarkerCountElem.innerText = (currentCount - 1);
						});
					});
				} catch (e) {
					console.warn("Cannot place favourites counter", e);
				}
			});
		}, 300);
	};

	if (!addFavouriteMarkerFlag) return;

	setTimeout(() => {
		if (document.readyState === "complete")
			LocalFavouriteMarkerProcedure();
		else
			window.addEventListener("load", LocalFavouriteMarkerProcedure);
	}, 250);
};

const StopFavouriteMarkerProcedure = () => {
	ClearCustomInterval(addingFavouriteMarkerInterval);	

	addingFavouriteMarkerInterval = -1;
};


WaitForElement(`[data-error-code="404"], [data-error-code="403"], .l-entry__header`)
.then(StartFavouriteMarkerProcedure);


module.exports = {
	StartFavouriteMarkerProcedure,
	StopFavouriteMarkerProcedure
};
