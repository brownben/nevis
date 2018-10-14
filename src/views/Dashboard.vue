<template>
  <base-layout>
    <div slot="menu">
      <router-link to="/entries">Entries</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/" class="back">Change Event</router-link>
    </div>
    <div slot="main" class="main">
      <div class="card">
        <h1>{{ eventData.name }} on {{ eventData.date }}</h1>
        <p>Number of Courses: {{ eventOverview.noOfCourses }}</p>
        <p>Number of Competitors: {{ eventOverview.noOfCompetitors }}</p>
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
    eventOverview: {},
  }),
  created: function () {
    if (this.$database.database === null) this.$router.push('/')
    this.$database.getEventData().then(data => this.eventData = data)
    this.$database.getOverview().then(data => this.eventOverview = data)
  },
}
</script>
