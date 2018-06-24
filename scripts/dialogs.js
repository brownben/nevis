'use strict'

module.exports.openConfirmDialog = function (title = 'Nevis', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel') {
    return new Promise((resolve, reject) => {
        let messageWindow = new BrowserWindow({
            width: 375,
            height: 115,
            resizable: false,
            frame: false,
            alwaysOnTop: true,
            icon: './assets/Nevis Logo.png',
            show: false,
            modal: true,
            parent: getCurrentWindow(),
        })
        messageWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../views/message.html'),
            protocol: 'file:',
            slashes: true,
        }))
        messageWindow.focus()
        ipcMain.on('message-ready', function (event, data) {
            messageWindow.show()
            event.sender.send('message-dialog-initial-data', [message, confirmText, cancelText, title])
            messageWindow.focus()
        })
        ipcMain.on('message-dialog-return', function (event, data) {
            resolve(data)
        })
        messageWindow.on('closed', () => {
            messageWindow = null
        })
    })
}

module.exports.createPDF = function (filePath, data) {
    return new Promise((resolve, reject) => {
        let pdfWindow = new BrowserWindow({ show: false })
        pdfWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../views/pdf.html'),
            protocol: 'file:',
            slashes: true,
        }))
        pdfWindow.focus()
        pdfWindow.on('closed', () => { pdfWindow = null })
        ipcMain.on('pdf-window-ready', (event) => event.sender.send('pdf-contents', data))
        ipcMain.on('pdf-window-loaded', function (event, data) {
            event.sender.webContents.printToPDF({
                'printBackground': true,
                'pageSize': 'A4',
            }, function (error, PDFdata) {
                if (error) reject(error)
                fs.writeFile(filePath, PDFdata, function (error) {
                    if (error) reject(error)
                    resolve(filePath)
                    pdfWindow.close()
                })
            })
        })
    })
}

module.exports.createEventDialog = function () {
    return new Promise((resolve, reject) => {
        let messageWindow = new BrowserWindow({
            width: 450,
            height: 215,
            resizable: false,
            frame: false,
            alwaysOnTop: true,
            icon: './assets/Nevis Logo.png',
            show: false,
            modal: true,
            parent: getCurrentWindow(),
        })
        messageWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../views/new-event.html'),
            protocol: 'file:',
            slashes: true,
        }))
        messageWindow.focus()
        messageWindow.on('ready-to-show', function () {
            messageWindow.show()
            messageWindow.focus()
        })
        ipcMain.on('select-new-event-location', function (event, data) {
            resolve(data)
        })
        messageWindow.on('closed', () => {
            messageWindow = null
        })
    })
}

module.exports.passwordDialog = function () {
    return new Promise((resolve, reject) => {
        let messageWindow = new BrowserWindow({
            width: 400,
            height: 130,
            resizable: false,
            frame: false,
            alwaysOnTop: true,
            icon: './assets/Nevis Logo.png',
            show: false,
            modal: true,
            parent: getCurrentWindow(),
        })
        messageWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../views/password.html'),
            protocol: 'file:',
            slashes: true,
        }))
        messageWindow.focus()
        messageWindow.on('ready-to-show', function () {
            messageWindow.show()
            messageWindow.focus()
        })
        ipcMain.on('open-event', function (event, data) {
            resolve(data)
        })
        messageWindow.on('closed', () => {
            messageWindow = null
        })
    })
}
