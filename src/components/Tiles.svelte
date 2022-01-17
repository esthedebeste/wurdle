<script lang="ts">
	import { getContext } from "svelte";
	import Tile from "./Tile.svelte";
	const length = getContext("wordLength") as number;
	const range = [...Array(length).keys()];

	const solution = getContext("solution") as string;
	export let word: string = "";
	export let current: boolean = false;
</script>

<div>
	{#if current}
		{#each range as i}
			<Tile type="w">{word[i] || " "}</Tile>
		{/each}
	{:else}
		{#each range as i}
			<Tile
				type={word[i] === solution[i]
					? "c"
					: solution.includes(word[i])
					? "s"
					: "w"}>{word[i] || " "}</Tile
			>
		{/each}
	{/if}
</div>
