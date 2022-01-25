<script lang="ts" context="module">
</script>

<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { noop } from "svelte/internal";
	import Link from "./components/Link.svelte";
	import Notifications from "./Notifications.svelte";
	import { configStore } from "./settings.js";
	export let navigate: (page: string) => void = noop;

	$: wurdle = $configStore?.lang.wurdle.toUpperCase();
	export let pageComponent: Promise<typeof SvelteComponent>;
</script>

<div id="container">
	<nav>
		<Link href="/how-to" title="How To" {navigate}>⁉️</Link>
		<a
			href="/"
			class="title"
			title={wurdle}
			on:click|preventDefault={() => navigate("/")}
		>
			{wurdle}
		</a>
		<Link href="/settings" title="Settings" {navigate}>⚙️</Link>
	</nav>

	{#await pageComponent}
		<p>Loading...</p>
	{:then pageComponent}
		<svelte:component this={pageComponent} />
	{/await}
</div>
<Notifications />

<style>
	@import url("/fonts/fonts.css");
	:global(html, body) {
		font-family: "Roboto Mono", monospace, system-ui, sans-serif;
		font-weight: 200;
		background-color: #101114;
		font-size: 2vh;
		color: #ffffff;
	}

	div#container {
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	:global(a) {
		color: #0080ff;
		text-decoration: none;
	}
	:global(a:hover) {
		text-decoration: none;
	}
	:global(a:visited) {
		color: #0071e2;
	}

	:global(h1) {
		font-weight: 600;
		font-size: 2em;
	}

	nav {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 5ch;
		font-size: 1.3em;
		font-weight: 700;
		border-bottom: 3px solid #ffffff;
		margin-bottom: 1em;
		width: 100%;
		flex: 1 1 0;
	}

	:global(main) {
		width: min(100%, 60ch);
		flex: 1 1 0;
	}

	a.title {
		color: #ffffff;
		font-size: 1.5em;
		letter-spacing: 0.2rem;
		text-align: center;
		user-select: none;
	}
</style>
