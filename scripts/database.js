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
            databaseEncryptionAdapter.setKey('OrienteerInTheWoods')
            db = new Loki(file[0], {
                adapter: databaseEncryptionAdapter,
                autoload: true,
                autoloadCallback: databaseInitialize,
            })
            navigatePage('Home')
        }
    })
}

module.exports.createDatabase = function () {
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
                databaseEncryptionAdapter.setKey('OrienteerInTheWoods')
                db = new Loki(file, {
                    adapter: databaseEncryptionAdapter,
                })
                db.loadDatabase(databaseInitializeCreate(data[0], data[1]))
                navigatePage('Home')
            }
        })
    })
}

