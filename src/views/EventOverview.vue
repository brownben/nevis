<template>
  <main>
    <back-arrow to="/events" />
    <h1 class="mx-10 mb-1 px-1">
      {{ event.name }}
      <template v-if="event.date">on {{ event.date }}</template>
    </h1>
    <div class="mx-12 mb-3">
      <router-link :to="`/events/edit/${event.id}`" tag="button" class="button"
        >Edit Event</router-link
      >
      <button class="button" @click="getEventDetails">Refresh</button>
    </div>
    <div class="mx-12 flex flex-wrap">
      <div
        v-if="event.numberOfCourses > 0"
        class="w-full md:w-1/2 text-center mb-5"
      >
        <router-link
          :to="`/events/${event.id}/competitors`"
          tag="div"
          class="my-shadow my-shadow-lg-hover p-2 md:mr-5 select-none border-blue border-t-4"
        >
          <h2 class="text-blue mb-1">Entries</h2>
          <p>{{ event.numberOfCompetitors }} Entries</p>
        </router-link>
      </div>
      <div class="w-full md:w-1/2 text-center mb-5">
        <router-link
          :to="`/events/${event.id}/courses`"
          tag="div"
          class="my-shadow my-shadow-lg-hover p-2 md:mr-5 select-none border-blue border-t-4"
        >
          <h2 class="text-blue mb-1">Courses</h2>
          <p>{{ event.numberOfCourses }} Courses</p>
        </router-link>
      </div>
      <div
        v-if="event.numberOfCourses > 0"
        class="w-full md:w-1/2 text-center mb-5"
      >
        <router-link
          :to="`/events/${event.id}/download`"
          tag="div"
          class="my-shadow my-shadow-lg-hover p-2 md:mr-5 select-none border-blue border-t-4"
        >
          <h2 class="text-blue mb-1">Download</h2>
          <p>Download SI Cards</p>
        </router-link>
      </div>
      <div
        v-if="event.numberOfResults > 0"
        class="w-full md:w-1/2 text-center mb-5"
      >
        <router-link
          :to="`/events/${event.id}/results`"
          tag="div"
          class="my-shadow my-shadow-lg-hover p-2 md:mr-5 select-none border-blue border-t-4"
        >
          <h2 class="text-blue mb-1">Results</h2>
          <p>{{ event.numberOfResults }} Results</p>
        </router-link>
      </div>
      <div
        v-if="event.numberOfCourses > 0"
        class="w-full md:w-1/2 text-center mb-5"
      >
        <router-link
          :to="`/events/${event.id}/safetyCheck`"
          tag="div"
          class="my-shadow my-shadow-lg-hover p-2 md:mr-5 select-none border-blue border-t-4"
        >
          <h2 class="text-blue mb-1">Safety Check</h2>
          <p>{{ event.outstandingCompetitors }} Outstanding Competitors</p>
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
    } else this.getEventDetails()
  },

  methods: {
    getEventDetails: function () {
      return this.$database
        .query(
          `
      SELECT events.*,
      (SELECT COUNT(*) FROM courses WHERE events.id=courses.event) as numberOfCourses,
      (SELECT COUNT(*) FROM competitors WHERE events.id=competitors.event) as numberOfCompetitors,
      (SELECT COUNT(*) FROM results WHERE events.id=results.event ) as numberOfResults,
      (SELECT COUNT(*) FROM (
          SELECT time
          FROM punches, competitors
          WHERE punches.competitor=competitors.id
              AND competitors.downloaded=False
			        AND punches.event=?
          GROUP BY competitors.id
      ) as outstanding) as outstandingCompetitors
      FROM events
      WHERE events.id = ?
    `,
          [this.$route.params.id, this.$route.params.id, this.$route.params.id]
        )
        .then((result) => {
          this.event = result[0]
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Event Data', 'error')
        )
    },
  },
}
</script>
