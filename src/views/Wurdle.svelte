<script lang="ts" context="module">
	let currentKeyListener = (event: KeyboardEvent) => {};
	document.addEventListener("keydown", e => currentKeyListener(e));
</script>

<script lang="ts">
	import { setContext } from "svelte";
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
	console.log(game.solution);
	let guess = "";
	let won = game.won;
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

	// support desktop keyboards as well
	currentKeyListener = event => {
		if (event.code === "Backspace") return (guess = guess.slice(0, -1));
		if (event.code === "Enter") return guessWord();
		if (guess.length === wordLength) return;
		if (/^[a-zA-Z]$/.test(event.key)) {
			guess += event.key.toLowerCase();
		}
	};
	export let onRestart: () => void;
</script>

<main on:blur={() => game.save(true)}>
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

	{#if gameOver}
		<GameOver
			restartable
			shareText={game.shareText}
			{gameName}
			{won}
			{onRestart}
		/>
	{/if}
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
