import { writable, type Writable } from "svelte/store";
// @ts-ignore
import { sendNotification } from "./Notifications.svelte";

export type Wrong = "w";
export const wrong: Wrong = "w";
export type Somewhere = "s";
export const somewhere: Somewhere = "s";
export type Correct = "c";
export const correct: Correct = "c";
export type Correctness = Wrong | Somewhere | Correct;
export class Game {
	gameName: string;
	config: string;
	solution: string;
	choices: string[];
	validWords: Set<string>;
	maxGuesses: any;
	wordLength: number;
	currentGuess: number;
	gameOver: boolean;
	correctness: Record<string, Correctness>;
	correctnessStore: Writable<Record<string, Correctness>>;
	guesses: string[];
	shareText: string;
	cheated: boolean;

	constructor({
		config = "/default-config.json",
		wordLength = 5,
		maxGuesses = 6,
		solution = "words",
		choices = ["words"] as string[],
		validWords = new Set(["words"]),
		currentGuess = 0,
		guesses = Array<string>(maxGuesses).fill(""),
		correctness = {} as Record<string, Correctness>,
		gameName = "Wurdle",
		gameOver = false,
		cheated = false,
	}) {
		this.config = config;
		this.wordLength = wordLength;
		this.maxGuesses = maxGuesses;
		this.solution = solution;
		this.choices = choices;
		this.validWords = new Set(validWords);
		this.currentGuess = currentGuess;
		this.guesses = guesses;
		this.correctness = correctness;
		this.gameName = gameName;
		this.gameOver = gameOver;
		this.correctnessStore = writable(correctness);
		this.cheated = cheated;

		Object.defineProperty(window, "pleasegivemethesolutioniamcheating", {
			get: () => ((this.cheated = true), this.solution),
			configurable: true,
		});
	}

	static async random() {
		const {
			wordLength,
			maxGuesses = 6,
			pick,
			valid,
		}: {
			wordLength: number;
			maxGuesses: number;
			pick: string[];
			valid: string[];
		} = await fetch("/default-config.json").then(res => res.json());
		const choices = pick
			.filter(word => word.length === wordLength)
			.map(word => word.toLowerCase());
		const solution = choices[Math.floor(Math.random() * choices.length)];
		return new Game({
			config: "/default-config.json",
			wordLength,
			maxGuesses,
			solution,
			choices,
			validWords: new Set(
				valid
					.filter(word => word.length === wordLength)
					.map(word => word.toLowerCase())
					.concat(choices),
			),
			currentGuess: 0,
			guesses: Array<string>(maxGuesses).fill(""),
			correctness: {},
			gameName: "Random Wurdle",
			gameOver: false,
		});
	}
	static async fromSave(save: Partial<Game>): Promise<Game> {
		return new Game(save);
	}

	async save() {
		const key = `game-${this.gameName.toLowerCase().replace(/\s/g, "-")}`;
		localStorage.setItem(
			key,
			JSON.stringify(this, (key, value) => {
				if (value instanceof Set) return Array.from(value);
				return value;
			}),
		);
		return key;
	}

	randomize() {
		this.solution = Array.from(this.validWords)[
			Math.floor(Math.random() * this.validWords.size)
		];
		this.gameOver = false;
		this.currentGuess = 0;
		this.guesses = Array<string>(this.maxGuesses).fill("");
		this.correctness = {};
	}
	sharePart(guess: string): string {
		let ret = "";
		for (let i = 0; i < guess.length; i++)
			if (guess[i] === this.solution[i]) ret += this.cheated ? "❎" : "🟩";
			else if (this.solution.includes(guess[i])) ret += "🟨";
			else ret += "⬛";
		return ret;
	}
	async endGame(win: boolean) {
		this.gameOver = true;
		const share = this.guesses
			.slice(0, this.currentGuess)
			.map(guess => this.sharePart(guess))
			.join("\n");
		this.shareText = `${this.gameName} ${win ? this.currentGuess : "X"}/${
			this.maxGuesses
		}\n\n${share}`;
		await navigator.clipboard.writeText(this.shareText);
		sendNotification(`You ${win ? "won" : "lost"}! Copied share to clipboard.`);
	}

	async guessWord(guess: string) {
		if (guess.length !== this.wordLength)
			return sendNotification("Word not long enough."), "invalid";
		if (this.guesses.includes(guess))
			return sendNotification("You've already guessed that!"), "invalid";
		if (!this.validWords.has(guess))
			return sendNotification("That's not a word!"), "invalid";
		this.guesses[this.currentGuess++] = guess;
		if (guess === this.solution) return await this.endGame(true), "won";
		if (this.currentGuess === this.maxGuesses)
			return await this.endGame(false), "lost";

		for (let i = 0; i < guess.length; i++)
			// don't overwrite a correct guess on the keyboard
			if (this.correctness[guess[i]] !== "c")
				if (guess[i] === this.solution[i]) this.correctness[guess[i]] = "c";
				else if (this.solution.includes(guess[i]))
					this.correctness[guess[i]] = "s";
				else this.correctness[guess[i]] = "w";

		this.correctnessStore.set({ ...this.correctness });
		return "guessed";
	}
}
