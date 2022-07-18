import { download } from 'electron-dl'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import installExtension, {
    REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer'

let win: BrowserWindow | null = null

function createWindow() {
    
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
        //titleBarStyle: 'hidden'
    })

    if (isDev) {
        win.loadURL('http://localhost:3000/index.html')
    } else {
        // 'build/index.html'
        win.loadURL(`file://${__dirname}/../index.html`)
    }

    win.on('closed', () => (win = null))

    // Hot Reloading
    if (isDev) {
        // 'node_modules/.bin/electronPath'
        require('electron-reload')(__dirname, {
            electron: path.join(
                __dirname,
                '..',
                '..',
                'node_modules',
                '.bin',
                'electron'
            ),
            forceHardReset: true,
            hardResetMethod: 'exit',
        })
    }

    // DevTools
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))

    if (isDev) {
        // win.webContents.openDevTools()
    }
    if (!isDev) {
        autoUpdater.checkForUpdates();
    }
    win.setResizable(false);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('minimize', () => {
    if (win !== null) {
        win.minimize()
    }
})

ipcMain.on('close', () => {
    app.quit()
})


ipcMain.on("download", (event, info) => {
    if (win !== null) {
        info.properties.onProgress = (status: any) => {
            console.log(`[[[ ====> ]]] progress: ${Math.floor(status.percent * 100)}%`)
        };
        download(win, info.url, info.properties)
        .then(dl => {
            console.log("path: ",dl.getSavePath());
            console.log("[[[ ====> ]]] Bitmon game download complete!")
        });
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

// auto updater event listeners
autoUpdater.on("update-available", (event) => {
    const dialogOptions: any = {
        type: "info",
        buttons: ['Ok'],
        title: 'Launcher update!',
        message: process.platform === "win32" ? event.releaseNotes : event.releaseName,
        detail: 'A new version is being downloaded.'
    }
    dialog.showMessageBox(dialogOptions)
})

autoUpdater.on("update-downloaded", (event) => {
    const dialogOptions: any = {
        type: "info",
        buttons: ['Restart', 'Later'],
        title: 'Launcher update!',
        message: process.platform === "win32" ? event.releaseNotes : event.releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }
    dialog.showMessageBox(dialogOptions).then((_returnValue) => {
        if (_returnValue.response === 0) {
            autoUpdater.quitAndInstall()
        }
    })
})    

