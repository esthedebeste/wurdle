<script lang="ts">
	import { getContext } from "svelte";
	import type { Correctness } from "../game.js";

	export let key: string;

	let correct: Correctness | "" = "";
	(
		getContext("correctness") as SvelteStore<Record<string, Correctness>>
	).subscribe(chars => (correct = chars[key]));
	const type = getContext("typeCallback") as (key: string) => void;
</script>

<button on:click={() => type(key)} class={correct}>{key}</button>

<style>
	button {
		box-sizing: border-box;
		font-size: 1em;
		padding: 0.4em;
		display: inline;
		vertical-align: middle;
		box-sizing: border-box;
		color: #000;
		user-select: none;
		margin: 0.1em;
		background-color: #acacac;
		border: none;
		border-radius: 0.5em;
		text-transform: full-width;
	}
	.w {
		background-color: #161616;
		color: #fff;
	}
	.s {
		background-color: #b59f3b;
	}
	.c {
		background-color: #538d4e;
	}
</style>
