<script lang="ts" context="module">
	import { writable } from "svelte/store";
	import { fly } from "svelte/transition";

	export const notifications = writable([]);
	export const sendNotification = (
		message: string,
		type = "default",
		timeout = 3000,
	) => {
		notifications.update(state => [
			...state,
			{ id: Date.now(), type, message, timeout },
		]);
		setTimeout(() => notifications.update(state => state.slice(1)), timeout);
	};
</script>

<span role="log" aria-live="polite">
	{#each $notifications as notification (notification.id)}
		<div transition:fly={{ y: 30 }}>
			{notification.message}
		</div>
	{/each}
</span>

<style>
	span {
		position: fixed;
		top: 10px;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5em;
		font-size: 1.2em;
	}
	div {
		background-color: #555;
		padding: 0.5em;
		border-radius: 0.2em;
	}
</style>
