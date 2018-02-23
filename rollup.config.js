const nodeResolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
const commonjs = require("rollup-plugin-commonjs");

module.exports = {
    plugins: [
        commonjs({
            namedExports: { chai: ["expect"] }
        }),
        nodeResolve(),
        typescript({
            tsconfigOverride: {
                declaration: false
            }
        })
    ]
};
