const nodeResolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
const commonjs = require("rollup-plugin-commonjs");

let outputDeclaration = true;
if (process.env.TYPESCRIPT_DECLARATION !== undefined) {
    outputDeclaration = process.env.TYPESCRIPT_DECLARATION === "true";
}

module.exports = {
    plugins: [
        commonjs({
            namedExports: { chai: ["expect"] }
        }),
        nodeResolve(),
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    declaration: outputDeclaration
                }
            }
        })
    ]
};
