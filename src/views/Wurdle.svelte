<script lang="ts">
	import { setContext } from "svelte";
	import { writable } from "svelte/store";
	import Keyboard from "../components/Keyboard.svelte";
	import Tiles from "../components/Tiles.svelte";
	import { WORDS } from "../words.js";

	const wordLength = 5;
	const maxGuesses = 6;
	const solution = WORDS[Math.floor(Math.random() * WORDS.length)];
	let currentGuess = 0;
	const guesses: string[] = Array(maxGuesses).fill("");
	setContext("wordLength", wordLength);
	setContext("maxGuesses", maxGuesses);
	console.log(solution);
	setContext("solution", solution);
	const correctness = writable({});
	setContext("correctness", correctness);
	let guess = "";
	const type = async (event: CustomEvent) => {
		if (event.detail === "back") return (guess = guess.slice(0, -1));
		if (event.detail === "enter") {
			if (guess.length !== wordLength) return;
			if (guesses.includes(guess)) return alert("You've already guessed that!");
			if (!WORDS.includes(guess)) return alert("That's not a word!");
			guesses[currentGuess++] = guess;
			if (guess === solution || currentGuess === maxGuesses) {
				const share = [];
				for (let g = 0; g < currentGuess; g++) {
					const guess = guesses[g];
					for (let i = 0; i < wordLength; i++)
						share[g] =
							(share[g] || "") +
							(guess[i] === solution[i]
								? "🟩"
								: solution.includes(guess[i])
								? "🟨"
								: "⬛");
				}
				const shareText = `Wurdle\n\n${share.join("\n")}`;
				await navigator.clipboard.writeText(shareText);
				alert(
					`You ${
						guess === solution ? "won" : "lost"
					}! Copied share to clipboard.`,
				);
			}
			correctness.update(c => {
				const chars = { ...c };
				for (let i = 0; i < guess.length; i++) {
					if (guess[i] === solution[i]) chars[guess[i]] = "c";
					else if (solution.includes(guess[i])) {
						if (chars[guess[i]] !== "c") chars[guess[i]] = "s";
					} else chars[guess[i]] = "w";
				}
				return chars;
			});
			return (guess = "");
		}
		if (guess.length === wordLength) return;
		guess += event.detail;
	};
</script>

<div>
	{#each [...Array(maxGuesses).keys()] as i}
		{#if i === currentGuess}
			<Tiles current={currentGuess === i} bind:word={guess} />
		{:else}
			<Tiles word={guesses[i]} />
		{/if}
	{/each}

	<Keyboard on:type={type} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
