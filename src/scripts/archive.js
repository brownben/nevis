import ageClass from '@/scripts/ageClass'

const PouchDB = window.require('pouchdb')

export default {
  database: null,
  isConnected: false,

  serverName: 'localhost',
  port: 5984,

  connect: function (server = 'localhost') {
    this.serverName = server
    this.database = new PouchDB('http://' + this.serverName + ':' + this.port + '/archive')
    this.isConnected = true
    return this.database.info()
  },

  disconnect: function () {
    this.database.close().then(() => {
      this.database = null
      this.isConnected = false
    })
  },

  size: function () {
    return this.database.allDocs().then(data => data.rows.length)
  },

  deleteArchive: function () {
    return this.database.destroy()
  },

  deleteAll: function () {
    return this.database.allDocs({ include_docs: true })
      .then(docs => docs.rows.map(doc => ({ _id: doc.id, _rev: doc.doc._rev, _deleted: true })))
      .then(deleteDocs => this.database.bulkDocs(deleteDocs))
  },

  data: function () {
    return this.database.allDocs({ include_docs: true })
      .then(docs => docs.rows)
      .then(docs => docs.map(doc => doc.doc))
  },

  importFromCSV: async function (text) {
    await this.deleteAll()
    const rows = text.split('\n')
    let cards = []
    let counter = 0
    rows.forEach(row => {
      if (row !== '' && row !== '"CardNumber","CardLabel","CardStatus","Name","Sex","DateOfBirth","MembershipNo","Club"') {
        const rowSplit = row.split(',')
        let id = rowSplit[0]
        if (id === '') id = 'noSIID-' + counter
        cards.push({
          _id: rowSplit[0],
          siid: rowSplit[0],
          name: rowSplit[3].replace(/"/g, ''),
          ageClass: ageClass.fromYearAndGender(rowSplit[5], rowSplit[4]),
          membershipNumber: rowSplit[6],
          club: rowSplit[7].replace(/"/g, ''),
          hire: rowSplit[2] === 'Hire',
          lost: rowSplit[2] === 'Lost',
        })
        counter += 1
      }
    })
    this.database.bulkDocs(cards)
    return cards.length
  },
}
