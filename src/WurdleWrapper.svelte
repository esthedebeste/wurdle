<script lang="ts">
	import { onDestroy } from "svelte";
	import { Game } from "./game.js";
	import { configStore, type Config } from "./settings.js";
	import Wurdle from "./views/Wurdle.svelte";
	const loadGame = (config: Config) =>
		localStorage.getItem(`current-${config.langCode}`)
			? Game.fromSave(
					JSON.parse(
						localStorage.getItem(
							localStorage.getItem(`current-${config.langCode}`),
						),
					),
			  )
			: Game.random(config);
	let game: Promise<Game>;

	const save = async () => {
		await (await game)?.save();
	};
	addEventListener("beforeunload", save);

	configStore.subscribe(async config => {
		if (!config) return;
		await save();
		game = loadGame(config);
	});
	onDestroy(() => {
		removeEventListener("beforeunload", save);
		save();
	});
</script>

{#if game != null}
	{#await game}
		<p>Loading game...</p>
	{:then resolved}
		<Wurdle game={resolved} onRestart={async () => (game = Game.random())} />
	{/await}
{/if}
