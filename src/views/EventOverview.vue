<template>
  <main>
    <h1 class="mx-10 mb-1">
      <back-arrow to="/events" />
      {{ event.name }}
      <template v-if="event.date">on {{ event.date }}</template>
    </h1>
    <div class="mx-12 mb-3">
      <router-link tag="button" class="button" :to="`/events/edit/${event.id}`">Edit Event</router-link>
    </div>
    <div class="mx-12 flex flex-wrap">
      <div class="w-full md:w-1/2 text-center mb-3">
        <router-link tag="div" :to="`/events/${event.id}/competitors`" class="shadow p-2 md:mr-3">
          <h2>Entries</h2>
          <p>{{ event.numberOfCompetitors }} Entries</p>
        </router-link>
      </div>
      <div class="w-full md:w-1/2 text-center mb-3">
        <router-link tag="div" :to="`/events/${event.id}/courses`" class="shadow p-2">
          <h2>Courses</h2>
          <p>{{ event.numberOfCourses }} Courses</p>
        </router-link>
      </div>
      <div v-if="event.numberOfCourses > 0" class="w-full md:w-1/2 text-center mb-3">
        <router-link tag="div" :to="`/events/${event.id}/download`" class="shadow p-2 md:mr-3">
          <h2>Download</h2>
          <p>Download SI Cards</p>
        </router-link>
      </div>
      <div v-if="event.numberOfResults > 0" class="w-full md:w-1/2 text-center mb-3">
        <router-link tag="div" :to="`/events/${event.id}/results`" class="shadow p-2">
          <h2>Results</h2>
          <p>{{ event.numberOfResults }} Results</p>
        </router-link>
      </div>
    </div>
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
      event: {},
    }
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    }
    else this.getEventDetails()
  },

  methods: {
    getEventDetails: function () {
      return this.$database.query(`
      SELECT events.*,
      (SELECT COUNT(*) FROM courses WHERE events.id=courses.event) numberOfCourses,
      (SELECT COUNT(*) FROM competitors WHERE events.id=competitors.event) as numberOfCompetitors,
      (SELECT COUNT(*) FROM results WHERE events.id=results.event ) as numberOfResults
      FROM events
      WHERE events.id = ?
    `, this.$route.params.id)
        .then(result => { this.event = result[0] })
        .catch(() => this.$messages.addMessage('Problem Fetching Event Data', 'error'))
    },
  },
}
</script>

