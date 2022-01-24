<script lang="ts">
	import type { Correctness } from "../game.js";

	export let type: Correctness = "w";
</script>

<span class={type}><slot /></span>

<style>
	* {
		box-sizing: border-box;
		height: 2em;
		font-size: 1.8em;
		width: 2em;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		vertical-align: middle;
		box-sizing: border-box;
		color: #ffffff;
		text-transform: uppercase;
		user-select: none;
		margin: 0.1em;
	}
	.w {
		background-color: #161616;
		border: #1b1b1b solid 0.2em;
	}
	.s {
		background-color: #b59f3b;
	}
	.c {
		background-color: #538d4e;
	}
</style>
