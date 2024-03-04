import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import {writeFileSync} from 'node:fs';
import {readdir, stat} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

async function buildInputContent(path) {
    const directory = resolve('./src');
    const files = await getFiles(directory);

    const content = files.map(path => {
        const relativePath = '.' + path.replace(directory, '').replace('.ts', '');

        if (relativePath === './index') {
            return null;
        }

        return `export * from '${relativePath}';`;
    }).filter(path => path !== null);

    return content.join("\n");
}

writeFileSync('./src/index.ts', await buildInputContent('./src'));

export default [
    {
        input: `src/index.ts`,
        output: [
            {
                file: 'dist/amd/dockspace.js',
                format: 'amd',
                sourcemap: true
            },
            {
                file: 'dist/cjs/dockspace.js',
                format: 'cjs',
                sourcemap: true,
                plugins: [
                    terser(),
                ]
            },
            {
                file: 'dist/es/dockspace.js',
                format: 'es',
                sourcemap: true
            },
            {
                file: 'dist/iife/dockspace.js',
                name: 'dockspace',
                format: 'iife',
                sourcemap: true
            },
            {
                file: 'dist/umd/dockspace.js',
                name: 'DockspaceJS',
                format: 'umd',
                sourcemap: true
            },
            {
                file: 'dist/system/dockspace.js',
                format: 'system',
                sourcemap: true
            }
        ],

        watch: {
            include: 'src/**'
        },

        plugins: [
            // Compile TypeScript files
            typescript({
                tsconfig: './tsconfig.json',
            }),
        ]
    }
]
