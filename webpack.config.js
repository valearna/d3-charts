var path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'heatmap': './src/d3-heatmap.js',
        'ridgeline': './src/d3-ridgeline.js'
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    }
}

