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
    <div class="mx-12 flex">
      <router-link
        tag="div"
        :to="`/events/${event.id}/courses`"
        class="shadow w-full md:w-6/12 text-center p-2 md:mr-4"
      >
        <h2>Courses</h2>
      </router-link>
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
    if (this.$database.connection === null || !this.$database.connected) this.$router.push('/')
    else this.getEventDetails()
  },

  methods: {
    getEventDetails: function () {
      return this.$database.query('SELECT * FROM events WHERE id=? LIMIT 1', this.$route.params.id)
        .then(result => { this.event = result[0] })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },
  },
}
</script>

