import pluginVue from "eslint-plugin-vue";
import configPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import js from "@eslint/js";

export default [
	js.configs.recommended,
	jsdoc.configs["flat/recommended"],
	configPrettier,
	...pluginVue.configs["flat/recommended"],
	{
		plugins: [jsdoc],
	},
	{
		rules: {
			"vue/multi-word-component-names": "off",
			"vue/valid-v-slot": "off",
		},
	},
];
