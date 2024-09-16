/* ******************************************
 * IMPORTS
 ****************************************** */
import { reactive, readonly, ref } from "vue";

/**
 * @typedef {"landscape"|"portrait"} OrientationOptions
 */

/**
 * @typedef {"dark"|"light"} ThemeOptions
 */

/**
 * @typedef {"no-preference"|"reduce"} MotionOptions
 */

/* ******************************************
 * STATE
 ****************************************** */
const _availableBreakpoints = ref([]);
const _defaultBreakpoint = ref(null);
const _defaultOrientation = ref(null);
const _defaultTheme = ref(null);
const _defaultMotion = ref(null);
const _mqState = reactive({
	current: "",
});

export const _listeners = [];
export const _isMounted = ref(false);

/* ******************************************
 * GETTERS
 ****************************************** */
export const availableBreakpoints = readonly(_availableBreakpoints);
export const defaultBreakpoint = readonly(_defaultBreakpoint);
export const defaultOrientation = readonly(_defaultOrientation);
export const defaultTheme = readonly(_defaultTheme);
export const defaultMotion = readonly(_defaultMotion);
export const mqState = readonly(_mqState);

/* ******************************************
 * MUTATIONS
 ****************************************** */
export const setAvailableBreakpoints = (v) => {
	_availableBreakpoints.value = v;
};

/**
 * Sets the breakpoint to use when plugin executes in a non-browser context
 * @param {string} v Default breakpoint key
 */
export const setDefaultBreakpoint = (v) => {
	_defaultBreakpoint.value = v;
};

/**
 * Sets the orientation to use when plugin executes in a non-browser context
 * @param { OrientationOptions } v The default orientation
 */
export const setDefaultOrientation = (v) => {
	_defaultOrientation.value = v;
};

/**
 * Sets the theme to use when plugin executes in a non-browser context
 * @param { ThemeOptions } v The default theme
 */
export const setDefaultTheme = (v) => {
	_defaultTheme.value = v;
};

/**
 * Sets the motion preference to use when plugin executes in a non-browser context
 * @param { MotionOptions } v Default motion preference
 */
export const setDefaultMotion = (v) => {
	_defaultMotion.value = v;
};

export const updateState = (v = defaultBreakpoint.value) => {
	_mqState.current = v;
	const currentIndex = availableBreakpoints.value.findIndex(
		(bp) => bp.name === v
	);
	const allKeys = availableBreakpoints.value.map((bp) => bp.name);

	for (let i = 0; i < allKeys.length; i++) {
		if (i > 0 && i < allKeys.length - 1) {
			const mKey = allKeys[i] + "Minus";
			const pKey = allKeys[i] + "Plus";

			_mqState[mKey] = currentIndex <= i ? true : false;
			_mqState[pKey] = currentIndex >= i ? true : false;
		}

		_mqState[allKeys[i]] = allKeys[i] === v ? true : false;
	}
};

/**
 * Resets the MQ object to its initial values, using defaultBreakpoint and defaultOrientation
 * @returns { void }
 */
export const resetState = () => {
	const keys = Object.keys(_mqState);
	for (let key of keys) {
		delete _mqState[key];
	}

	updateState();
	updateOrientationState();
	updateThemeState();
	updateMotionState();
};

/**
 * Update values for the MQ object's orientation properties
 * @param { OrientationOptions } v The orientation value to set
 * @returns { void }
 */
export const updateOrientationState = (v = defaultOrientation.value) => {
	_mqState.orientation = v;
	_mqState.isLandscape = v === "landscape";
	_mqState.isPortrait = v === "portrait";
};

/**
 * Update values for the MQ object's theme properties
 * @param { ThemeOptions } v The theme value to set
 * @returns { void }
 */
export const updateThemeState = (v = defaultTheme.value || "light") => {
	_mqState.theme = v;
	_mqState.isDark = v === "dark";
	_mqState.isLight = v === "light";
};

/**
 * Update values for the MQ object's motion preferences
 * @param { MotionOptions } v The motion preference to set
 * @returns { void }
 */
export const updateMotionState = (
	v = defaultMotion.value || "no-preference"
) => {
	_mqState.motionPreference = v;
	_mqState.isMotion = v === "no-preference";
	_mqState.isInert = v === "reduce";
};
