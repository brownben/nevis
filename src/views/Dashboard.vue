<template>
  <base-layout>
    <div slot="menu">
      <router-link to="/download">Download</router-link>
      <router-link to="/entries">Entries</router-link>
      <router-link to="/courses">Courses</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/" class="back">Change Event</router-link>
    </div>
    <div slot="main" class="main">
      <div class="card">
        <h1>{{ eventData.name }} on {{ eventData.date }}</h1>
        <p>On {{ eventData.database.host }} as {{ eventData.database.db_name }}</p>
      </div>
      <div id="info-cards">
        <div class="card info-card" @click="$router.push('entries')">
          <img class="svg" src="../assets/images/Competitor.svg">
          <h2>Entries</h2>
          <p>{{ eventData.noOfCompetitors }} Competitors</p>
        </div>
        <div class="card info-card" @click="$router.push('courses')">
          <img class="svg" src="../assets/images/Course.svg">
          <h2>Courses</h2>
          <p>{{ eventData.noOfCourses }} Courses</p>
        </div>
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
    eventData: { database: {} },
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
<style lang="stylus">
@import '../assets/styles/helpers.styl'

.svg
  height: 150px
  fill: main-color

#info-cards
  display: grid
  box-sizing: border-box
  width: 100%
  grid-gap: 15px
  grid-template-columns: 1fr 1fr

.info-card
  box-sizing: border-box
  width: 100%
  text-align: center

@media (min-width: 900px)
  #info-cards
    grid-template-columns: 1fr 1fr 1fr
</style>
