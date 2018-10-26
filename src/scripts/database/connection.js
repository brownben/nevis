import eventFunctions from './eventOverview'
import competitorFunctions from './competitors'
import courseFunctions from './courses'

const PouchDB = window.require('pouchdb')

export default {
  database: null,
  isConnected: false,

  serverName: 'localhost',
  port: 5984,
  databaseName: '',

  connect: function () {
    this.database = new PouchDB('http://' + this.serverName + ':' + this.port + '/' + this.databaseName)
    this.isConnected = true
    return this.database.info()
  },

  disconnect: function () {
    this.database = null
    this.isConnected = false
  },

  setDatabase: function (server = 'localhost', name = '') {
    this.serverName = server
    this.databaseName = name
  },
  ...eventFunctions,
  ...competitorFunctions,
  ...courseFunctions,
}
