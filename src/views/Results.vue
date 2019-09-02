<template>
  <main>
    <h1 class="mx-10 mb-1">
      <back-arrow :to="`/events/${$route.params.id}`" />Results
    </h1>
    <div class="mx-12 mb-3">
      <button class="button" @click="refresh">Refresh</button>
    </div>

    <div v-for="course of courses" :key="course.id">
      <div v-if="competitorsOnCourse(course.id).length > 0" class="shadow mx-12 mb-3 px-3 py-2">
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
            v-for="(competitor, position) of competitorsOnCourse(course.id)"
            :key="competitor.id"
            class="text-center even:bg-blue-lightest hover:bg-blue-light"
          >
            <td v-if="competitor.errors === ''">{{ position + 1 }}</td>
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
import timeFunctions from '@/scripts/time'

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
    }
    else this.refresh()
  },

  methods: {
    refresh: function () {
      this.getCourses()
      this.getResults()
    },

    getResults: function () {
      return this.$database.query(`
      SELECT *
      FROM competitors, results
      WHERE competitors.downloaded=true AND competitors.event=? AND competitors.id=results.competitor`, this.$route.params.id)
        .then(result => { this.results = result })
        .catch(() => this.$messages.addMessage('Problem Fetching Results', 'error'))
    },

    getCourses: function () {
      return this.$database.query('SELECT * FROM courses WHERE event=?', this.$route.params.id)
        .then(result => { this.courses = result })
        .catch(() => this.$messages.addMessage('Problem Fetching Courses', 'error'))
    },

    competitorsOnCourse: function (courseId) {
      return this.results
        .filter(competitor => competitor.course === courseId)
        .sort((a, b) => {
          if (a.errors !== '' || b.errors !== '') return a.errors.length - b.errors.length
          else return a.time - b.time
        })
    },
  },
}
</script>

