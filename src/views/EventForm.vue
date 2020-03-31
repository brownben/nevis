<template>
  <main>
    <h1 class="mx-10 mb-1 px-1">
      <template v-if="$route.path.includes('create')">
        <back-arrow to="/events" />Create Event
      </template>
      <template v-else> <back-arrow />Update Event </template>
    </h1>
    <div v-if="$route.path.includes('create')" class="mx-12 mb-3">
      <button @click="createEvent" class="button">Create Event</button>
    </div>
    <div v-else class="mx-12 mb-3">
      <button @click="updateEvent" class="button">Update Event</button>
      <button @click="showConfirmationDialog = true" class="button">
        Delete Event
      </button>
    </div>
    <div class="my-shadow mx-12">
      <text-input v-model.trim="eventData.name" label="Name:" />
      <text-input v-model.trim="eventData.date" label="Date:" />
    </div>
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        @close="onConfirm"
        heading="Delete Event"
        message="Are You Sure You Want to Delete This Event and All Attatched Data? This Action Can't Be Recovered."
        confirm="Delete"
        cancel="Cancel"
      />
    </transition>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import TextInput from '@/components/TextInput'
import ConfirmationDialog from '@/components/ConfirmationDialog'

export default {
  components: {
    'back-arrow': BackArrow,
    'text-input': TextInput,
    'confirmation-dialog': ConfirmationDialog,
  },

  data: function() {
    return {
      showConfirmationDialog: false,
      eventData: {
        name: '',
        date: '',
        id: undefined,
      },
    }
  },

  mounted: function() {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    } else if (this.$route.params && this.$route.params.id)
      this.getEventDetails()
  },

  methods: {
    getEventDetails: function() {
      return this.$database
        .query('SELECT * FROM events WHERE id=? LIMIT 1', this.$route.params.id)
        .then(result => {
          this.eventData = result[0]
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Event Data', 'error')
        )
    },

    createEvent: function() {
      return this.$database
        .query('INSERT INTO events SET ?', {
          name: this.eventData.name,
          date: this.eventData.date,
        })
        .then(result => this.$router.push(`/events/${result.insertId}`))
        .then(() => this.$messages.clearMessages())
        .catch(() =>
          this.$messages.addMessage('Problem Creating Event', 'error')
        )
    },

    updateEvent: function() {
      return this.$database
        .query('UPDATE events SET name=?, date=? WHERE id=?', [
          this.eventData.name,
          this.eventData.date,
          this.eventData.id,
        ])
        .then(() => this.$messages.clearMessages())
        .then(() => this.$router.push(`/events/${this.eventData.id}`))
        .catch(() =>
          this.$messages.addMessage('Problem Updating Event', 'error')
        )
    },

    deleteEvent: function() {
      return this.$database
        .query('DELETE FROM events WHERE id=?', this.eventData.id)
        .then(() => {
          this.$messages.addMessage(`Event "${this.eventData.name}" Deleted`)
          this.$router.push('/events')
        })
        .catch(() =>
          this.$messages.addMessage('Problem Deleting Event', 'error')
        )
    },

    onConfirm: function(decision) {
      this.showConfirmationDialog = false
      if (decision) this.deleteEvent()
    },
  },
}
</script>
