import { describe, beforeAll, it, expect } from "vitest";

import * as store from "../../src/store.js";
import { sanitiseBreakpoints } from "../../src/validation";
import { bootstrap5 } from "../../src/presets";

describe("store.js", () => {
	beforeAll(() => {
		const available = sanitiseBreakpoints(bootstrap5);
		store.setAvailableBreakpoints(available);
	});

	it("updates the MQ state correctly", () => {
		store.updateState("md");

		expect(store.mqState.current).toBe("md");

		expect(store.mqState.md).toBeTruthy();
		expect(store.mqState.mdPlus).toBeTruthy();
		expect(store.mqState.mdMinus).toBeTruthy();

		expect(store.mqState.xs).toBeFalsy();

		expect(store.mqState.sm).toBeFalsy();
		expect(store.mqState.smPlus).toBeTruthy();
		expect(store.mqState.smMinus).toBeFalsy();

		expect(store.mqState.lg).toBeFalsy();
		expect(store.mqState.lgPlus).toBeFalsy();
		expect(store.mqState.lgMinus).toBeTruthy();

		expect(store.mqState.xl).toBeFalsy();
		expect(store.mqState.xlPlus).toBeFalsy();
		expect(store.mqState.xlMinus).toBeTruthy();

		expect(store.mqState.xxl).toBeFalsy();
	});
});
