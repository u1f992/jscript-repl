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
            // tsconfig.jsonに従って、TypeScriptがトランスパイルされます。
            typescript(),

            // .babelrcに従って、ES3へトランスパイルされます。
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.ts'],
            }),

            // CommonJSモジュールをES Modulesに揃えます。
            commonjs()
        ]
    }
];
