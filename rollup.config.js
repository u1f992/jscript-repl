import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

export default [
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.js",
            format: 'es'
        },
        plugins: [
            typescript(),
            // babelの前にcommonjsらしい
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.ts'],
                exclude: [/\/core-js\//]
            }),
            
        ]
    }
];
