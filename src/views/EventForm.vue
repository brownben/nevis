<template>
  <main>
    <h1 class="mx-10 mb-1">
      <template v-if="$route.path.includes('create')">
        <back-arrow to="/events" />Create Event
      </template>
      <template v-else>
        <back-arrow />Update Event
      </template>
    </h1>
    <div v-if="$route.path.includes('create')" class="mx-12 mb-3">
      <button class="button" @click="createEvent">Create Event</button>
    </div>
    <div v-else class="mx-12 mb-3">
      <button class="button" @click="updateEvent">Update Event</button>
      <button class="button" @click="deleteEvent">Delete Event</button>
    </div>
    <div class="shadow mx-12">
      <text-input v-model="name" label="Name:" />
      <text-input v-model="date" label="Date:" />
    </div>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import TextInput from '@/components/TextInput'

export default {
  components: {
    'back-arrow': BackArrow,
    'text-input': TextInput,
  },

  data: function () {
    return {
      name: '',
      date: '',
      id: 0,
    }
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) this.$router.push('/')
    else if (this.$route.params && this.$route.params.id) this.getEventDetails()
  },

  methods: {
    getEventDetails: function () {
      return this.$database.query('SELECT * FROM events WHERE id=? LIMIT 1', this.$route.params.id)
        .then(result => { this.event = result[0] })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    createEvent: function () {
      return this.$database.query('INSERT INTO events SET ?', { name: this.name, date: this.date })
        .then(() => this.$router.push('/events/' + this.id))
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    updateEvent: function () {
      return this.$database.query('UPDATE events SET name=?, date=? WHERE id=?', [this.name, this.date, this.id])
        .then(() => this.$router.push('/events/' + this.id))
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    deleteEvent: function () {
      return this.$database.query('DELETE FROM events WHERE id=?', this.id)
        .then(() => {
          this.$messages.addMessage(`${this.name} - deleted`)
          this.$router.push('/events')
        })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },
  },
}

</script>

