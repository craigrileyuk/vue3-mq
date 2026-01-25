---
title: Configuring the Plugin
---

# Configuring Vue3-Mq

When installing Vue3-Mq, you can pass a config object with any of the options below:

```js
app.use(Vue3Mq, {
	// config options here
});
```

| Name               | Type   | Default      | Description                                                                                     |
| ------------------ | ------ | ------------ | ----------------------------------------------------------------------------------------------- |
| preset             | String | "bootstrap5" | Use breakpoints preset. Options are: bootstrap3, bootstrap4, vuetify, tailwind or devices.      |
| breakpoints        | Object | null         | Custom breakpoints config. Object keys and values = breakpoint name and min-width respectively. |
| mergeBreakpoints   | Object | {}           | Breakpoints that will be merged in with the selected preset.                                    |
| defaultBreakpoint  | String | null         | Screen breakpoint to use before browser window is available (i.e. in SSR)                       |
| defaultOrientation | String | null         | Screen orientation to use before browser window is available. [`landscape` or `portrait`]       |
| defaultTheme       | String | null         | OS / browser theme to use before browser window is available. [`light` or `dark`]               |
| defaultMotion      | String | null         | Motion preference to assume before browser window is available. [`reduce` or `no-preference`]   |
