<template>
  <main>
    <back-arrow :to="`/events/${$route.params.id}`" />
    <h1 class="mx-10 mb-1 px-1">
      Courses
    </h1>
    <div class="mx-12 mb-3">
      <router-link
        :to="`/events/${$route.params.id}/courses/create`"
        tag="button"
        class="button"
      >
        Create Course
      </router-link>
      <button @click="getCourses" class="button">Refresh</button>
    </div>
    <template v-if="courses && courses.length > 0">
      <router-link
        v-for="course of courses"
        :key="course.id"
        :to="`/events/${$route.params.id}/courses/${course.id}/edit`"
        tag="div"
        class="my-shadow mx-12 mb-5 px-3 py-2 border-t-4 border-blue"
      >
        <h2 class="pb-1">{{ course.name }}</h2>
        <p>
          <b>Length:</b>
          {{ course.length / 1000 }} km
          <b />
          <b>Climb:</b>
          {{ course.climb }} m
        </p>
        <p>
          <b>Controls:</b>
          {{ course.controls }}
        </p>
        <p>
          <b>Number of Entries:</b>
          {{ course.numberOfCompetitors }}
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

  data: function() {
    return {
      courses: [],
    }
  },

  mounted: function() {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    } else this.getCourses()
  },

  methods: {
    getCourses: function() {
      return this.$database
        .query(
          `
      SELECT courses.*, IFNULL(COUNT(competitors.course),0) AS numberOfCompetitors
      FROM courses
      LEFT JOIN competitors ON courses.id=competitors.course
      WHERE courses.event=?
      GROUP BY courses.id
      ORDER BY courses.name`,
          this.$route.params.id
        )
        .then(result => {
          this.courses = result
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Courses', 'error')
        )
    },
  },
}
</script>
