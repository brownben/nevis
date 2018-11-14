<template>
  <base-layout>
    <div slot="menu">
      <router-link to="/courses/add">Add Course</router-link>
      <router-link to="/dashboard" class="back">Back</router-link>
    </div>
    <div is="transition-group" slot="main" class="main" name="fade">
      <router-link
        v-for="course of courses"
        :to="'/courses/update/' + course._id"
        :key="course._id"
        class="card"
        tag="div"
      >
        <h1>{{ course.name }}</h1>
        <p>Length: {{ course.length }}km &emsp; Climb: {{ course.climb }}m &emsp;</p>
        <p>Number of Entrants: {{ course.noOfEntrants }}</p>
        <p>Controls: {{ course.controls.toString() }}</p>
      </router-link>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'

export default {
  components: {
    'base-layout': BaseLayout,
  },

  data: () => ({}),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
  },

  asyncComputed: {
    courses () {
      const database = this.$database
      return database.getCourses()
        .then(data => data.map(course => course.doc))
        .then(data => data.map(async course => {
          course.noOfEntrants = await database.competitorsOnCourse(course.name)
          return course
        }))
        .then(data => Promise.all(data))
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },
  },
}
</script>
