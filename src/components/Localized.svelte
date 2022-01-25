<script lang="ts">
	import { configStore, type Lang } from "../settings.js";

	export let key: keyof Lang;
	$: str = $configStore.lang[key];
</script>

{str}
