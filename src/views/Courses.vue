<template>
  <main>
    <h1 class="mx-10 mb-1">
      <back-arrow :to="`/events/${$route.params.id}`" />Courses
    </h1>
    <div class="mx-12 mb-3">
      <router-link
        tag="button"
        class="button"
        :to="`/events/${$route.params.id}/courses/create`"
      >
        Create Course
      </router-link>
      <button class="button" @click="getCourses">Refresh</button>
    </div>
    <template v-if="courses && courses.length > 0">
      <router-link
        v-for="course of courses"
        :key="course.id"
        :to="`/events/${$route.params.id}/courses/${course.id}/edit`"
        tag="div"
        class="shadow mx-12 mb-3 px-3 py-2"
      >
        <h2 class="pb-1">{{ course.name }}</h2>
        <p>
          <b>Length:</b>
          {{ course.length / 1000 }} km
          <b>Climb:</b>
          {{ course.climb }} m
        </p>
        <p>
          <b>Controls:</b>
          {{ course.controls }}
        </p>
      </router-link>
    </template>
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
      courses: [],
    }
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) this.$router.push('/')
    else this.getCourses()
  },

  methods: {
    getCourses: function () {
      return this.$database.query('SELECT * FROM courses WHERE event=?', this.$route.params.id)
        .then(result => { this.courses = result })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },
  },
}
</script>

