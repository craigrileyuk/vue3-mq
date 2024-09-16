import { describe, beforeAll, it, expect } from "vitest";
import * as store from "../../src/store.js";
import {
	calculateBreakpointsToRender,
	calculateOrientationsToRender,
	calculateThemesToRender,
	calculateMotionToRender,
} from "../../src/helpers";
import { sanitiseBreakpoints } from "../../src/validation";
import { bootstrap5 } from "../../src/presets";

describe("helpers.js", () => {
	beforeAll(() => {
		const available = sanitiseBreakpoints(bootstrap5);
		store.setAvailableBreakpoints(available);
	});

	it("returns the correct breakpoints for a single breakpoint", () => {
		const breakpointsToRender = calculateBreakpointsToRender(
			"md",
			store.availableBreakpoints
		);
		const expected = ["md"];
		expect(breakpointsToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns the correct breakpoints for a plus range", () => {
		const breakpointsToRender = calculateBreakpointsToRender(
			"xl+",
			store.availableBreakpoints
		);
		const expected = ["xl", "xxl"];
		expect(breakpointsToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns the correct breakpoints for a minus range", () => {
		const breakpointsToRender = calculateBreakpointsToRender(
			"lg-",
			store.availableBreakpoints
		);
		const expected = ["xs", "sm", "md", "lg"];
		expect(breakpointsToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns the correct breakpoints for a from-to range", () => {
		const breakpointsToRender = calculateBreakpointsToRender(
			"sm-lg",
			store.availableBreakpoints
		);
		const expected = ["sm", "md", "lg"];
		expect(breakpointsToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns the correct breakpoints for an array of breakpoints", () => {
		const breakpointsToRender = calculateBreakpointsToRender(
			["xs", "xxl"],
			store.availableBreakpoints
		);
		const expected = ["xs", "xxl"];
		expect(breakpointsToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns all breakpoints for an undefined breakpoint", () => {
		const breakpointsToRender = calculateBreakpointsToRender(
			undefined,
			store.availableBreakpoints
		);
		const expected = ["xs", "sm", "md", "lg", "xl", "xxl"];
		expect(breakpointsToRender).toEqual(expect.arrayContaining(expected));
	});

	/* ******************************************
	 * ORIENTATIONS
	 ****************************************** */
	it("returns all orientations when none specified", () => {
		const orientationsToRender = calculateOrientationsToRender();
		const expected = ["landscape", "portrait"];
		expect(orientationsToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns both orientations when both specified", () => {
		const orientationsToRender = calculateOrientationsToRender(true, true);
		const expected = ["landscape", "portrait"];
		expect(orientationsToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns portrait correctly", () => {
		const orientationsToRender = calculateOrientationsToRender(false, true);
		const expected = ["portrait"];
		expect(orientationsToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns landscape correctly", () => {
		const orientationsToRender = calculateOrientationsToRender(true, false);
		const expected = ["landscape"];
		expect(orientationsToRender).toEqual(expect.arrayContaining(expected));
	});

	/* ******************************************
	 * THEME
	 ****************************************** */
	it("returns all themes when none specified", () => {
		const themesToRender = calculateThemesToRender();
		const expected = ["dark", "light"];
		expect(themesToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns both themes when both specified", () => {
		const themesToRender = calculateThemesToRender(true, true);
		const expected = ["dark", "light"];
		expect(themesToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns light correctly", () => {
		const themesToRender = calculateThemesToRender(false, true);
		const expected = ["light"];
		expect(themesToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns dark correctly", () => {
		const themesToRender = calculateThemesToRender(true, false);
		const expected = ["dark"];
		expect(themesToRender).toEqual(expect.arrayContaining(expected));
	});

	/* ******************************************
	 * MOTION
	 ****************************************** */
	it("returns all motion preferences when none specified", () => {
		const motionToRender = calculateMotionToRender();
		const expected = ["reduce", "no-preference"];
		expect(motionToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns both motion preferences when both specified", () => {
		const motionToRender = calculateMotionToRender(true, true);
		const expected = ["reduce", "no-preference"];
		expect(motionToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns inert correctly", () => {
		const motionToRender = calculateMotionToRender(true, false);
		const expected = ["reduce"];
		expect(motionToRender).toEqual(expect.arrayContaining(expected));
	});

	it("returns motion correctly", () => {
		const motionToRender = calculateMotionToRender(false, true);
		const expected = ["no-preference"];
		expect(motionToRender).toEqual(expect.arrayContaining(expected));
	});
});
