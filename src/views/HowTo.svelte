<script lang="ts">
	import { setContext } from "svelte";
	import Tiles from "../components/Tiles.svelte";
	setContext("wordLength", 5);
	setContext("solution", "a..l.");
</script>

<main>
	<h1>How to play</h1>
	<p>Guess the word in 6 tries.</p>
	<p>
		After each guess, the color of the tiles will change to show how close your
		guess was to the word.
	</p>
	<section>
		<h2>Examples</h2>
		<Tiles word="aches" />
		<p>The letter <em>A</em> is in the word and in the correct spot.</p>
		<Tiles word="blues" />
		<p>
			The letter <em>L</em> is <em>in</em> the word but in the <em>wrong</em> spot.
		</p>
		<Tiles word="chips" />
		<p>None of these letters are in the word.</p>
	</section>
</main>

<style>
	main {
		max-width: 40ch;
	}
</style>
