import { writable, type Writable } from "svelte/store";

export type ConfigDescriptor = {
	name: string;
	href: string;
	langCode: string;
};
export const configs: ConfigDescriptor[] = await fetch("/configs.json").then(
	r => r.json(),
);
export type Lang = typeof import("../public/config/english.json")["lang"];
export type Config = {
	wordLength: number;
	pick: string[];
	valid: string[];
	lang: Lang;
} & ConfigDescriptor;

const configCache: Record<string, Promise<Config>> = {};
const getConfig = (config: ConfigDescriptor): Promise<Config> =>
	configCache[config.langCode] ||
	(configCache[config.langCode] = fetch(config.href)
		.then(r => r.json())
		.then(json => ({ ...config, ...json })));

const configStore: Writable<Config> & { value?: Config } = writable<Config>();
configStore.subscribe(c => (configStore.value = c));

const setConfigBy = async (key: string, value: string) => {
	const config = configs.find(c => c[key] === value);
	localStorage.setItem("language", config.href);
	configStore.set(await getConfig(config));
};

if (localStorage.getItem("language"))
	setConfigBy("href", localStorage.getItem("language"));
else
	configStore.set(
		await getConfig(
			configs.find(config => navigator.language.startsWith(config.langCode)),
		),
	);

export { configStore, setConfigBy };
