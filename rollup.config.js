import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
	input: 'dist/src/index.js',
	output: {
		file: 'bundle.js',
		format: 'amd'
	},
	plugins: [nodeResolve()],
};