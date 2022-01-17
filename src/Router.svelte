<script lang="ts" context="module">
</script>

<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { noop } from "svelte/internal";
	import Link from "./components/Link.svelte";
	export let navigate: (page: string) => void = noop;

	export let pageComponent: Promise<typeof SvelteComponent>;
</script>

<div id="container">
	<nav>
		<Link href="/how-to" title="How To" {navigate}>⁉️</Link>
		<a
			href="/"
			class="title"
			title="WURDLE"
			on:click|preventDefault={() => navigate("/")}
		>
			WURDLE
		</a>
		<Link href="/settings" title="Settings" {navigate}>⚙️</Link>
	</nav>

	<main>
		{#await pageComponent}
			<p>Loading...</p>
		{:then pageComponent}
			<svelte:component this={pageComponent} />
		{/await}
	</main>
</div>

<style>
	@import url("/fonts/fonts.css");
	:global(html, body) {
		font-family: "Roboto Mono", monospace, system-ui, sans-serif;
		font-weight: 200;
		background-color: #101114;
		color: #ffffff;
	}

	div#container {
		margin: auto;
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
		justify-content: space-between;
		align-items: center;
		gap: 1ch;
		font-size: 1.3em;
		font-weight: 700;
		border-bottom: 3px solid #ffffff;
		margin-bottom: 1em;
		width: 100%;
	}

	main {
		width: 100%;
	}

	a.title {
		color: #ffffff;
		font-size: 1.5em;
		letter-spacing: 0.2rem;
		text-align: center;
		user-select: none;
	}
</style>
