<script lang="ts">
	export let href: string;
	export let title: string;
	export let navigate: (href: string) => void;
</script>

<a {href} {title} on:click|preventDefault={() => navigate(href)}><slot /></a>

<style>
	a {
		user-select: none;
	}
</style>
