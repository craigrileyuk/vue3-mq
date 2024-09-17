<template>
	<div class="min-h-screen flex flex-col">
		<header class="bg-slate-500 text-white shadow-md p-2">
			<h1 class="text-2xl">Vue3-MQ Sandbox</h1>
		</header>
		<main class="flex-grow container mx-auto py-4">
			<pre>{{ mq }}</pre>
			<MqResponsive>No props</MqResponsive>
			<MqResponsive inert>Reduced motion is preferred</MqResponsive>
			<MqResponsive motion>Normal motion is preferred</MqResponsive>
			<MqResponsive group>
				<template #motion>Motion slot</template>
				<template #inert>Inert slot</template>
			</MqResponsive>
			<div class="bg-slate-200 p-4 my-4">
				<h4 class="text-xl font-bold">Available Breakpoints:</h4>
				<pre class="text-xs"
					>{{ availableBreakpoints }}
				</pre
				>
			</div>
			<div class="flex justify-around">
				<button
					class="bg-blue-500 text-white px-4 py-2 rounded shadow-sm relative before:transition-opacity before:absolute before:inset-0 before:bg-current before:opacity-0 hover:before:opacity-20"
					@click="updateBreakpoints({ preset: 'wordpress' })"
				>
					Update Preset to Wordpress
				</button>
				<button
					class="bg-red-500 text-white px-4 py-2 rounded shadow-sm relative before:transition-opacity before:absolute before:inset-0 before:bg-current before:opacity-0 hover:before:opacity-20"
					@click="changeToCustomBreakpoints"
				>
					Update Breakpoints to Custom
				</button>
			</div>
		</main>
		<footer class="bg-slate-900 text-white">
			<div class="container mx-auto text-sm">
				&copy; Craig Riley {{ new Date().getFullYear() }}
			</div>
		</footer>
	</div>
</template>

<script setup>
import { useMq, availableBreakpoints, updateBreakpoints } from "vue3-mq";

const mq = useMq();

const changeToCustomBreakpoints = () => {
	updateBreakpoints({
		breakpoints: {
			tiny: 0,
			prettySmall: 600,
			mediocre: 1020,
			sizeable: 1280,
			big: 1600,
			chonky: 1920,
			colossal: 2400,
		},
	});
};
</script>
