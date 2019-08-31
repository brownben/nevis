<template>
  <main>
    <h1 class="mx-10 mb-1">
      <back-arrow to="/" />Events
    </h1>
    <div class="mx-12 mb-3">
      <router-link tag="button" class="button" to="/events/create">Create Event</router-link>
      <button v-if="$archive.connected" class="button" @click="importArchive">Import Archive</button>
      <button class="button" @click="getEvents">Refresh</button>
    </div>
    <div v-if="events && events.length > 0" class="shadow mx-12 mb-3 p-2">
      <table class="w-full font-body">
        <tr class="font-heading text-center hover:bg-blue-light">
          <th>Event Name</th>
          <th>Event Date</th>
        </tr>
        <router-link
          v-for="event of events"
          :key="event.id"
          :to="'/events/' + event.id"
          class="text-center even:bg-blue-lightest hover:bg-blue-light"
          tag="tr"
        >
          <td>{{ event.name }}</td>
          <td>{{ event.date }}</td>
        </router-link>
      </table>
    </div>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'

export default {
  components: {
    'back-arrow': BackArrow,
  },

  data: function () {
    return {
      events: [],
    }
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    }
    else {
      this.createTables()
      this.getEvents()
      this.createArchiveConnection()
    }
  },

  methods: {
    getEvents: function () {
      return this.$database.query('SELECT * FROM events ORDER BY date DESC')
        .then(result => { this.events = result })
        .catch(() => this.$messages.addMessage('Problem Fetching Events', 'error'))
    },

    createArchiveConnection: function () {
      this.$archive.connection = this.$mysql.createConnection({
        host: this.$database.connection.config.host,
        port: this.$database.connection.config.port,
        user: this.$database.connection.config.user,
        password: this.$database.connection.config.password,
        database: 'archive',
      })
      return this.$archive.connect()
        .then(() => { this.$archive.connected = true })
        .then(() => {
          return this.$archive.query(`CREATE TABLE IF NOT EXISTS people(
          id INT AUTO_INCREMENT PRIMARY KEY,
          status TEXT,
          name TEXT,
          siid TEXT,
          membershipNumber TEXT,
          gender TEXT,
          club TEXT,
          yearOfBirth INT)`)
        })
        .catch(() => this.$messages.addMessage('Problem Connecting To The Archive', 'error'))
    },

    importArchive: async function () {
      const { dialog } = this.$electron.remote
      return dialog.showOpenDialog({
        title: 'Nevis - Import Archive',
        buttonLabel: 'Import',
        properties: ['openFile'],
        filters: [
          { name: 'Comma Separated Values', extensions: ['csv'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      })
        .then(result => {
          if (!result.canceled) return this.$fs.readFile(result.filePaths[0], { encoding: 'utf8' })
          else throw Error()
        })
        .then(result => result.trim().split('\n'))
        .then(result => {
          if (!result[0].includes('CardNumber')) throw Error()
          else return result
        })
        .then(result => result.map(row => row.split(',')))
        .then(result => result.filter(row => !row[0].includes('CardNumber')))
        .then(result => result.map(row => [row[0], row[2].replace(/"/g, ''), row[3].replace(/"/g, ''), row[4].replace(/"/g, ''), this.getYearOfBirth(row[5]), row[6], row[7].replace(/"/g, '')]))
        .then(result => Promise.all([this.$archive.query('DELETE FROM people'), result]))
        .then(result => this.$archive.query('INSERT INTO people (siid, status, name, gender, yearOfBirth, membershipNumber, club) VALUES ?', [result[1]]))
        .then(result => this.$messages.addMessage(`${result.affectedRows} Archive Records Imported`))
        .catch(() => this.$messages.addMessage('Problem Importing the Archive', 'error'))
    },

    getYearOfBirth: function (date) {
      if (date.length === 4) return parseInt(date)
      else if (date.split('/')[2] && date.split('/')[2].length === 4) return parseInt(date.split('/')[2])
      else return 0
    },

    createTables: function () {
      const createDatabaseQueries = [
        `CREATE TABLE IF NOT EXISTS events(
          id INT AUTO_INCREMENT PRIMARY KEY,
          name TEXT,
          date TEXT)`,
        `CREATE TABLE IF NOT EXISTS courses(
          id INT AUTO_INCREMENT PRIMARY KEY,
          name TEXT,
          length INT,
          climb INT,
          type TEXT,
          controls TEXT,
          event INT,
          FOREIGN KEY (event) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE)`,
        `CREATE TABLE IF NOT EXISTS competitors(
          id INT AUTO_INCREMENT PRIMARY KEY,
          name TEXT, siid TEXT,
          membershipNumber TEXT,
          ageClass TEXT,
          club TEXT,
          downloaded BOOLEAN,
          course INT,
          event INT,
          FOREIGN KEY (course) REFERENCES courses(id) ON UPDATE CASCADE ON DELETE SET NULL,
          FOREIGN KEY (event) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE)`,
        `CREATE TABLE IF NOT EXISTS punches(
          id INT AUTO_INCREMENT PRIMARY KEY,
          time INT,
          controlCode TEXT,
          competitor INT,
          event INT,
          FOREIGN KEY (competitor) REFERENCES competitors(id) ON UPDATE CASCADE ON DELETE CASCADE,
          FOREIGN KEY (event) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE)`,
      ]
      for (const query of createDatabaseQueries) {
        this.$database.query(query)
          .catch(() => this.$messages.addMessage('Problem Setting Up Database', 'error'))
      }
    },
  },
}
</script>
