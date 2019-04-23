<template>
  <div>
    <div class="header">
      <img src="@/assets/images/Nevis Logo.svg" alt="Nevis Logo">
      <h1>Welcome to Nevis</h1>
    </div>
    <main>
      <div>
        <router-link class="button" to="/event/add">Create Event</router-link>
        <router-link class="button" to="/event/restore">Restore Event</router-link>
        <button class="button" @click="refreshEvents">Refresh Events List</button>
        <router-link class="button" to="/about">About</router-link>
      </div>
      <div class="card input">
        <h2>Database Settings</h2>
        <text-input v-model="hostname" label="Server:" @input="refreshEvents" />
        <dropdown-input v-model="event" :list="events" label="Event ID:" />
      </div>
      <div>
        <button v-if="hostname && event" class="button" @click="connect">Open Event</button>
      </div>
    </main>
  </div>
</template>

<script>
import TextInput from '@/components/TextInput'
import DropdownInput from '@/components/DropdownInput'

export default {
  components: {
    'text-input': TextInput,
    'dropdown-input': DropdownInput,
  },

  data: () => ({
    hostname: 'localhost',
    event: '',
    events: [],
  }),

  mounted: function () {
    this.refreshEvents()
  },

  methods: {
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

    refreshEvents: function () {
      this.$node.axios.get('http://' + this.hostname + ':5984/_all_dbs')
        .then(response => {
          const events = response.data.filter(event => event !== '_users' && event !== '_replicator')
          if (events.length === 0) {
            this.events = ['No Events Found']
          }
          else {
            this.events = events
          }
        })
        .catch(() => { this.events = ['No Events Found'] })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../assets/styles/helpers'

h2
  padding: 0.75rem 0.75rem 0
  color: black

.header
  position: relative
  left: -10vw
  width: 100vw
  background: linear-gradient(main-color, #2196F3)
  background-color: main-color
  color: white
  text-align: center
  box-shadow(1)

  @media (max-width: 1250px)
    left: -7.5vw

  @media (max-width: 1000px)
    left: -5vw

  @media (max-width: 700px)
    left: -2.5rem

  img
    padding: 0.5rem
    height: 200px

  h1
    padding: 0 0 1.5rem
    font-weight: 500
    font-size: 2.35rem
</style>
