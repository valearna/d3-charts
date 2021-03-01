var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/d3-heatmap.js',
    output: {
        path: path.resolve('dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    }
}

