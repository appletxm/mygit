'use strict';

var path = require('path');

module.exports = {
    //devtool: 'source-map',
    entry: {
        app: './src/app.js',
        'scripts/modules/history': './src/scripts/modules/history.js',
        'scripts/modules/achievement': './src/scripts/modules/achievement.js',
        'scripts/modules/team': './src/scripts/modules/team.js',
        'scripts/modules/contact': './src/scripts/modules/contact.js'
    },
    output: {
        //path: './dev/',
        path: path.resolve(__dirname, 'dev/'),
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
