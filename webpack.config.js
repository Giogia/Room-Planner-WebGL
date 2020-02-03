let path = require('path');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src/app.js'),
        list: path.resolve(__dirname, 'src/list.js'),
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: './build/',
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]',
    },
    mode: 'development',
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
};
