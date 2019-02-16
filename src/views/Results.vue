<template>
  <base-layout>
    <template v-slot:menu>
      <button @click="exportHTMLResults()">Export HTML</button>
      <router-link to="/dashboard" class="back">Back</router-link>
    </template>
    <template v-slot:main>
      <template v-for="course in courses">
        <div v-if="downloadsForCourse(course.name).length > 0" :key="course.name" class="card">
          <h1>{{ course.name }}</h1>
          <table>
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Name</th>
                <th>Age Class</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody is="transition-group" name="fade">
              <tr v-for="competitor of downloadsForCourse(course.name)" :key="competitor._id">
                <td>{{ competitor.position }}</td>
                <td>{{ competitor.name }}</td>
                <td>{{ competitor.ageClass }}</td>
                <td>{{ displayTime(competitor.result) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import htmlResults from '@/scripts/htmlResults'
import time from '@/scripts/time'

export default {
  components: {
    'base-layout': BaseLayout,
  },

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
  },

  methods: {
    displayTime: timeToDisplay => time.displayTime(timeToDisplay),

    downloadsForCourse: function (course) {
      if (this.downloads) {
        let downloads = this.downloads
        let currentPosition = 1
        downloads = downloads.filter(competitor => competitor.course === course)
        downloads = downloads.sort((a, b) => {
          if (typeof a.result === 'string' && typeof b.result === 'string') return a.result.length > b.result.length
          else if (typeof a.result === 'string') return true
          else if (typeof b.result === 'string') return false
          else return a.result > b.result
        })
        downloads.forEach(competitor => {
          if (competitor.nonCompetitive) competitor.position = 'n/c'
          else if (typeof competitor.result !== 'string') {
            competitor.position = currentPosition
            currentPosition += 1
          }
          else competitor.position = ''
        })
        return downloads
      }
      else return []
    },

    exportHTMLResults: async function () {
      const eventData = await this.$database.getOverview()
      let html = ''
      html += htmlResults.head(eventData.name)
      this.courses.forEach(course => {
        const courseResults = this.downloadsForCourse(course.name).map(competitor => htmlResults.tableRow(competitor))
        if (courseResults.length > 0) html += htmlResults.course(course, courseResults.join(''))
      })
      html += htmlResults.footer()
      const { app, dialog } = this.$electron.remote
      dialog.showSaveDialog(
        {
          title: 'Nevis - Export HTML Results',
          buttonLabel: 'Export',
          defaultPath: app.getPath('documents'),
          filters: [
            { name: 'HTML', extensions: ['html'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        },
        filePath => {
          if (filePath) {
            this.$node.fs.writeFile(filePath, html, error => {
              if (error) this.$messages.addMessage('Problem Exporting HTML', 'error')
              else this.$messages.addMessage('HTML Results saved to: ' + filePath)
            })
          }
        }
      )
    },
  },

  asyncComputed: {
    courses: function () {
      return this.$database.getCoursesData()
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },

    downloads: function () {
      return this.$database.getDownloads()
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },
  },
}
</script>
