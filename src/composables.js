/* ******************************************
 * MODULE IMPORTS
 ****************************************** */
import { inject, reactive } from "vue";

/* ******************************************
 * LOCAL IMPORTS
 ****************************************** */
import { validatePreset, sanitiseBreakpoints } from "./validation";
import {
	removeListeners,
	createMediaQueries,
	subscribeToMediaQuery,
} from "./helpers";

/* ******************************************
 * STATE IMPORTS
 ****************************************** */
import {
	setAvailableBreakpoints,
	updateState,
	updateMotionState,
	updateOrientationState,
	updateThemeState,
	resetState,
} from "./store";

/**
 * Update the breakpoint presets and assign MediaQuery listeners for each of them
 *
 * @public
 * @param {object} config - Configuration object for updating breakpoints
 * @param {object} config.breakpoints - An object of name:min values to set
 * @param {object} config.mergeBreakpoints - A mergeable object of name:min values to set
 * @param {object} config.preset - A breakpoint preset to use
 */
export function updateBreakpoints({
	breakpoints,
	mergeBreakpoints = {},
	preset,
}) {
	const validatedPreset = preset ? validatePreset(preset) : false;
	const sanitisedBreakpoints = breakpoints
		? sanitiseBreakpoints(breakpoints)
		: false;

	if (validatedPreset === false && !sanitisedBreakpoints) {
		throw new TypeError(
			"Vue3 Mq: You must provide a valid preset, or valid breakpoint settings.",
		);
	} else {
		setAvailableBreakpoints(
			sanitisedBreakpoints
				? sanitisedBreakpoints
				: sanitiseBreakpoints({
						...validatedPreset,
						...mergeBreakpoints,
					}),
		);
	}

	removeListeners();
	resetState();

	// Set matchMedia queries for breakpoints
	const mediaQueries = createMediaQueries();
	for (const key in mediaQueries) {
		const mediaQuery = mediaQueries[key];
		const callback = () => {
			updateState(key);
		};
		subscribeToMediaQuery(mediaQuery, callback);
	}

	// Set matchMedia queries for orientation
	["portrait", "landscape"].forEach((o) => {
		const orientationCallback = () => {
			updateOrientationState(o);
		};

		subscribeToMediaQuery(`(orientation: ${o})`, orientationCallback);
	});

	// Set matchMedia queries for OS theme
	["light", "dark"].forEach((t) => {
		const themeCallback = () => {
			updateThemeState(t);
		};

		subscribeToMediaQuery(`(prefers-color-scheme: ${t})`, themeCallback);
	});

	// Set matchMedia queries for OS theme
	["reduce", "no-preference"].forEach((m) => {
		const motionCallback = () => {
			updateMotionState(m);
		};

		subscribeToMediaQuery(`(prefers-reduced-motion: ${m})`, motionCallback);
	});
}

/**
 * Composable function which returns the MQ object provided in the ./plugin.js->install method
 *
 * @public
 * @returns {reactive} - The Vue Reactive object
 */
export function useMq() {
	const mq = inject("mq");
	if (!mq) {
		throw new Error(
			"Vue3Mq is not installed in this app. Please follow the installation instructions and try again.",
		);
	} else return mq;
}
