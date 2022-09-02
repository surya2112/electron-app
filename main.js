const {app ,BrowserWindow, ipcMain} = require("electron")
const windowStateKeeper = require('electron-window-state')
const readItem = require('./readItem')
const appMenu = require('./menu')

let mainWindow

ipcMain.on('new-item', (e, itemUrl) => {
    //console.log(itemUrl)
    readItem(itemUrl, item => {
        e.sender.send('new-item-success',item)
    })
})


function createWindow(){

    //state keeper
    let state = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 650
    })

    mainWindow = new BrowserWindow({
        x: state.x,y: state.y,
        width: state.width,height: state.height,
        minwidth: 350, maxWidth: 650, minHeight: 300,
        //width: 1000,height: 1000,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    })

    appMenu(mainWindow.webContents)

    mainWindow.loadFile('renderer/main.html');

    //manage new window state
    state.manage(mainWindow)

    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}
app.on('ready',createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
    app.quit()
})

app.on('activate',() => {
    if(mainWindow === null)
    createWindow();
})
