<template>
  <base-layout>
    <div slot="menu">
      <router-link to="/entries">Entries</router-link>
      <router-link to="/courses">Courses</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/" class="back">Change Event</router-link>
    </div>
    <div slot="main" class="main">
      <div class="card">
        <h1>{{ eventData.name }} on {{ eventData.date }}</h1>
        <p>Number of Courses: {{ eventData.noOfCourses }}</p>
        <p>Number of Competitors: {{ eventData.noOfCompetitors }}</p>
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout.vue'

export default {
  components: {
    'base-layout': BaseLayout,
  },
  data: () => ({
    eventData: {},
  }),
  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.clearMessages()
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }

    this.$database.getOverview()
      .then(data => { this.eventData = data })
      .catch(() => {
        this.$messages.clearMessages()
        this.$messages.addMessage('Can\'t Connect to Database', 'error')
        this.$router.go(-1)
      })
  },
}
</script>
