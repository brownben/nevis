<template>
  <main>
    <back-arrow :to="`/events/${$route.params.id}`" />
    <h1 class="mx-10 mb-1 px-1">
      Results
    </h1>
    <div class="mx-12 mb-3">
      <button class="button" @click="refresh">Refresh</button>
      <button class="button" @click="saveHTMLResults">Export HTML</button>
    </div>

    <div v-for="course of courses" :key="course.id">
      <div
        v-if="competitorsOnCourse(course.id).length > 0"
        class="my-shadow mx-12 mb-5 px-3 py-2 border-t-4 border-blue"
      >
        <h2>{{ course.name }}</h2>
        <p>{{ course.length / 1000 }}km {{ course.climb }}m</p>
        <table class="w-full font-body">
          <tr class="font-heading text-center hover:bg-blue-light">
            <th>Pos.</th>
            <th>Name</th>
            <th class="hidden sm:table-cell">Age Class</th>
            <th class="hidden md:table-cell">Club</th>
            <th>Time</th>
          </tr>
          <tr
            v-for="competitor of competitorsOnCourse(course.id)"
            :key="competitor.id"
            class="text-center even:bg-blue-lightest hover:bg-blue-light"
          >
            <td v-if="competitor.errors === ''">{{ competitor.position }}</td>
            <td v-else></td>
            <td>{{ competitor.name }}</td>
            <td class="hidden sm:table-cell">{{ competitor.ageClass }}</td>
            <td class="hidden md:table-cell">{{ competitor.club }}</td>
            <td>{{ time.displayTime(competitor.time, competitor.errors) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import * as timeFunctions from '@/scripts/time'
import * as htmlFunctions from '@/scripts/resultsHTML'

export default {
  components: {
    'back-arrow': BackArrow,
  },

  data: function () {
    return {
      results: [],
      courses: [],
      time: timeFunctions,
    }
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    } else this.refresh()
  },

  methods: {
    refresh: function () {
      this.getCourses()
      this.getResults()
    },

    getResults: function () {
      return this.$database
        .query(
          `
      SELECT *
      FROM competitors, results
      WHERE competitors.downloaded=true AND competitors.event=? AND competitors.id=results.competitor`,
          this.$route.params.id
        )
        .then((result) => {
          this.results = result
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Results', 'error')
        )
    },

    getCourses: function () {
      return this.$database
        .query('SELECT * FROM courses WHERE event=?', this.$route.params.id)
        .then((result) => {
          this.courses = result
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Courses', 'error')
        )
    },

    competitorsOnCourse: function (courseId) {
      let position = 0
      return this.results
        .filter((competitor) => competitor.course === courseId)
        .sort((a, b) => {
          if (a.errors !== '' || b.errors !== '')
            return a.errors.length - b.errors.length
          else return a.time - b.time
        })
        .map((result) => {
          if (result.nonCompetitive) return { ...result, position: 'n/c' }
          else {
            position += 1
            return { ...result, position }
          }
        })
    },

    courseToHTML: function (course) {
      const results = this.competitorsOnCourse(course.id)
        .map(htmlFunctions.resultRow)
        .join('')
      return htmlFunctions.courseTable(course, results)
    },

    generateHTML: async function () {
      try {
        const eventDetails = await this.getEventDetails()
        const body = this.courses
          .filter((course) => this.competitorsOnCourse(course.id).length > 0)
          .map((course) => this.courseToHTML(course))
          .join('')

        return htmlFunctions.htmlPage(eventDetails, body)
      } catch (error) {
        this.$messages.addMessage('Problem Generating HTML', 'error')
      }
    },

    saveHTMLResults: async function () {
      const { dialog } = this.$electron.remote
      const htmlResults = await this.generateHTML()

      return dialog
        .showSaveDialog({
          title: 'Nevis - Save HTML Results',
          filters: [
            { name: 'HTML', extensions: ['html'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        })
        .then((result) => {
          if (!result.canceled)
            return this.$fs.writeFile(result.filePath, htmlResults, {
              encoding: 'utf8',
            })
          else throw Error()
        })
        .then((result) =>
          this.$messages.addMessage('Results Successfully Written')
        )
        .catch(() =>
          this.$messages.addMessage('Problem Saving Results', 'error')
        )
    },

    getEventDetails: function () {
      return this.$database
        .query(
          `SELECT * FROM events WHERE events.id = ?`,
          this.$route.params.id
        )
        .then((result) => result[0])
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Event Data', 'error')
        )
    },
  },
}
</script>
