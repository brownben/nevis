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

// Disable Eval()
// eslint-disable-next-line
window.eval = global.eval = function () {
    throw new Error(`Sorry, this app does not support window.eval().`)
}
