<script lang="ts">
	import Wurdle from "./views/Wurdle.svelte";

	const game = async () => {
		const {
			wordLength,
			maxGuesses,
			pick,
			valid,
		}: {
			wordLength: number;
			maxGuesses: number;
			pick: string[];
			valid: string[];
		} = await fetch("/default-config.json").then(res => res.json());
		const choices = pick
			.filter(word => word.length === wordLength)
			.map(word => word.toLowerCase());
		const solution = choices[Math.floor(Math.random() * choices.length)];
		return {
			wordLength,
			maxGuesses,
			solution,
			validWords: new Set(
				valid
					.filter(word => word.length === wordLength)
					.map(word => word.toLowerCase())
					.concat(choices),
			),
		};
	};
</script>

{#await game()}
	<p>Loading game...</p>
{:then { wordLength, maxGuesses, solution, validWords }}
	<Wurdle {wordLength} {maxGuesses} {solution} {validWords} />
{/await}
