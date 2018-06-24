'use strict'

// When database had loaded
function databaseInitialize () {
    competitorsDB = db.getCollection('competitors')
    if (competitorsDB === null) {
        competitorsDB = db.addCollection('competitors', {
            unique: ['siid'],
        })
    }

    coursesDB = db.getCollection('courses')
    if (coursesDB === null) {
        coursesDB = db.addCollection('courses', {
            unique: ['name'],
        })
    }

    eventInfo = db.getCollection('event-info')

    // Save data to Vue Instances
    entriesVue.data = competitorsDB
    coursesVue.courses = coursesDB
    resultsVue.courses = coursesDB.data
    resultsVue.competitors = competitorsDB
    homeVue.competitors = competitorsDB
    homeVue.courses = coursesDB
    homeVue.eventInfo = eventInfo.data[0]

    // Open SI Card Archive
    archive = new Loki(path.join(defaultPath, './archive.json'), {
        adapter: archiveEncryptionAdapter,
        autoload: true,
        autoloadCallback: archiveInitialize,
    })
}

function archiveInitialize () {
    cards = archive.getCollection('cards')
    if (cards === null) cards = archive.addCollection('cards')
}

function databaseInitializeCreate (name, date) {
    db.addCollection('event-info')
    db.getCollection('event-info').insert({
        name: name,
        date: date,
    })
    db.saveDatabase()
    databaseInitialize()
}

// Create new Database and select existing ones
module.exports.selectDatabase = function () {
    ipc.send('default-location-get')
    dialog.showOpenDialog({
        title: 'Nevis - Open Event',
        icon: './assets/assets/nevis.ico',
        defaultPath: defaultPath,
        filters: [
            { name: 'Nevis Event', extensions: ['evnt'] },
            { name: 'Event Database', extensions: ['db'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    }, (file) => {
        if (file) {
            dialogs.passwordDialog().then((password) => {
                databaseEncryptionAdapter.setKey(password)
                db = new Loki(file[0], {
                    adapter: databaseEncryptionAdapter,
                })
                db.loadDatabase({}, function (error) {
                    if (!error) {
                        databaseInitialize()
                        navigatePage('Home')
                    }
                    else {
                        document.getElementById('welcome-wrong-password').setAttribute('style', 'display:block')
                    }
                })
            })
        }
    })
}

module.exports.createDatabase = function () {
    ipc.send('default-location-get')
    dialogs.createEventDialog().then((data) => {
        dialog.showSaveDialog({
            title: 'Nevis - Create Event',
            icon: './assets/assets/nevis.ico',
            buttonLabel: 'Create',
            defaultPath: defaultPath,
            filters: [
                { name: 'Nevis Event', extensions: ['evnt'] },
                { name: 'Event Database', extensions: ['db'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        }, (file) => {
            if (file) {
                databaseEncryptionAdapter.setKey(data[2])
                db = new Loki(file, {
                    adapter: databaseEncryptionAdapter,
                })
                db.loadDatabase(databaseInitializeCreate(data[0], data[1]))
                navigatePage('Home')
            }
        })
    })
}

