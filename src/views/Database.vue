<template>
  <base-layout>
    <div slot="menu">
      <button @click="connect">Connect</button>
      <router-link to="/about">About</router-link>
    </div>
    <div slot="main" class="main">
      <div class="card welcome">
        <img alt="Nevis Logo" src="../assets/images/NevisWhiteBorder.png">
        <h1>Welcome to Nevis</h1>
      </div>
      <div class="card">
        <h2>Database Settings</h2>
        <label>Hostname:</label>
        <input v-model="hostname" type="text">
        <label>Event:</label>
        <input v-model="event" type="text">
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'

export default {
  components: {
    'base-layout': BaseLayout,
  },
  data: () => ({
    hostname: 'localhost',
    event: 'test',
  }),
  methods: {
    connect: function () {
      this.$database.setDatabase(this.hostname, this.event)
      this.$database.connect()
        .then(() => {
          this.$messages.clearMessages()
          this.$router.push('dashboard')
        })
        .catch(() => {
          this.$messages.clearMessages()
          this.$messages.addMessage('Not Connected to the Database', 'error')
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../assets/styles/helpers.styl'

.welcome
  background-color: #0D47A1

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
