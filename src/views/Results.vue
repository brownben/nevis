<template>
  <base-layout>
    <template v-slot:menu>
      <button @click="showHTMLTypeDialog = true">Export HTML</button>
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
      <transition name="open">
        <choice-dialog
          v-if="showHTMLTypeDialog"
          v-slot="slot"
          heading="Export HTML Results"
          message="What Format Do You Want To Export The HTML Results?"
          @close="exportHTMLResults"
        >
          <button @click="slot.confirmAction('single-page')">Single Page</button>
          <button @click="slot.confirmAction('multiple-pages')">Multiple Pages</button>
          <button
            @click="slot.confirmAction('multiple-pages-with-splits')"
          >
            Multiple Pages with Splits
          </button>
          <button @click="slot.confirmAction(false)">Cancel</button>
        </choice-dialog>
      </transition>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import Dialog from '@/components/Dialog'
import htmlResults from '@/scripts/htmlResults'
import time from '@/scripts/time'

export default {
  components: {
    'base-layout': BaseLayout,
    'choice-dialog': Dialog,
  },

  data: () => ({
    showHTMLTypeDialog: false,
  }),

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

    exportHTMLResults: function (type) {
      this.showHTMLTypeDialog = false
      if (type === 'single-page') this.generateSinglePageHTMLResults()
      else if (type === 'multiple-pages') this.generateMultiPageHTMLResults()
      else if (type === 'multiple-pages-with-splits') this.generateMultiPageHTMLResults(true)
    },

    generateSinglePageHTMLResults: async function () {
      const eventData = await this.$database.getOverview()
      let html = ''
      html += htmlResults.head(eventData.name)
      this.courses.forEach(course => {
        const courseResults = this.downloadsForCourse(course.name).map(competitor => htmlResults.tableRow(competitor))
        if (courseResults.length > 0) html += htmlResults.course(course, courseResults.join(''))
      })
      html += htmlResults.footer()
      this.exportSingleHTMLPage(html)
    },

    generateMultiPageHTMLResults: async function (withSplits = false) {
      const eventData = await this.$database.getOverview()

      let indexHtml = ''
      indexHtml += htmlResults.head(eventData.name)
      if (withSplits) indexHtml += '<table><tr><th>Event</th><th>Results</th><th>Splits</th></tr>'
      else indexHtml += '<table><tr><th>Event</th><th>Results</th></tr>'

      const pages = []
      this.courses.forEach(course => {
        let html = ''
        html += htmlResults.head(eventData.name)
        const courseResults = this.downloadsForCourse(course.name).map(competitor => htmlResults.tableRow(competitor))
        html += htmlResults.course(course, courseResults.join(''), true)
        html += htmlResults.footer()

        if (withSplits) {
          pages.push({
            name: course.name + '-splits.html',
            content: this.generateHTMLSplits(course, eventData),
          })
          indexHtml += `
          <tr>
            <td>${course.name}</td>
            <td><a href="./${course.name}.html">Results</a></td>
            <td><a href="./${course.name}-splits.html">Splits</a></td>
          </tr>`
        }
        else {
          indexHtml += `
          <tr>
            <td>${course.name}</td>
            <td><a href="./${course.name}.html">Results</a></td>
          </tr>`
        }

        pages.push({
          name: course.name + '.html',
          content: html,
        })
      })

      indexHtml += '</table>'
      indexHtml += htmlResults.footer()
      pages.push({
        name: 'index.html',
        content: indexHtml,
      })

      this.exportMultipleHTMLPages(pages)
    },

    generateHTMLSplits: function (course, eventData) {
      let html = ''
      html += htmlResults.head(eventData.name)

      let headerRow = `
        <tr>
          <th>Pos.</th>
          <th>Name</th>
          <th>Club</th>
          <th>Age Class</th>
          <th>Time</th>
        `

      for (const control of course.controls) {
        headerRow += `<th>${course.controls.indexOf(control) + 1} (${control})</th>`
      }
      headerRow += '<th>F</th>'
      const courseResults = this.downloadsForCourse(course.name).map(competitor => htmlResults.splitsTableRow(competitor, course.controls.length))
      html += htmlResults.splitsCourse(course, headerRow + courseResults.join(''))
      html += htmlResults.footer()
      return html
    },

    exportSingleHTMLPage: function (html) {
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

    exportMultipleHTMLPages: function (pages) {
      const { app, dialog } = this.$electron.remote
      dialog.showOpenDialog(
        {
          title: 'Nevis - Export HTML Results',
          buttonLabel: 'Export',
          properties: ['openDirectory'],
          defaultPath: app.getPath('documents'),
        },
        filePaths => {
          if (filePaths) {
            pages.map(page => this.$node.fs.promises.writeFile(filePaths[0] + '\\' + page.name, page.content))
            Promise.all(pages)
              .then(() => this.$messages.addMessage('Results Exported to: ' + filePaths[0]))
              .catch(() => this.$messages.addMessage('Problem Exporting Results', 'error'))
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
