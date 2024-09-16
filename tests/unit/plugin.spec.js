// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";

import plugin from "../../src/plugin.js";
import MqResponsive from "../../src/component.js";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import MatchMediaMock from "../mock/MatchMediaMock";
import * as store from "../../src/store.js";

describe("plugin.js", () => {
	let results;
	let matchMediaMock;
	beforeEach(() => {
		results = new Set();
		matchMediaMock = MatchMediaMock.create();
		matchMediaMock.setConfig({ type: "screen", width: 1200 });
		window.matchMedia = vi.fn((...args) => {
			const result = matchMediaMock(...args);
			results.add(result);
			return result;
		});
	});

	it("should register $mq property", () => {
		const wrapper = mount(
			{
				render() {
					return h("div");
				},
				inject: ["mq"],
			},
			{ global: { plugins: [plugin] }, shallow: true }
		);
		expect("mq" in wrapper.vm).toBe(true);
	});

	it("should default to defaultBreakpoint in options", () => {
		matchMediaMock.setConfig({});
		const plugins = [
			[
				plugin,
				{
					defaultBreakpoint: "md",
				},
			],
		];
		const wrapper = mount(
			{
				template: "<div></div>",
				inject: ["mq"],
			},
			{
				global: {
					plugins,
				},
				shallow: true,
			}
		);
		expect(wrapper.vm.mq.current).toBe("md");
	});

	it("should mount with a preset and set the correct breakpoints", () => {
		matchMediaMock.setConfig({});
		const plugins = [
			[
				plugin,
				{
					preset: "devices",
				},
			],
		];
		const wrapper = mount(
			{
				render() {
					return h("div");
				},
				inject: ["mq"],
			},
			{
				global: {
					plugins,
				},
				shallow: true,
			}
		);

		matchMediaMock.setConfig({ type: "screen", width: 1920 });
		Array.from(results)[1].callListeners();
		expect(wrapper.vm.mq.current).toBe("desktop");
	});

	it("should subscribe to media queries", () => {
		const wrapper = mount(
			{
				render() {
					return h("div");
				},
				inject: ["mq"],
			},
			{ global: { plugins: [plugin] }, shallow: true }
		);
		expect(typeof window).not.toBe("undefined");
		expect(window.matchMedia).toBeCalledWith("(min-width: 1400px)");
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 1200px) and (max-width: 1399px)"
		);
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 992px) and (max-width: 1199px)"
		);
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 768px) and (max-width: 991px)"
		);
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 576px) and (max-width: 767px)"
		);
		expect(window.matchMedia).toBeCalledWith(
			"(min-width: 0px) and (max-width: 575px)"
		);
	});

	it("should set $mq accordingly when media query change", () => {
		const wrapper = mount(
			{
				render() {
					return h("div");
				},
				inject: ["mq"],
			},
			{ global: { plugins: [plugin] }, shallow: true }
		);
		matchMediaMock.setConfig({ type: "screen", width: 700 });
		Array.from(results)[1].callListeners();
		expect(wrapper.vm.mq.current).toBe("sm");

		matchMediaMock.setConfig({ type: "screen", width: 800 });
		Array.from(results)[1].callListeners();
		expect(wrapper.vm.mq.current).toBe("md");

		matchMediaMock.setConfig({ type: "screen", width: 1000 });
		Array.from(results)[1].callListeners();
		expect(wrapper.vm.mq.current).toBe("lg");

		matchMediaMock.setConfig({ type: "screen", width: 1300 });
		Array.from(results)[1].callListeners();
		expect(wrapper.vm.mq.current).toBe("xl");

		matchMediaMock.setConfig({ type: "screen", width: 1920 });
		Array.from(results)[1].callListeners();
		expect(wrapper.vm.mq.current).toBe("xxl");
	});

	it("should mount the mq-responsive component", () => {
		store.mqAvailableBreakpoints = {
			value: {
				xs: 0,
				sm: 576,
				md: 768,
				lg: 992,
				xl: 1200,
				xxl: 1400,
			},
		};
		store.updateState("xl");
		const wrapper = mount(MqResponsive, {
			shallow: false,
			slots: {
				default: "<h1>This is a test</h1>",
			},
			props: {
				target: "xl",
			},
		});
		expect(wrapper.html()).toContain("This is a test");
	});

	it("should mount group list items", () => {
		matchMediaMock.setConfig({});
		const plugins = [
			[
				plugin,
				{
					defaultBreakpoint: "md",
					defaultOrientation: "landscape",
					defaultTheme: "dark",
				},
			],
		];

		const wrapper = mount(MqResponsive, {
			shallow: false,
			global: {
				plugins,
			},
			slots: {
				xs: "This is xs",
				sm: "This is sm",
				"sm-lg": "This is sm-lg",
				"md+": "This is md+",
				"md+:2": "This is md+:2",
				"lg-": "This is lg-",
				lg: "This is lg",
				landscape: "This is landscape",
				portrait: "This is portrait",
				light: "This is light",
				dark: "This is dark",
				inert: "This is reduced motion",
				motion: "This is no motion preference",
				"md:landscape:dark": "This is md:landscape:dark",
				"md:portrait:dark": "This is md:portrait:dark",
			},
			props: {
				group: true,
				tag: "ul",
				listTag: "li",
			},
		});

		expect(wrapper.html()).not.toContain("<li>This is xs</li>");
		expect(wrapper.html()).not.toContain("<li>This is sm</li>");
		expect(wrapper.html()).toContain("<li>This is sm-lg</li>");
		expect(wrapper.html()).toContain("<li>This is md+</li>");
		expect(wrapper.html()).toContain("<li>This is md+:2</li>");
		expect(wrapper.html()).toContain("<li>This is lg-</li>");
		expect(wrapper.html()).not.toContain("<li>This is lg</li>");
		expect(wrapper.html()).toContain("<li>This is landscape</li>");
		expect(wrapper.html()).not.toContain("<li>This is portrait</li>");
		expect(wrapper.html()).not.toContain("<li>This is light</li>");
		expect(wrapper.html()).toContain("<li>This is dark</li>");
		expect(wrapper.html()).not.toContain("<li>This is reduced motion</li>");
		expect(wrapper.html()).toContain(
			"<li>This is no motion preference</li>"
		);
		expect(wrapper.html()).toContain("<li>This is md:landscape:dark</li>");
		expect(wrapper.html()).not.toContain(
			"<li>This is md:portrait:dark</li>"
		);
	});
});
