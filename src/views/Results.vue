<template>
  <base-layout>
    <div slot="menu">
      <router-link to="/dashboard" class="back">Back</router-link>
    </div>
    <div slot="main" class="main">
      <div
        v-for="course in courses"
        v-if="downloadsForCourse(course).length > 0"
        :key="course"
        class="card"
      >
        <h1>{{ course }}</h1>
        <table>
          <tbody>
            <tr>
              <th>Pos.</th>
              <th>Name</th>
              <th>Age Class</th>
              <th>Time</th>
            </tr>
          </tbody>
          <tbody is="transition-group" name="fade">
            <tr v-for="competitor of downloadsForCourse(course)" :key="competitor._id">
              <td>{{ competitor.position }}</td>
              <td>{{ competitor.name }}</td>
              <td>{{ competitor.ageClass }}</td>
              <td>{{ displayTime(competitor.result) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'

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
          else {
            competitor.position = currentPosition
            currentPosition += 1
          }
        })
        return downloads
      }
      else return []
    },

    displayTime: function (result) {
      if (typeof result !== 'number') return result
      else return this.$time.elapsed(result)
    },
  },

  asyncComputed: {
    courses: function () {
      return this.$database.getCourses()
        .then(data => data.map(course => course.doc.name))
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },

    downloads: function () {
      return this.$database.getDownloads()
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },
  },
}
</script>
