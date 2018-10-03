// const path = require('path');

// module.exports = {
//     entry: path.resolve(__dirname, './index.js'),
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, 'dist')
//     }
// }

const path = require('path');
const child_process = require('child_process');

const currentDir = path.resolve(__dirname);
const webpackCli = path.resolve(currentDir, '..', '..', '..', 'node_modules', 'webpack', 'bin', 'webpack.js');

const extraArgs = "";

const targetArgs = ` ${currentDir}/index.js -o ${currentDir}/dist/output.js `;
const displayReasons = " --display-reasons --display-used-exports --display-provided-exports";
const commonArgs = `--display-chunks --display-max-modules 99999 --display-origins --display-entrypoints --output-public-path "${currentDir}/dist/" ${extraArgs} ${targetArgs}`;

const compile = (args) => {
    child_process.exec(`node ${webpackCli} ${args} ${displayReasons} ${commonArgs}`, (error, stdout, stderror) => {
        if(stderror) {
            console.error(error);
        }
        if(error !== null) {
            console.error(error);
        }
        console.log(stdout)
    })
}

compile('--mode development --devtool none');
compile('--mode production');