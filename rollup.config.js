import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import swcPreserveDirectives from 'rollup-swc-preserve-directives';

/**
 * @param {import('rollup').RollupOptions} config
 * @returns {import('rollup').RollupOptions}
 */
const bundle = config => ({
    ...config,
    input: 'src/index.ts',
    external: ['next/headers', 'jose', 'node:crypto', 'react', '@tma.js/sdk-react', '@tma.js/sdk'],
})

export default [
    bundle({
        plugins: [esbuild(), swcPreserveDirectives()],
        output: [
            {
                dir: "dist",
                format: "es",
                exports: "named",
                preserveModules: true
            },
        ],
    }),
    bundle({
        plugins: [dts()],
        output: {
            dir: "dist",
            format: "es",
            exports: "named",
            preserveModules: true
        },
    }),
];