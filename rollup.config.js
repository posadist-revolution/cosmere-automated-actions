// rollup.config.js
import path from 'path';
import fs from 'fs';

import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import scss from 'rollup-plugin-scss';

export default CLIArgs => {
    const isRelease = CLIArgs.release || false;

    return {
        input: './src/main.ts',
        output: {
            dir: 'build',
            format: 'es',

            // Removes the hash from the asset filename
            assetFileNames: '[name][extname]',
        },
        plugins: [
            // CSS
            scss(),

            // Typescript
            nodeResolve({ preferBuiltins: true }),
            typescript(),
            commonjs(),

            // Copy module.json & templates
            copy({
                targets: [
                    { src: 'src/module.json', dest: 'build' },
                    // { src: 'src/templates/**/*.hbs', dest: 'build/' },
                    { src: 'src/lang/*.json', dest: 'build/' },
                    { src: 'src/assets/**/*', dest: 'build/' },
                    { src: 'src/styles/**/*', dest: 'build/' },
                    { src: 'src/templates/**/*', dest: 'build/' },
                ],
                flatten: false
            }),

            {
                name: 'release-module-json-modifier',
                writeBundle: async function (outputOptions, bundle) {
                    if (!isRelease) return;

                    // Path to the output module.json
                    const moduleJsonPath = path.join(outputOptions.dir, 'module.json');

                    try {
                        // Read the current module.json
                        const moduleJson = JSON.parse(await fs.promises.readFile(moduleJsonPath, 'utf8'));

                        // Set the 'protected' property to true for release builds
                        moduleJson.protected = true;

                        // Write the modified module.json back
                        await fs.promises.writeFile(
                            moduleJsonPath,
                            JSON.stringify(moduleJson, null, 2),
                            'utf8'
                        );
                    } catch (error) {
                        console.error('Error modifying module.json:', error);
                    }
                }
            }
        ],
        onwarn: (warning, warn) => {
            if (warning.code === 'UNKNOWN_OPTION') {
                if (warning.message.includes('Unknown CLI flags: release'))
                    return; // Ignore the release flag warning
            }

            // Log other warnings
            warn(warning);
        }
    }
}
