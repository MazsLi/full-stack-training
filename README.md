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
* [Package.json 說明](#package.json)
* [Webpack 說明](#webpack)
* [專案資料夾結構](#專案資料夾結構)
* [開始建立Electron應用程式](#electron)

## 安裝
1. 首先你必須先安裝NodeJS，建議版本為v7.10以上，截至2017.12.05為止，我下載最新的NodeJS版本為v9.1.0  
2. 然後準備好你寫程式的IDE，像是Sublime Text或是Visual Studio Code，我本身是用Visual Studio Code (外掛模組多又整合Git、CMD)
3. 將此專案Download下來，首先先解釋除了資料夾內的幾個檔案  
  . package.json - 用來記錄此專案會用到的函式庫(Library)  
  . package.txt - 本人用來解說package.json裡面每個module是在做什麼用的文件  
  . README.md - 就是現在你看的這份文件  
  . webpack.config.js - 這份是讓webpack用來知道要把什麼檔案包什麼檔案，還有一些針對Babel等等的設定  
4. 在專案目錄內透過CMD執行指令 ``` npm install ``` ，這行指令是讓npm去安裝套件用的指令，但是如果後面沒有給參數的話，就會去安裝package.json內有列的所有套件

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
target: 'electron'
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
好～這裡就要開始寫程式了，electron你可以把他想像成是一個瀏覽器(核心是Chromium)，除了要寫前端的UI以及JS來控制以外，我們還需要寫JS來控制electron，所以首先我們先寫一隻JS來建立electron視窗。
大家可以先看 [./src/core/main.js](./src/core/main.js) 這隻JS
