const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

let win

function createWindow () {
  let options = {
    width: 775,
    height: 650,
    minWidth: 300,
    minHeight: 90,
    frame: false,
    icon: './public/Nevis Logo.png',
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  }
  let pathname = ''
  if (process.env.NODE_ENV !== 'production') pathname = 'http://localhost:8080/'
  else pathname = 'file://' + path.join(__dirname, '/dist/index.html')
  win = new BrowserWindow(options)
  win.loadURL(pathname)
  win.on('ready-to-show', () => {
    win.show()
    win.webContents.send('resize', win.getSize())
    win.focus()
  })
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

// Context Menu
const contextMenu = [{
  label: 'Copy',
  accelerator: 'CmdOrCtrl+C',
  role: 'copy',
},
{
  label: 'Cut',
  accelerator: 'CmdOrCtrl+X',
  role: 'cut',
},
{
  label: 'Paste',
  accelerator: 'CmdOrCtrl+V',
  role: 'paste',
}]

const ContextMenu = Menu.buildFromTemplate(contextMenu)
app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    ContextMenu.popup(win, params.x, params.y)
  })
})

// Menu Titlebar Icon
let maximized = false
ipcMain.on('window', function (event, arg) {
  if (arg === 'maximize') {
    if (maximized === false) win.maximize()
    else win.unmaximize()
    maximized = !maximized
    event.sender.send('window', maximized)
  }
  else if (arg === 'minimize') {
    win.minimize()
  }
})
