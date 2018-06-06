
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Path = require('path'); 
const Fs = require('fs');
const webpack = require('webpack');

module.exports = [
    /* 前端 */
    {
		entry: {
            /* outputName: inputName */
            bundle: ['./src/render/main.js'],
		},
		output: {
            path: Path.join( __dirname, 'build' ), /* 要匯出的資料夾路徑 */
            publicPath: '/build',
            filename: '[name].js' /* name: entry 裡面的 key */
        },
		target: 'electron-renderer', /* webpack 會為 target 提供編譯環境，預設為 web */
		plugins: [
            /* CopyWebpackPlugin: 複製檔案的 plugin */
			new CopyWebpackPlugin([
                { from: Path.join( __dirname, 'src/render/html' ), to: 'html' }
            ])
		],
		module: {
            rules: [
                /* 利用 Babel 轉譯打包 React ES2017 語法 */
                {
					test: /\.(js|jsx)?$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [ 'env', 'react', 'stage-0' ]
						}
					}
				},
                {   
                    test: /\.(less|css)?$/, 
                    loader: 'style!css!less'
                }
            ]
        },
        resolve: {
            /* 設定 extensions 後 import 或 require 路徑只需要給檔名而不用加副檔名 */
            extensions: [ '.js', '.jsx' ] 
        },
    },
    
    /* 後端 */
    {
		entry: {
            'main': './src/core/main.js'
		},
		output: {
            path: Path.join( __dirname, 'build' ),
            publicPath: '/build',
			filename: '[name].js'
		},
		target: 'electron-main',
		externals: Fs.readdirSync('node_modules').map( (module) => {
			var obj = {};
			obj[module] = 'commonjs ' + module;
			return obj;
		}),
		// plugins: [
		// 	new webpack.ExternalsPlugin('commonjs', [
	    //         'desktop-capturer',
	    //         'electron',
	    //         'ipc',
	    //         'ipc-renderer',
	    //         'native-image',
	    //         'remote',
	    //         'web-frame',
	    //         'clipboard',
	    //         'crash-reporter',
	    //         'screen',
	    //         'shell'
	    //     ])
		// ],
		module: {
            rules: [
                {
					test: /\.(js)?$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [ 'env', 'stage-0' ]
						}
					}
				},
                {
					test: /\.json?$/,
					loader: 'json-loader'
				},
            ]
        }
    },
   
]
