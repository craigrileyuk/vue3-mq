import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as validation from "../../src/validation";
import * as presets from "../../src/presets";

describe("validation.js", () => {
	let spy, warningSpy;
	beforeEach(() => {
		spy = vi.spyOn(global.console, "error").mockImplementation(() => {});
		warningSpy = vi
			.spyOn(global.console, "warn")
			.mockImplementation(() => {});
	});

	afterEach(() => {
		spy.mockRestore();
		warningSpy.mockRestore();
	});

	it("should validate a correct preset", () => {
		const validatedPreset = validation.validatePreset("vuetify");
		expect(validatedPreset).toEqual(presets.vuetify);
		expect(spy).not.toHaveBeenCalled();
	});

	it("should fail to validate an incorrect preset", () => {
		const validatedPreset = validation.validatePreset("asdfasdf");
		expect(validatedPreset).toBeFalsy();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it("should validate a correct default orientation", () => {
		const validatedOrientation = validation.validateOrientation("portrait");
		expect(validatedOrientation).toEqual("portrait");
		expect(spy).not.toHaveBeenCalled();
	});

	it("should fail to validate an incorrect default orientation", () => {
		const validatedOrientation =
			validation.validateOrientation("something");
		expect(validatedOrientation).toBeNull();
		expect(spy).toHaveBeenCalled();
	});

	it("should validate a correct default theme", () => {
		const validatedTheme = validation.validateTheme("dark");
		expect(validatedTheme).toEqual("dark");
		expect(spy).not.toHaveBeenCalled();
	});

	it("should fail to validate an incorrect default theme", () => {
		const validatedTheme = validation.validateTheme("something");
		expect(validatedTheme).toBeNull();
		expect(spy).toHaveBeenCalled();
	});

	it("should validate a correct default motion preference", () => {
		const validatedMotion = validation.validateMotion("reduce");
		expect(validatedMotion).toEqual("reduce");
		expect(spy).not.toHaveBeenCalled();
	});

	it("should fail to validate an incorrect default motion preference", () => {
		const validatedMotion = validation.validateMotion("rollercoaster");
		expect(validatedMotion).toBeNull();
		expect(spy).toHaveBeenCalled();
	});

	it("sanitises a valid set of breakpoints", () => {
		const sanitisedBreakpoints = validation.sanitiseBreakpoints(
			presets.tailwind
		);
		const expected = [
			{ name: "xs", min: 0 },
			{ name: "sm", min: 640 },
			{ name: "md", min: 768 },
			{ name: "lg", min: 1024 },
			{ name: "xl", min: 1280 },
			{ name: "xxl", min: 1536 },
		];
		expect(sanitisedBreakpoints).toEqual(expect.arrayContaining(expected));
	});

	it("shows a warning and skips an invalid breakpoint key", () => {
		const sanitisedBreakpoints = validation.sanitiseBreakpoints({
			xs: 0,
			sm: 500,
			"7md": 1000,
			lg: 1920,
		});

		const expected = [
			{ name: "xs", min: 0 },
			{ name: "sm", min: 500 },
			{ name: "lg", min: 1920 },
		];

		expect(warningSpy).toHaveBeenCalled();
		expect(sanitisedBreakpoints).toHaveLength(3);
		expect(sanitisedBreakpoints).toEqual(expect.arrayContaining(expected));
		expect(sanitisedBreakpoints).toEqual(
			expect.not.arrayContaining([{ name: "7md", min: 1000 }])
		);
	});

	it("shows a warning and skips an invalid breakpoint value", () => {
		const sanitisedBreakpoints = validation.sanitiseBreakpoints({
			xs: 0,
			sm: 500,
			md: -4,
			lg: "squirrel",
		});

		const expected = [
			{ name: "xs", min: 0 },
			{ name: "sm", min: 500 },
		];

		expect(warningSpy).toHaveBeenCalledTimes(2);
		expect(sanitisedBreakpoints).toHaveLength(2);
		expect(sanitisedBreakpoints).toEqual(expect.arrayContaining(expected));
		expect(sanitisedBreakpoints).toEqual(
			expect.not.arrayContaining([{ name: "lg", min: "squirrel" }])
		);
	});

	it("can extract slot names properly", () => {
		const slotOptions = validation.extractSlotNameProperties(
			"sm-lg:dark:inert:portrait:2"
		);

		expect(slotOptions).toHaveProperty("slotBp", "sm-lg");
		expect(slotOptions).toHaveProperty("slotTheme", "dark");
		expect(slotOptions).toHaveProperty("slotOrientation", "portrait");
		expect(slotOptions).toHaveProperty("slotMotion", "inert");
	});
});
