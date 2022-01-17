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
	<br />
	<span />{#each "asdfghjkl" as key}
		<Key {key} />
	{/each}
	<br />
	<Key key="back" />
	{#each "zxcvbnm" as key}
		<Key {key} />
	{/each}
	<Key key="enter" />
</div>

<style>
	div {
		text-align: center;
		margin-top: 2em;
	}
	span {
		width: 0.5ch;
	}
</style>
