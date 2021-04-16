var path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'heatmap': './src/heatmap.js',
        'ridgeline': './src/ridgeline.js',
        'dotplot': ['./src/dotplot.js'],
        'index': './src/index.js',
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    }
}

