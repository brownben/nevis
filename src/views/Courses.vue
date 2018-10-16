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
        <p>Length: {{ course.length }}km</p>
        <p>Climb: {{ course.climb }}m</p>
        <p>Controls: {{ course.controls.toString() }}</p>
      </router-link>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout.vue'

export default {
  components: {
    'base-layout': BaseLayout,
  },

  data: () => ({}),
  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Error: Not Connected to the Database', 'error')
    }
  },

  asyncComputed: {
    courses: function () {
      return this.$database.getCourses()
        .then(data => data.map(course => course.doc))
        .catch(error => this.$messages.addMessage('Error: ' + error.message, 'error'))
    },
  },
}
</script>
