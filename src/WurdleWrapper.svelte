<script lang="ts">
	import { Game } from "./game.js";
	import Wurdle from "./views/Wurdle.svelte";
	let game = localStorage.getItem("current")
		? Game.fromSave(
				JSON.parse(localStorage.getItem(localStorage.getItem("current"))),
		  )
		: Game.random();

	addEventListener("beforeunload", async () => {
		const key = await (await game).save();
		localStorage.setItem("current", key);
	});
</script>

{#await game}
	<p>Loading game...</p>
{:then resolved}
	<Wurdle
		game={resolved}
		onRestart={async () => (
			((await game).guessWord = () => {
				throw new Error("AAAAAAAAAAA");
			}),
			(game = Game.random())
		)}
	/>
{/await}
