<template>
  <div>
    <div class="header">
      <back-arrow to="/" />
      <h1>{{ eventData.name }} on {{ eventData.date }}</h1>
      <p>On {{ eventData.database.host }} as {{ eventData.database.db_name }}</p>
    </div>
    <main>
      <div>
        <router-link to="/event/edit" class="button">Edit Event</router-link>
      </div>
      <div class="grid">
        <router-link to="/entries" tag="div" class="card">
          <h2>Entries</h2>
          <p>{{ eventData.noOfCompetitors }} Entries</p>
        </router-link>
        <router-link to="/courses" tag="div" class="card">
          <h2>Courses</h2>
          <p>{{ eventData.noOfCourses }} Courses</p>
        </router-link>
        <router-link to="/download" tag="div" class="card">
          <h2>Download</h2>
        </router-link>
        <router-link to="/safety-check" tag="div" class="card">
          <h2>Safety Check</h2>
          <p>{{ eventData.noOfOutstandingCompetitors }} Outstanding Competitors</p>
        </router-link>
        <router-link to="/results" tag="div" class="card">
          <h2>Results</h2>
          <p>{{ eventData.noOfDownloads }} Results</p>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import BackArrow from '@/components/BackArrow'

export default {
  components: {
    'back-arrow': BackArrow,
  },

  data: () => ({
    eventData: { database: {} },
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }

    this.$database.getOverview()
      .then(data => { this.eventData = data })
      .catch(error => {
        if (error.error === 'not_found' && error.docId === 'eventInformation') this.$messages.addMessage('No Event Could be Found', 'error')
        else this.$messages.addMessage('Can\'t Connect to Database', 'error')
        this.$router.go(-1)
      })
  },
}
</script>
<style lang="stylus" scoped>
@import '../assets/styles/helpers'

.header
  position: relative
  left: -10vw
  padding: 1rem calc(10vw + 1rem)
  width: 100vw
  background: linear-gradient(main-color, accent-color)
  background-color: main-color
  color: white
  box-shadow(1)

  @media (max-width: 1250px)
    left: -7.5vw
    padding: 1rem calc(7.5vw + 1rem)

  @media (max-width: 1000px)
    left: -5vw
    padding: 1rem calc(5vw + 1rem)

  @media (max-width: 700px)
    left: -2.5rem
    padding: 1rem calc(2.5vw + 1rem)

  svg
    fill: white

  h1
    font-size: 2.2rem

  p
    padding: 1rem 0

main
  padding-top: 0.5rem

.grid
  display: grid
  width: 100%
  grid-template-columns: 1fr 1fr
  grid-gap: 1rem

  @media (max-width: 700px)
    grid-template-columns: 1fr

  div
    text-align: center

    p
      padding-top: 0.5rem
</style>
