import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import rimraf from "rimraf";
import css from "rollup-plugin-css-only";
import livereload from "rollup-plugin-livereload";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;
	function toExit() {
		if (server) server.kill(0);
	}
	process.on("SIGTERM", toExit);
	process.on("exit", toExit);
	const { spawn } = require("child_process");
	return {
		writeBundle() {
			if (server) return;
			server = spawn("npm", ["run", "start", "--", "--dev"], {
				stdio: ["ignore", "inherit", "inherit"],
				shell: true,
			});
		},
	};
}
/** @type {import('rollup').RollupOptions} */
const config = {
	input: "src/main.ts",
	output: {
		sourcemap: true,
		format: "module",
		name: "tbhmens-site",
		dir: "public/build",
	},
	plugins: [
		!production && {
			renderStart() {
				rimraf.sync("./public/build/*.js");
				rimraf.sync("./public/build/*.js.map");
			},
		},
		svelte({
			preprocess: sveltePreprocess({ sourceMap: true }),
			compilerOptions: {
				dev: !production,
				cssHash: ({ css, hash, name }) => `${name}-${hash(css)}`,
				immutable: true,
				css: false,
			},
		}),
		css({ output: "bundle.css" }),
		resolve({
			browser: true,
			dedupe: ["svelte"],
		}),
		commonjs(),
		typescript({
			sourceMap: true,
			inlineSources: true,
		}),
		!production && serve(),
		!production && livereload("public"),
		production &&
			terser({
				compress: { passes: 3, ecma: 2020, unsafe: true },
				mangle: { module: true, toplevel: true },
				format: { ecma: 2020 },
			}),
	],
	watch: { clearScreen: false },
};
export default config;
