import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { copyFile, mkdir } from "node:fs/promises";
import { defineConfig } from "rollup";
import { defineRollupSwcMinifyOption, minify } from "rollup-plugin-swc3";

await mkdir("./dist/", { recursive: true });
await copyFile("./build/crfsuite.wasm", "./dist/crfsuite.wasm");
await copyFile("./index.d.ts", "./dist/index.d.ts");

export default defineConfig({
	input: ["index.js", "node.js", "browser.js"],
	output: {
		dir: "dist",
		format: "esm",
	},
	plugins: [
		nodeResolve(),
		commonjs({
			esmExternals: true,
		}),
		minify(
			defineRollupSwcMinifyOption({
				compress: { passes: 2 },
			})
		),
	],
});
