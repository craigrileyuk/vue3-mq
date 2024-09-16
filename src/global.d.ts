declare module "vue" {
	interface ComponentCustomProperties {
		/** @type {import("vue").reactive} */
		$mq: reactive;
	}
}
