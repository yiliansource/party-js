import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options): Options[] => {
    const commonOptions: Partial<Options> = {
        entry: {
            index: 'lib/index.ts',
        },
        sourcemap: true,
        ...options,
    };

    const productionOptions = {
        minify: true,
    };

    return [
        {
            ...commonOptions,
            format: 'esm',
            outDir: './dist/esm',
            dts: true,
            clean: true,
            sourcemap: true,
        },
        {
            ...commonOptions,
            format: 'cjs',
            outDir: './dist/cjs',
        },
    ];
});
