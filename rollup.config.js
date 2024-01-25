import resolve from '@rollup/plugin-node-resolve';
//import typescript from '@rollup/plugin-typescript';
import {rollupPluginHTML as html } from '@web/rollup-plugin-html';
export default {
	input: 'dist/src/index.js',
	output: {
		file: 'dist/auth-webcomp-bundled.js',
		format: 'esm'
	},
	plugins: [
		// html({
		// 	input:'demo/index.html'}
		// 	),
		resolve(),
		//typescript()
	],
};