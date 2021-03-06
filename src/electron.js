const path = require("path");
const electron = require('electron')
const {app, BrowserWindow, Menu, Tray } = electron
const isDev = require("electron-is-dev");

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
    const devTools = require("electron-devtools-installer");
    installExtension = devTools.default;
    REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
    app.quit();
}
let tray = null
function createWindow() {
    // Create the browser window.

    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth:1000,
        maxWidth:1000,
        minHeight:700,
        maxHeight:700,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false
        }
    });

    // and load the index.html of the app.
    win.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({mode: "detach"});
    }

    tray = new Tray('./src/favicon.ico')
    tray.setToolTip('REDMINE Desktop Application.')
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click:  function(){
                win.show();
            } },
        { label: 'Quit', click:  function(){
                app.isQuiting = true;
                app.quit();
            } }
    ]);
    tray.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then(name => console.log(`Added Extension:  ${name}`))
            .catch(error => console.log(`An error occurred: , ${error}`));
    }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
