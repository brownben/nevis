import eventFunctions from './eventOverview'
import competitorFunctions from './competitors'
import courseFunctions from './courses'
import resultsFunctions from './results'
import safetyCheckFunctions from './safetyCheck'

const PouchDB = window.require('pouchdb')

export default {
  database: null,
  isConnected: false,

  serverName: 'localhost',
  port: 5984,
  databaseName: '',

  connect: function (server = 'localhost', name = '') {
    this.serverName = server
    this.databaseName = name
    this.database = new PouchDB('http://' + this.serverName + ':' + this.port + '/' + this.databaseName)
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

  deleteDatabase: function () {
    return this.database.destroy()
  },

  deleteAll: function () {
    this.database.allDocs({ include_docs: true })
      .then(docs => docs.rows.map(doc => ({ _id: doc.id, _rev: doc.doc._rev, _deleted: true })))
      .then(deleteDocs => this.database.bulkDocs(deleteDocs))
  },

  fullDatabase: function () {
    return this.database.allDocs({ include_docs: true })
      .then(docs => docs.rows)
      .then(docs => docs.map(doc => doc.doc))
  },

  restore: function (server, id, data, override) {
    return this.connect(server, id)
      .then(async () => {
        const size = await this.size()
        if (size > 0 && !override) throw Error('Event Already Exists')
        else if (size > 0) this.deleteAll()
        return this.database.bulkDocs(JSON.parse(data))
      })
  },

  ...eventFunctions,
  ...competitorFunctions,
  ...courseFunctions,
  ...resultsFunctions,
  ...safetyCheckFunctions,
}
