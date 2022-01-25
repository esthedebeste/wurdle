<script lang="ts">
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";
	import { sendNotification } from "../Notifications.svelte";
	import Localized from "./Localized.svelte";

	export let restartable: boolean;
	export let gameName: string;
	export let shareText: string;
	export let won: boolean;
	export let onRestart: () => void;
	const solution = getContext("solution") as string;

	const copyShare = async () => {
		await navigator.clipboard.writeText(shareText);
		sendNotification("copied");
	};
</script>

<div class="container" transition:fade={{ duration: 250 }} role="alertdialog">
	<span class="content">
		<h1><Localized key={won ? "won" : "lost"} /></h1>
		<p class="share-text">
			{shareText}
		</p>
		<p>
			<Localized key="gameType" />: {gameName} <br />
			<Localized key="solution" />: <span class="not-copyable">{solution}</span>
		</p>
		<div class="buttons">
			<span>
				<button class="restart" disabled={!restartable} on:click={onRestart}
					><Localized key="again" /></button
				>
			</span>
			<span>
				<button class="share" on:click={copyShare}>
					<Localized key="share" />
					<img src="/copy.svg" alt="" aria-hidden={true} />
				</button>
			</span>
			<a
				class="tweet"
				href="https://twitter.com/intent/tweet?text={encodeURIComponent(
					shareText,
				)}"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src="/twitter.svg" alt="tweet" />
			</a>
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

	button,
	a {
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

	a.tweet img {
		height: 1.2em;
		vertical-align: middle;
	}

	a.tweet {
		background-color: #fff;
	}

	p.share-text {
		white-space: pre;
	}

	.not-copyable {
		user-select: none;
	}
</style>
