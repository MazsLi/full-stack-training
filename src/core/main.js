
const { app, BrowserWindow, protocol } = require( 'electron' );
const Path = require( 'path' ); // NodeJS的Path類別，用來處理路徑字串
const debug = require( 'debug' );
let mainWindow;

app.on( 'ready', () => {
    
    registerProtocol( 'build', Path.join( process.cwd(), 'build' ) );
    registerProtocol( 'lib', Path.join( process.cwd(), 'src/render/lib' ) );
    registerProtocol( 'res', Path.join( process.cwd(), 'res' ) );

    // command: set debug=* & npm start
    debug('core:app')('ready');

    mainWindow = new BrowserWindow({
        title: app.getPath('exe')
    });
    
    // console.log( __filename );       // 執行檔案路徑
    // console.log( __dirname );        // 執行檔案所在資料夾路徑
    // console.log( process.cwd() );    // 下命令列的資料夾路徑
    // console.log( app.getAppPath() ); // Electron執行的資料夾路徑

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
registerProtocol = ( name, refDir ) => {

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