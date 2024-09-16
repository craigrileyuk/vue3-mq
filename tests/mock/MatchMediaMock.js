/*
    https://github.com/azazdeaz/match-media-mock

    written by András Polgár

    released under MIT licence
*/
import { clone, mapValues, forOwn } from "lodash-es";
import MediaQueryListMock from "./MediaQueryListMock";

export default {
	create() {
		var config = {};
		var createdMqls = {};

		function matchMediaMock(query) {
			var mql = createdMqls[query];

			if (!mql) {
				mql = new MediaQueryListMock(query, () => config);
				createdMqls[query] = mql;
			}

			return mql;
		}

		matchMediaMock.setConfig = function (newConfig) {
			if (!newConfig) {
				return;
			}

			var matchBeforeByQuery = mapValues(createdMqls, "matches");

			config = clone(newConfig) || {};

			forOwn(createdMqls, function (mql, query) {
				if (mql.matches !== matchBeforeByQuery[query]) {
					mql.callListeners();
				}
			});
		};

		return matchMediaMock;
	},
};
