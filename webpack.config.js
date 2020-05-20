const path = require('path');

module.exports = {
    entry: path.resolve('src/index.js'),
    output: {
        // 기존 자신의 public 폴더
        //path:path.resolve('public'),

        // 상위폴더 main 아래의 /webapp/assets/js 를 경로로지정
        path:path.resolve('../webapp/assets/js'),

        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use:{
                loader: 'babel-loader'
            }
        }, {
            test: /\.css$/,
            loader: [{
                loader: 'style-loader'
                }, {
                loader: 'css-loader',
                options: {
                    modules: true
                }
            }]
        }, {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
              // Compiles Sass to CSS
              'sass-loader',
            ],
          }
    ]}
} 