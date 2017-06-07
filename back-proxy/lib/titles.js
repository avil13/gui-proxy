var gr = require('cli-color').green;

const help = [
    ['-h', '--help', 'Helps'],
    ['-h', '--version', 'Version'],
    ['-r', '--repo', 'Link to your repository'],
    ['-b', '--branch', 'Branch of your repository']
].map(v => {
    let desc = v.pop();
    return v.map(item => gr(item)).join(' ') + '\t'+ desc;
}).join("\n");


module.exports = {
    help
};