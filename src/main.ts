import type { SvelteComponent } from "svelte";
import Router from "./Router.svelte";

const routes: Record<string, Promise<typeof SvelteComponent>> = {
	"/": import("./WurdleWrapper.svelte").then(obj => obj.default),
	"/how-to": import("./views/HowTo.svelte").then(obj => obj.default),
	"/settings": import("./views/Settings.svelte").then(obj => obj.default),
};

export let current: string;
export function navigate(path: string) {
	if (path === current) return;
	current = path;
	const pageComponent = routes[path] || routes["/"];
	history.pushState(null, "", path);
	router.$set({ pageComponent: pageComponent });
}

addEventListener("popstate", () => navigate(location.pathname));

export const router = new Router({
	target: document.body,
	props: { navigate, pageComponent: routes[location.pathname] || routes["/"] },
});
