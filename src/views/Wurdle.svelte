<script lang="ts">
	import { setContext } from "svelte";
	import { writable } from "svelte/store";
	import Keyboard from "../components/Keyboard.svelte";
	import Tiles from "../components/Tiles.svelte";
	import { sendNotification } from "../Notifications.svelte";

	let currentGuess = 0;
	export let solution: string;
	export let wordLength: number;
	export let maxGuesses: number;
	export let validWords: Set<string>;
	setContext("solution", solution);
	setContext("wordLength", wordLength);
	setContext("maxGuesses", maxGuesses);
	const guesses: string[] = Array(maxGuesses).fill("");
	const correctness = writable({});
	setContext("correctness", correctness);
	let guess = "";

	const endGame = async (win: boolean) => {
		const share = guesses
			.slice(0, currentGuess)
			.map(guess =>
				[...guess]
					.map((c, i) =>
						c === solution[i] ? "🟩" : solution.includes(c) ? "🟨" : "⬛",
					)
					.join(""),
			);
		const shareText = `Wurdle\n\n${share.join("\n")}`;
		await navigator.clipboard.writeText(shareText);
		sendNotification(`You ${win ? "won" : "lost"}! Copied share to clipboard.`);
	};
	const guessWord = () => {
		if (guess.length !== wordLength)
			return sendNotification("Word not long enough.");
		if (guesses.includes(guess))
			return sendNotification("You've already guessed that!");
		if (!validWords.has(guess)) return sendNotification("That's not a word!");
		guesses[currentGuess++] = guess;
		if (guess === solution) endGame(true);
		if (currentGuess === maxGuesses) endGame(false);
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
		guess = "";
	};

	const type = async (event: CustomEvent) => {
		if (event.detail === "back") return (guess = guess.slice(0, -1));
		if (event.detail === "enter") return guessWord();
		if (guess.length === wordLength) return;
		guess += event.detail;
	};
</script>

<main>
	<div>
		{#each [...Array(maxGuesses).keys()] as i}
			{#if i === currentGuess}
				<Tiles current={currentGuess === i} bind:word={guess} />
			{:else}
				<Tiles word={guesses[i]} />
			{/if}
		{/each}
	</div>

	<Keyboard on:type={type} />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	div {
		margin-bottom: 2em;
	}
</style>
