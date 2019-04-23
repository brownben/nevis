<template>
  <main>
    <back-arrow />
    <h1 class="title">Safety Check</h1>
    <div>
      <button class="button" @click="importSafetyCheck()">Import Punch Data</button>
      <button class="button" @click="getOutstandingCompetitors()">Refresh</button>
    </div>
    <div v-if="outstandingCompetitors && outstandingCompetitors.length > 0" class="card">
      <h2>Outstanding Competitors</h2>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Time</th>
            <th>SI Card</th>
            <th>Name</th>
            <th>Age Class</th>
            <th>Course</th>
          </tr>
        </thead>
        <tr v-for="competitor of outstandingCompetitors" :key="competitor.siid">
          <td>{{ competitor.safetyCheck.location }}</td>
          <td>{{ displayTime(competitor.safetyCheck.time) }}</td>
          <td>{{ competitor.siid }}</td>
          <td>{{ competitor.name }}</td>
          <td>{{ competitor.ageClass }}</td>
          <td>{{ competitor.course }}</td>
        </tr>
      </table>
    </div>
  </main>
</template>

<script>

import BackArrow from '@/components/BackArrow'
import time from '@/scripts/time'

export default {
  components: {

    'back-arrow': BackArrow,
  },

  data: () => ({
    outstandingCompetitors: [],
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
    this.getOutstandingCompetitors()
  },

  methods: {
    displayTime: timeValue => time.actual(timeValue),

    importSafetyCheck: function () {
      const { app, dialog } = this.$electron.remote
      dialog.showOpenDialog(
        {
          title: 'Nevis - Import Punch Data',
          buttonLabel: 'Import',
          defaultPath: app.getPath('documents'),
          properties: ['openFile'],
          filters: [
            { name: 'CSV', extensions: ['csv'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        },
        filePath => {
          if (filePath && filePath[0]) {
            this.$node.fs.promises.readFile(filePath[0], { encoding: 'UTF8', flag: 'r' })
              .catch(() => this.$messages.addMessage('Problem Reading File', 'error'))
              .then(data => this.$database.importSafetyCheckData(filePath[0], data))
              .then(result => {
                this.getOutstandingCompetitors()
                this.$messages.addMessage(result.length + ' Punches Imported as Safety Check Data')
              })
              .catch(error => this.$messages.addMessage(error.message, 'error'))
          }
        }
      )
    },

    getOutstandingCompetitors: function () {
      this.$database.getOutstandingCompetitors()
        .then(result => { this.outstandingCompetitors = result })
        .catch(() => this.$messages.addMessage('Problem Fetching Outstanding Competitors', 'error'))
    },
  },
}
</script>
<style lang="stylus" scoped>
.card h2
  padding-bottom: 0.5rem
</style>
