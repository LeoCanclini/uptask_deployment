const path = require('path');
const webpack = require('webpack');

module.exports = {
    //punto de entrada y de salida
    entry: './public/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './public/dist') //dirname es el directorio actual
    },
    module: {
        rules: [{
            test: /\.m?js$/, //buscara todos los archivos que sean js
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}