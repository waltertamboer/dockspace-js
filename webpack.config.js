const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    target: ['web', 'es5'],
    plugins: [],
    module: {
        rules: [
            {
                test: /.\/src\/.+\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {}
                    }
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dockspace.js',
        globalObject: 'this',
        library: {
            name: 'Dockspace',
            type: 'var',
        },
    },
};
