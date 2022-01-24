<script lang="ts">
	import { onDestroy, setContext } from "svelte";
	import GameOver from "../components/GameOver.svelte";
	import Keyboard from "../components/Keyboard.svelte";
	import Tiles from "../components/Tiles.svelte";
	import type { Game } from "../game.js";

	export let game: Game;
	let { wordLength, guesses, gameName, gameOver, currentGuess } = game;
	setContext("game", game);
	setContext("solution", game.solution);
	setContext("wordLength", game.wordLength);
	setContext("maxGuesses", game.maxGuesses);
	setContext("correctness", game.correctnessStore);
	let guess = "";
	let won = false;
	const guessWord = async () => {
		const guessC = guess;
		guess = "";
		currentGuess++;
		const result = await game.guessWord(guessC);
		switch (result) {
			case "won":
				gameOver = true;
				won = true;
				break;
			case "lost":
				gameOver = true;
				break;
			case "invalid":
				guess = guessC;
				currentGuess--;
				break;
		}
	};

	const type = async (event: CustomEvent) => {
		if (event.detail === "back") return (guess = guess.slice(0, -1));
		if (event.detail === "enter") return guessWord();
		if (guess.length === wordLength) return;
		guess += event.detail;
	};

	const keydownType = (event: KeyboardEvent) => {
		if (event.code === "Backspace") return (guess = guess.slice(0, -1));
		if (event.code === "Enter") return guessWord();
		if (guess.length === wordLength) return;
		if (/^[a-zA-Z]$/.test(event.key)) {
			guess += event.key.toLowerCase();
		}
	};
	// support desktop keyboards as well
	document.addEventListener("keydown", keydownType);
	onDestroy(() => document.removeEventListener("keydown", keydownType));
	export let onRestart: () => void;
</script>

<main>
	<div>
		{#each [...guesses.keys()] as i}
			{#if i === currentGuess}
				<Tiles current={currentGuess === i} bind:word={guess} />
			{:else}
				<Tiles word={guesses[i]} />
			{/if}
		{/each}
	</div>

	<Keyboard on:type={type} />
</main>

{#if gameOver}
	<GameOver
		restartable
		shareText={game.shareText}
		{gameName}
		{won}
		{onRestart}
	/>
{/if}

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
