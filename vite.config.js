import vue from "@vitejs/plugin-vue";
import path from "path";

export default {
	plugins: [
		vue({
			reactivityTransform: true,
		}),
	],
	resolve: {
		alias: {
			"vue3-mq": path.resolve(__dirname, "./src/index.js"),
		},
	},
	test: {
		include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
	},
};
