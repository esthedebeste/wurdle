<script lang="ts">
	import { createEventDispatcher, setContext } from "svelte";
	import Key from "./Key.svelte";

	const dispatch = createEventDispatcher();

	function type(key: string) {
		dispatch("type", key);
	}

	setContext("typeCallback", type);
</script>

<div>
	{#each "qwertyuiop" as key}
		<Key {key} />
	{/each}
</div>
<div>
	{#each "asdfghjkl" as key}
		<Key {key} />
	{/each}
</div>
<div>
	{#each "zxcvbnm" as key}<Key {key} />{/each}
</div>
<div>
	<button id="back" on:click={() => type("back")}>back</button>
	<button id="enter" on:click={() => type("enter")}>enter</button>
</div>

<style>
	div {
		text-align: center;
	}

	button {
		position: relative;
		top: -2.3em;
		box-sizing: border-box;
		font-size: 1em;
		width: calc(4ch + 0.4em);
		height: 2.1em;
		padding: 0em;
		display: inline;
		vertical-align: middle;
		color: #000;
		user-select: none;
		margin: 0.1em;
		background-color: #acacac;
		border: none;
		border-radius: 0.5em;
	}
	button#back {
		left: -12.5ch;
	}
	button#enter {
		left: 12.5ch;
	}
</style>
