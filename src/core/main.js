
import { app, BrowserWindow, protocol } from 'electron' ;
import Path from 'path'; // Node.js的Path類別，用來處理檔案和資料夾路徑
import debug from 'debug'; // 除錯工具

// 監聽當Electron完成初始化的動作
app.on( 'ready', () => {
    
    registerProtocol( 'build', Path.join( process.cwd(), 'build' ) );
    registerProtocol( 'lib', Path.join( process.cwd(), 'src/render/lib' ) );
    registerProtocol( 'assets', Path.join( process.cwd(), 'assets' ) );

    // command: set debug=* & npm start
    debug('core:app')('ready');

    let mainWindow = new BrowserWindow({
        title: 'FullStackTraining'
    });
    
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
    
    // 讀取主要的html
    mainWindow.loadURL( 'Build://html/index.html' );

    // 開啟debug tool
    mainWindow.webContents.openDevTools({
        mode: 'right', // right, bottom, undocked, detach
    });

});

// Register protocol (need after app ready)
var registerProtocol = ( name, refDir ) => {

    // Protocol 名稱開頭不可為大寫
    name = name.toLowerCase();

    protocol.registerFileProtocol( name, (request, callback) => {

        const url = Path.normalize( request.url ).substr( name.length + 1 );
        
        debug('core:protocol')( 'before: ' + url );
        debug('core:protocol')( 'after: ' + Path.join( refDir, url ) );
        
        callback({ 
            path: Path.join( refDir, url ) 
        });

    }, (error) => {
        if (error) console.error( 'Failed to register protocol: ' + name );
        else debug('core:protocol')( 'Success to register protocol: ' + name );
    });
    
}