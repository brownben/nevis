<template>
  <base-layout>
    <template v-slot:menu>
      <button @click="importSafetyCheck()">Import Punch Data</button>
      <a class="back" @click="$router.go(-1)">Back</a>
    </template>
    <template v-slot:main>
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
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import time from '@/scripts/time'

export default {
  components: {
    'base-layout': BaseLayout,
  },

  data: () => ({
    refresh: 0,
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
  },

  methods: {
    refreshPage: function () { this.refresh += 1 },
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
                this.refreshPage()
                this.$messages.addMessage(result.length + ' Punches Imported as Safety Check Data')
              })
              .catch(error => this.$messages.addMessage(error.message, 'error'))
          }
        }
      )
    },
  },

  asyncComputed: {
    outstandingCompetitors: {
      get () {
        return this.$database.getCompetitors()
          .then(competitors => competitors.filter(competitor => !competitor.doc.download && competitor.doc.safetyCheck))
          .then(competitors => competitors.map(competitor => competitor.doc))
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      },
      watch () { this.refresh },
    },
  },

}
</script>
