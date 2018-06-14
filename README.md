# FullStackTraining

這次的教學是利用網頁語言來打造一個跨平台的桌面應用程式，從前端到後端。

## 概論
這次用到的技術有以下這些: (以下用白話文來說明)

**Electron**：GitHub開發的開源框架，可以建立一個桌面應用程式，裡面裝了一個Chromium，可以用HTML、JS、CSS來繪製畫面，也可以利用Node.js來針對後端做操作。  

**React**：facebook 所開發的JavaScript 函式庫（Library），可以自定義Component、容易重複使用，在畫面更新時效率更高(Virtual DOM)。 

**Semantic-UI**：把它想像是跟Bootstrap差不多的東西就好，可以輕鬆做好美美的UI。  

**Babel**：用來幫你把瀏覽器不支援的新語法轉成瀏覽器看得懂的語法(像是JSX、ES6+，目前NodeJS v7.10以上已支援async)。  

**Webpack**：用來將所有程式碼、圖片、CSS，等等的資源打包成一個或數個檔案，也可以指定輸出的路徑。  

**Debug**： 顧名思義這個函式庫其實就是用來debug，在下Log時可以加一個Key，程式在跑時可以利用指令決定要不要顯示某些Key值的Log訊息。

## 大綱
* [安裝](#安裝)
* [Package.json 說明](#packagejson)
* [Webpack 說明](#webpack)
* [專案資料夾結構](#專案資料夾結構)
* [建立Electron應用程式 (main.js)](#electron)
* [使用Debug套件來偵錯](#debug)
* [前端進入點 (index.html)](#indexhtml)
* [開始撰寫React](#react)
* [利用SemanticUI來美化](#semanticui)

## 安裝
1. 首先你必須先安裝NodeJS，建議版本為v7.10以上，截至2018.06.06為止，我下載最新的NodeJS版本為v9.1.0  
2. 安裝 python、visual studio 2015(node-gyp不兼容2017)
2. 然後準備好你寫程式的IDE，像是Sublime Text或是Visual Studio Code，我本身是用Visual Studio Code (外掛模組多又整合Git、CMD)
3. 將此專案Download下來，首先先解釋除了資料夾內的幾個檔案  
  . package.json - 用來記錄此專案會用到的函式庫(Library)  
  . package.txt - 本人用來解說package.json裡面每個module是在做什麼用的文件  
  . README.md - 就是現在你看的這份文件  
  . webpack.config.js - 這份是讓webpack用來知道要把什麼檔案包什麼檔案，還有一些針對Babel等等的設定  
4. 在專案目錄內透過CMD執行指令 ``` npm install ``` ，這行指令是讓npm去安裝套件用的指令，但是如果後面沒有給參數的話，就會去安裝package.json內有列的所有套件

[眉眉角角]  
如果你有安裝原生模組的需求，在安裝完之後需要 rebuild electron，因為我們安裝模組都是基於本機端的 node，需要針對 electron 去 rebuild。
```javascript
npm rebuild --runtime=electron --target=2.0.2 --disturl=https://atom.io/download/atom-shell --abi=59 --msvs_version=2015
```
target 是 electron 的版本，abi 可以到[這裡](https://github.com/mapbox/node-pre-gyp/blob/master/lib/util/abi_crosswalk.json)去找與你目前安裝的nodejs相對應的版本號

還有要注意的是 node.js、electron、ffi dll 這些位元版本都要一致，更多 node.js 的雷，請[參考](https://medium.com/something-about-javascript/node-js-aac6845ec595)

## Package.json
package.json內會列出所需要安裝的套件，除此之後比較重要的就是scripts
```javascript
"scripts": {
  "start": "./node_modules/.bin/electron ./build/main.js",
  "build": "./node_modules/.bin/webpack -w"
},
```
寫在scripts內的指令可以當作是腳本，舉例來說只要在跟package.json同目錄下使用
```javascript
npm run start 
```
那他就會自動幫我們跑以下指令，這段指令的意思就是利用Electron把 ./build/main.js 跑起來
```javascript
./node_modules/.bin/electron ./build/main.js
```

下面這段每次寫程式都可以先把他run起來，webpack會幫你打包程式碼，後面加一個 -w webpack就會偵測當你的程式碼有變動的時候，就去幫你打包
```javascript
./node_modules/.bin/webpack -w
```

## Webpack
我們在[webpack.config.js](webpack.config.js)內有做了一些設定，主要的預期結果是：
1. 透過webpack把我們放在src資料夾內的程式碼打包到build資料夾
2. 打包的過程中會透過Babel將程式碼(React、ES6+)打包成瀏覽器看得懂的JS
3. 再透過copy-webpack-plugin這個plugin將需要的資源複製到build資料夾內

首先我們會在entry內去指定要輸出的key(匯出檔案名稱)以及value(要打包的檔案路徑)，value可以是一個字串也可以是陣列(多對一)
```javascript
entry: {
    // 輸出的檔案名稱: 輸入的檔案路徑
    'main': ['./src/core/main.js'],
    'bundle': ['./src/render/main.js']
},
```
在這邊要提醒一下(被搞過)，通常前後端的js應該要分開編譯，因為前端會用到的target是web，後端的通常會用node，而且後端的js會用externals來避免把node_modules的lib包進去，因為很多都是動態呼叫，但是在前端的包法內不能用externals，否則會出現類似require is not a function的錯誤訊息。

然後再去指定輸出檔案的路徑(webpack將你指定在entry內的程式碼打包後要輸出的位置)
```javascript
output: {
    path: Path.join( __dirname, 'build' ), // 要匯出的資料夾路徑
    publicPath: '/build',
    filename: '[name].js' // name會自動換成entry裡面的key
},
```

要注意的是webpack預設編譯的環境是針對web，如果是利用Electron來做開發的要記得加上
```javascript
target: 'electron-renderer' // Compile for Electron for renderer process
target: 'electron-main'     // Compile for Electron for main process.
```
webpack會為Electron提供編譯環境

其他相關設定在webpack.config.js內都有詳細說明。

## 專案資料夾結構  
- build - 用來放webpack打包後的程式碼
- res - 資源檔資料夾
- src - 原始程式碼
  - core - 後端程式碼
  - render - 前端程式碼

## Electron
好～這裡就要開始寫程式了，這邊會帶大家一步步完成，一步步解說。  
electron你可以把他想像成是一個瀏覽器(核心是Chromium)，除了要寫前端的UI以及JS來控制以外，我們還需要寫JS來控制electron，所以首先我們先寫一隻JS來建立electron視窗。
大家可以先看 [./src/core/main.js](./src/core/main.js) ，在這裡因為我們有透過Babel將我們的程式碼作轉碼的動作，所以可以使用es6的語法，es6用法可以參考:
 [一看就懂的 React ES5、ES6+ 常見用法對照表](http://blog.kdchang.cc/2016/04/04/react-react-native-es5-es6-cheat-sheet/)

[app](https://electronjs.org/docs/api/app)這個類別是用來處理及監控Electron的生命週期(lifecycle)，所以在一開始我們需要透過app去監聽Electron完成初始化動作的ready事件
```javascript
app.on( 'ready', () => {

})
```

但是當app ready後他並不會幫你產生一個視窗，你必須透過[BrowserWindow](https://electronjs.org/docs/api/browser-window)去產生視窗，這裡我們只設定他的title，但其實還有很多參數可以設定，像是寬高、要不要顯示、座標、Icon等等的設定。
```javascript
let mainWindow = new BrowserWindow({
    title: 'FullStackTraining'
});
```
建立完視窗後，再來就是把我們寫好的前端網頁載入進來，
```javascript
// 讀取主要的html
mainWindow.loadURL( 'Build://html/index.html' );
```
大家應該很疑惑Build是什麼東西，在這裡要介紹一下Electron的另一個類別protocol，他主要在做的事是讓你可以客製化自己的protocol，好處是可以方便使用，方便管理，還有安全性的問題(別人不會一眼就知道你的檔案存放位置)，所以我們在[./src/core/main.js](./src/core/main.js)可以找到一個我們自定義的函式registerProtocol，來去自定義protocol。
```html
// 第一個參數是protocol的名稱，第二個參數是要指到的真實位置
registerProtocol( 'build', 'D://TEST/' );

// 用法 (index.html內)
<script src="build://bundle.js"></script>
// 等於
<script src="D://TEST/bundle.js"></script>
```

在Node.js與Electron中有些全域的變數可以拿來使用，在這邊作一些介紹
```javascript
// Node.js 全域變數
// console.log( __filename );       // 執行檔案路徑
// console.log( __dirname );        // 執行檔案所在資料夾路徑
// console.log( process.cwd() );    // 下命令列的資料夾路徑

// 執行Electron的路徑
// console.log( app.getAppPath() ); 
// 取得使用者某些資料夾路徑
// console.log( app.getPath('home') );
// console.log( app.getPath('temp') );
// console.log( app.getPath('exe') );
// console.log( app.getPath('desktop') );
// console.log( app.getPath('documents') );
// console.log( app.getPath('downloads') );
```

## Debug
再來介紹裡面用到的[debug](https://github.com/visionmedia/debug)這個套件的用法，平常我們可能除錯的時候都會下一大堆console.log或是alert (我以前也是)。debug這個套件的差異在於它可以根據你所下的指令跟情境不同而去決定要顯示哪些log。
舉例來說下面這行log:
```javascript
debug('core:app')('ready');
```
我想要讓他印出來的話怎麼做呢，我們上面[package.json](#package.json)有教過script的用法，我們只需要在前面加上debug的語法就可以了
```javascript
// log全部顯示
set debug=* & npm start

// 只顯示core:app的log
set debug=core:app & npm start
```

有一個很重要的一點是，如果你是在windows環境下的話前面要加上set，不然會找不到這個指令，這在官網上可以找到。

## index.html
剛剛我們在main.js用electron的app讀取了這個html，並在裡面載入我們先下載好的jQuery、semanticUI，這裡我們也是應用剛剛所提到的protocol，來去載入script。
在index.html內我們最主要要做的是載入webpack幫我們打包好的前端JS(bundle,js)。
```html
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

		<!-- 加上onload事件，在載入時設定jQuery -->
		<script src="lib://jquery/jquery.min.js" onload="window.$ = window.jQuery = module.exports;"></script>
		
		<!-- 透過Protocol去存取放在lib內的semantic-ui -->
		<link rel="stylesheet" type="text/css" href="lib://semantic-ui/semantic.min.css">
		<script src="lib://semantic-ui/semantic.min.js"></script>

		<title>Electron + React + SemanticUI + Webpack</title>
	</head>
	<body>
		<div id="main"></div>
		<script src="build://bundle.js"></script>
	</body>
</html>
```

## React
React component可以先把他想像成是OO的概念，你先寫好一個component之後，可以一直去new出新的物件，你只需要給他不同的初始值，而他自己會去決定什麼時候要更新。
如果大家對React不熟悉的可以先看看一些不錯的教學網站:  
[React Component Lifecycle & State vs Props](https://noootown.gitbooks.io/deeperience-react-native-boilerplate/content/Basic/Reactjs%20Lifecycle%20&%20State%20vs%20Props.html)

再來我們看\src\render\這個用來放前端程式碼的資料夾，裡面有一個main.js。  
裡面做的事情就是去我們assets資料夾內將使用者的json讀出來，再把資料塞給我們做好的React element 把它render出來。  
而我們的component資料夾內我目前寫了一個PersonalCard的component，然後我會在main.js裡面去依照外部json的值而決定我要new出幾個PersonalCard物件，然後把它顯示在畫面上。

## SemanticUI

[SemanticUI](https://semantic-ui.com/introduction/getting-started.html)
在這裡我們利用SemanticUI來美化我們的PersonalCard，在官網上可以看到使用範例。
