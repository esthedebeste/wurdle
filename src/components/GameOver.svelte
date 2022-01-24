<script lang="ts">
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";
	import { sendNotification } from "../Notifications.svelte";
	export let restartable: boolean;
	export let gameName: string;
	export let shareText: string;
	export let won: boolean;
	export let onRestart: () => void;
	const solution = getContext("solution") as string;

	const copyShare = () => {
		navigator.clipboard.writeText(shareText);
		sendNotification("Copied to clipboard!");
	};
</script>

<div class="container" transition:fade={{ duration: 250 }} role="alertdialog">
	<span class="content">
		<h1>You {won ? "won" : "lost"}!</h1>
		<p class="share-text">
			{shareText}
		</p>
		<p>
			Game: {gameName} <br />
			Solution: <span class="not-copyable">{solution}</span>
		</p>
		<div class="buttons">
			<span>
				<button class="restart" disabled={!restartable} on:click={onRestart}
					>Restart</button
				>
			</span>
			<button class="share" on:click={copyShare}>
				Share
				<img src="/copy.svg" alt="" aria-hidden={true} />
			</button>
		</div>
	</span>
</div>

<!-- popup -->
<style>
	.container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		font-weight: 300;
	}

	.content {
		background: #111111;
		font-size: 1.5em;
		color: white;
		border-radius: 0.5em;
		padding: 1em;
	}

	h1 {
		margin-top: 0;
		font-size: 1.5em;
		/* text-align: center; */
	}

	.buttons {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.buttons > :not(:last-child) {
		padding-right: 0.5em;
		margin-right: 0.5em;
		border-right: #fff 1px solid;
	}

	button {
		box-sizing: border-box;
		font-size: 1.2em;
		padding: 0.5em;
		display: inline;
		vertical-align: middle;
		box-sizing: border-box;
		user-select: none;
		margin: 0.1em;
		background-color: #acacac;
		border: none;
		border-radius: 0.5em;
	}

	button.share {
		background-color: #538d4e;
		color: #fff;
	}

	button.share img {
		display: inline;
		vertical-align: text-bottom;

		/* width: 1em; */
		height: 1.2em;
	}

	button.restart {
		background-color: #4e538d;
		color: #fff;
	}

	p.share-text {
		white-space: pre;
	}

	.not-copyable {
		user-select: none;
	}
</style>
