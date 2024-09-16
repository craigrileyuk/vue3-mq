/*
    https://github.com/azazdeaz/match-media-mock

    written by András Polgár,
    modified by Craig Riley to include the preferred, newer addEventListener and removeEventListener methods

    released under MIT licence
*/
import { includes, pull } from "lodash-es";
import mediaQuery from "css-mediaquery";
import ExecutionEnvironment from "exenv";

export default class MediaQueryListMock {
	constructor(query, getConfig) {
		this._getConfig = getConfig;
		this._query = query;
		this._listeners = [];
	}

	get matches() {
		return mediaQuery.match(this._query, this._getConfig());
	}

	get media() {
		return this._query;
	}

	addListener(listener) {
		if (!ExecutionEnvironment.canUseDOM) {
			return;
		}

		if (!includes(this._listeners, listener)) {
			this._listeners.push(listener);
		}
	}

	addEventListener(event, callback) {
		return this.addListener(callback);
	}

	removeEventListener(event, callback) {
		return this.removeListener(callback);
	}

	removeListener(listener) {
		pull(this._listeners, listener);
	}

	callListeners() {
		this._listeners.forEach((listener) => listener(this));
	}
}
