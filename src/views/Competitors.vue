<template>
  <main>
    <h1 class="mx-10 mb-1">
      <back-arrow :to="`/events/${$route.params.id}`" />Entries
    </h1>
    <div class="mx-12 mb-3">
      <router-link
        tag="button"
        class="button"
        :to="`/events/${$route.params.id}/competitors/create`"
      >
        Create Entry
      </router-link>
      <button class="button" @click="getCompetitors">Refresh</button>
    </div>
    <div v-if="competitors && competitors.length > 0" class="shadow mx-12 mb-3 p-2">
      <table class="w-full font-body">
        <tr class="font-heading text-center hover:bg-blue-light">
          <th>Name</th>
          <th>SI Card</th>
          <th>Course</th>
        </tr>
        <router-link
          v-for="competitor of competitors"
          :key="competitor.id"
          :to="`/events/${$route.params.id}/competitors/${competitor.id}/edit`"
          tag="tr"
          class="text-center even:bg-blue-lightest hover:bg-blue-light"
        >
          <td>{{ competitor.name }}</td>
          <td>{{ competitor.siid }}</td>
          <td>{{ courses[competitor.course] }}</td>
        </router-link>
      </table>
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
      competitors: [],
      courses: {},
    }
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) this.$router.push('/')
    else {
      this.getCourses()
      this.getCompetitors()
    }
  },

  methods: {
    getCompetitors: function () {
      return this.$database.query('SELECT * FROM competitors WHERE event=?', this.$route.params.id)
        .then(result => { this.competitors = result })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    getCourses: function () {
      return this.$database.query('SELECT * FROM courses WHERE event=?', this.$route.params.id)
        .then(result => {
          for (const course of result) {
            this.courses[course.id] = course.name
          }
        })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },
  },
}
</script>

