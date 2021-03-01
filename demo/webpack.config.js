var path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'main': './src/main.js',
    },
    output: {
        path: path.resolve('dist/js'),
        filename: '[name].js'
    }
}

