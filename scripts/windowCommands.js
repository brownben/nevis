'use strict'

// Set Original Icon
document.getElementById('titlebar-icon-min').setAttribute('style', 'display:inline')
document.getElementById('titlebar-icon-max').setAttribute('style', 'display:none')

// Close Window Listener
document.getElementById('titlebar-close').addEventListener('click', function () {
    window.close()
})

// Maximise Listener
document.getElementById('titlebar-maximize').addEventListener('click', function () {
    ipc.send('window', 'maximize')
})

// Minimize Listener
document.getElementById('titlebar-minimize').addEventListener('click', function () {
    ipc.send('window', 'minimize')
})

// Change Icon once window has been updated
ipc.on('window', function (event, arg) {
    if (arg === 'minimized') {
        document.getElementById('titlebar-icon-min').setAttribute('style', 'display:inline')
        document.getElementById('titlebar-icon-max').setAttribute('style', 'display:none')
    }
    else if (arg === 'maximized') {
        document.getElementById('titlebar-icon-min').setAttribute('style', 'display:none')
        document.getElementById('titlebar-icon-max').setAttribute('style', 'display:inline')
    }
})

// Zoom In + Out
ipc.send('zoom-get')

ipc.on('zoom', function (event, arg) {
    webFrame.setZoomFactor(arg)
})

function zoomChange (amount) {
    webFrame.setZoomFactor(webFrame.getZoomFactor() + amount)
    ipc.send('zoom-change', webFrame.getZoomFactor())
}

// Set Default Folder Location
function changeDefaultLocation () {
    dialog.showOpenDialog({
        title: 'Nevis - Set Default Location',
        properties: ['openDirectory'],
    }, function (paths) {
        if (paths) {
            document.getElementById('about-settings-default-location').innerText = 'Default Location:  ' + paths[0]
            ipc.send('default-location-change', paths[0])
            defaultPath = paths[0]
        }
    })
}
ipc.on('default-location', function (event, args) {
    document.getElementById('about-settings-default-location').innerText = 'Default Location:  ' + args
    defaultPath = args
})

// Disable Eval()
// eslint-disable-next-line
window.eval = global.eval = function () {
    throw new Error(`Sorry, this app does not support window.eval().`)
}
