<template>
  <main>
    <h1 class="mx-10 mb-1">
      <back-arrow to="/" />Events
    </h1>
    <div class="mx-12 mb-3">
      <router-link tag="button" class="button" to="/events/create">Create Event</router-link>
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
    }
  },

  methods: {
    getEvents: function () {
      return this.$database.query('SELECT * FROM events ORDER BY date DESC')
        .then(result => { this.events = result })
        .catch(() => this.$messages.addMessage('Problem Fetching Events', 'error'))
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

