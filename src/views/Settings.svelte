<script lang="ts">
	import Localized from "../components/Localized.svelte";
	import { configs, configStore, setConfigBy } from "../settings.js";

	let selected = configStore.value.href;
</script>

<main>
	<h1><Localized key="settings" /></h1>

	<label>
		<Localized key="language" />
		<select
			bind:value={selected}
			on:change={() => setConfigBy("href", selected)}
		>
			{#each configs as { href, name }}
				<option value={href}>{name}</option>
			{/each}
		</select>
	</label>
</main>
