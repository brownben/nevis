<template>
  <base-layout>
    <div slot="menu">
      <button @click="connect">Connect</button>
      <router-link to="/event/add">Add Event</router-link>
      <router-link to="/event/restore">Restore Event</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <div slot="main" class="main">
      <div class="card welcome">
        <img alt="Nevis Logo" src="../assets/images/NevisWhiteBorder.png">
        <h1>Welcome to Nevis</h1>
      </div>
      <div class="card">
        <h2>Database Settings</h2>
        <label>Server:</label>
        <input v-model="hostname" type="text">
        <label>Event ID:</label>
        <dropdown-input :list="events" :initial="event" @changed="dropdownChanged" />
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import DropdownInput from '@/components/DropdownInput'

export default {
  components: {
    'base-layout': BaseLayout,
    'dropdown-input': DropdownInput,
  },

  data: () => ({
    hostname: 'localhost',
    event: 'test',
    events: [],
  }),

  methods: {
    dropdownChanged: function (value) { this.event = value },

    connect: function () {
      if (this.event === '' || this.event === 'No Events Found') this.$messages.addMessage('No Event Specified', 'error')
      else {
        this.$database.connect(this.hostname, this.event)
          .then(() => {
            this.$messages.clearMessages()
            this.$router.push('dashboard')
          })
          .catch(() => {
            this.$messages.clearMessages()
            this.$messages.addMessage('Not Connected to the Database', 'error')
          })
      }
    },
  },

  asyncComputed: {
    listEvents: function () {
      this.$node.axios.get('http://' + this.hostname + ':5984/_all_dbs')
        .then(response => {
          const events = response.data.filter(event => event !== '_users' && event !== '_replicator')
          if (events.length === 0) this.events = ['No Events Found']
          else this.events = events
        })
        .catch(() => { this.events = ['No Events Found'] })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../assets/styles/helpers.styl'

.welcome
  background: url('../assets/images/largeBackground.svg')
  background-color: #0D47A1
  background-size: cover
  background-repeat: no-repeat

  img
    display: block
    margin: auto
    padding-top: 5px
    height: 100px

  h1
    margin: 0
    padding: 5px 0
    color: white
    text-align: center
</style>
