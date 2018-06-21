
const Path = require('path'); 
const Fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

/**
 * Base on webpack 4
 * 
 * [指令]
 * 打包一次: webpack
 * 程式碼有變動就打包: webpack -w
 * 
 */
module.exports = [
    /* 前端 */
    {
		entry: { // 預設資料夾在 ./src
            /* outputName: inputName */
            bundle: ['./src/render/main.js'],
		},
		output: { // output.path 預設資料夾在 ./dist
            path: Path.join( __dirname, 'build' ), /* 要匯出的資料夾路徑 */
            publicPath: '/build',
            filename: '[name].js' /* name: entry 裡面的 key */
		},

		/**
		 * webpack 會為 target 提供編譯環境，預設為 web
		 * 其他還有 node、electron-main、electron-renderer 等等..
		 */
		target: 'electron-renderer', 
		
		/**
		 * [模式]
		 * 也可以透過指令的方式動態設定，實測體積差距約小 1/3 
		 * --mode=production  : 產品模式(壓縮bundle體積較小，自帶 UglifyJsPlugin 混淆程式碼)
		 * --mode=development : 開發模式(壓縮bundle體積較大，可以看出程式碼)
		 */
		mode: 'development', // development or production

		plugins: [
            /* CopyWebpackPlugin: 複製檔案的 plugin */
			new CopyWebpackPlugin([
                { from: Path.join( __dirname, 'src/render/html' ), to: 'html' }
            ])
		],

		module: {
            rules: [
                /* 利用 Babel 轉譯打包 React ES2017 語法，會去吃 .babelrc 的設定 */
                {
					test: /\.(js|jsx)?$/,
					exclude: /(node_modules|bower_components)/, // 轉換的例外排除名單
					loader: 'babel-loader'
				},
                {   
                    test: /\.(css)?$/, 
                    loader: 'css-loader'
                }
            ]
        },
        resolve: {
			
			/* 設定 extensions 後 import 或 require 路徑只需要給檔名而不用加副檔名 */
			extensions: [ '.js', '.jsx' ],

			/**
			 * alias 讓引用模組更簡單，有點像 electron 的 protocol
			 * 原本: import Lib from '../../core/lib';
			 * 現在: import Lib from 'Core/lib';
			 * 
			 * 也可以在 key 後面加上 $，表示精準配對，也就是 key 要完全符合
			 * 如果 xyz$: path.resolve(__dirname, 'path/to/file.js')
			 * 則 import Test1 from 'xyz/file.js' 會無法解析
			 * import Test2 from 'xyz' 才能解析
			 */
			alias: {
				Core: path.resolve(__dirname, 'src/core/'),
				Render: path.resolve(__dirname, 'src/render/')
			}

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

		// 用來告訴 webpack，node_modules 裡面的 library 不要包到 bundle 內，需要用時再去呼叫
		externals: [nodeExternals()],
		module: {
            rules: [
                {
					test: /\.(js)?$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader'
				},
                {
					test: /\.json?$/,
					loader: 'json-loader'
				},
            ]
        }
    },
   
]
