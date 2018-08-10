'use strict'

// The Vue instance for live view of entries
const safetyCheckVue = new Vue({
    el: '#safety-check-outstanding',
    data: {
        data: '',
    },
    computed: {
        outstanding: function () {
            if (this.data !== '' && this.data !== null) {
                return this.data.chain()
                    .find({
                        '$and': [
                            { 'safetyCheck': { '$ne': null } },
                            { 'download': { '$eq': null } },
                        ],
                    })
                    .data()
                    .filter(data => data.safetyCheck)
            }
            else {
                return {}
            }
        },
    },
})

// Import from CSV from SI Config+
function importSafetyCheck () {
    dialog.showOpenDialog({
        title: 'Nevis - Import Safety Check from SI COnfig+  ',
        icon: './assets/assets/nevis.ico',
        filters: [
            { name: 'Comma Separated Values', extensions: ['csv'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    }, (file) => {
        if (file) {
            fs.exists(file[0], function (exists) {
                const data = fs.readFileSync(file[0], 'utf8')
                const punches = data.split('\n')
                for (let punch of punches) {
                    if (punch.split(';')[0] !== '#' && punch.split(';').length === 4) {
                        let linkedCompetitor = competitorsDB.findOne({ 'siid': punch.split(';')[1] })
                        if (linkedCompetitor && linkedCompetitor.safetyCheck) {
                            if (linkedCompetitor.safetyCheck.lastSeenTime < punch.split(';')[2]) {
                                linkedCompetitor.safetyCheck = {
                                    'lastSeenTime': punch.split(';')[2],
                                    'lastSeenAt': file[0].replace(/^.*[\\/]/, '').split('.')[0],
                                }
                            }
                        }
                        else if (linkedCompetitor) {
                            linkedCompetitor.safetyCheck = {
                                'lastSeenTime': punch.split(';')[2],
                                'lastSeenAt': file[0].replace(/^.*[\\/]/, '').split('.')[0],
                            }
                        }
                        else {
                            competitorsDB.insert({
                                'name': 'Unknown',
                                'siid': punch.split(';')[1],
                                'download': null,
                                'safetyCheck': {
                                    'lastSeenTime': punch.split(';')[2],
                                    'lastSeenAt': file[0].replace(/^.*[\\/]/, '').split('.')[0],
                                },
                            })
                        }
                    }
                }
                db.saveDatabase()
            })
        }
    })
}
