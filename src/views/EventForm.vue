<template>
  <base-layout>
    <template v-slot:menu>
      <div v-if="currentRoute === '/event/add'">
        <button @click="createEvent">Create Event</button>
        <a class="back" @click="$router.push('/')">Back</a>
      </div>
      <div v-if="currentRoute === '/event/edit'">
        <button @click="updateEvent">Update Event</button>
        <button @click="backupEvent">Backup Event</button>
        <button @click="deleteEvent">Delete Event</button>
        <a class="back" @click="$router.push('/dashboard')">Back</a>
      </div>
      <div v-if="currentRoute === '/event/restore'">
        <button @click="restoreEvent">Restore Event</button>
        <a class="back" @click="$router.push('/')">Back</a>
      </div>
    </template>
    <template v-slot:main>
      <div class="card">
        <div v-if="currentRoute === '/event/add' || currentRoute === '/event/edit'">
          <label>Name:</label>
          <input v-model="name">
          <label>Date:</label>
          <input v-model="date">
        </div>
        <div v-if="currentRoute === '/event/add' || currentRoute === '/event/restore'">
          <label>Server Hostname:</label>
          <input v-model="server">
          <label>Event ID:</label>
          <input v-model="eventID">
        </div>
        <div v-if="currentRoute === '/event/restore'">
          <label>File Location:</label>
          <input v-model="backupLocation">
          <button @click="selectBackupLocation">Select File Location</button>
          <checkbox-input v-model="override" label="Override Event if it Already Exists?" />
        </div>
      </div>
      <transition name="open">
        <confirmation-dialog
          v-if="showConfirmationDialog"
          heading="Delete Event"
          message="Are You Sure You Want to Delete This Event? This Action can't be Recovered."
          confirm="Delete"
          cancel="Cancel"
          @close="confirmationOfDeleteEvent"
        />
      </transition>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import CheckboxInput from '@/components/CheckboxInput'
import Dialog from '@/components/Dialog'

export default {
  components: {
    'base-layout': BaseLayout,
    'confirmation-dialog': Dialog,
    'checkbox-input': CheckboxInput,
  },

  data: function () {
    return {
      name: '',
      date: '',
      server: 'localhost',
      eventID: '',
      override: false,
      backupLocation: '',
      currentRoute: this.$router.currentRoute.path,
      showConfirmationDialog: false,
    }
  },

  created: function () {
    if (this.$router.currentRoute.path === '/event/edit') {
      if (this.$database.database === null) {
        this.$router.push('/')
        this.$messages.addMessage('Not Connected to the Database', 'error')
      }
      this.$database.getEventInformation()
        .then(data => {
          this.name = data.name
          this.date = data.date
        })
    }
  },

  methods: {
    createEvent: function () {
      if (this.eventID === '') this.$messages.addMessage('No Event ID Specified', 'error')
      else {
        this.$database.connect(this.server, this.eventID)
          .then(() => this.$database.eventInformationExists())
          .then(eventInformation => {
            if (!eventInformation) {
              return this.$database.setEventInformation({
                name: this.name,
                date: this.date,
              })
            }
            else return 'exists'
          })
          .then(message => {
            if (message === 'exists') this.$messages.addMessage('An Event already exists with ID - ' + this.eventID, 'error')
            else {
              this.$messages.clearMessages()
              this.$router.push('/dashboard')
              this.$messages.addMessage('Event Created called ' + this.name)
            }
          })
          .catch(() => this.$messages.addMessage('Problem Creating Event', 'error'))
      }
    },

    updateEvent: async function () {
      const currentInfo = await this.$database.getEventInformation()
      this.$database.setEventInformation({
        name: this.name,
        date: this.date,
        _rev: currentInfo._rev,
      })
        .then(() => this.$router.push('/dashboard'))
        .catch(() => this.$messages.addMessage('Problem Updating Event', 'error'))
    },

    backupEvent: function () {
      const { app, dialog } = this.$electron.remote
      dialog.showSaveDialog(
        {
          title: 'Nevis - Backup Event',
          buttonLabel: 'Backup',
          defaultPath: app.getPath('documents'),
          filters: [
            { name: 'JSON', extensions: ['json', 'jsonc'] },
            { name: 'Plain Text', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        },
        filePath => {
          if (filePath) {
            this.$database.fullDatabase().then(data => {
              data.forEach(doc => { doc._rev = null })
              this.$node.fs.writeFile(filePath, JSON.stringify(data), error => {
                if (error) this.$messages.addMessage('Problem Saving Backup', 'error')
                else this.$messages.addMessage('Event Backed Up to: ' + filePath)
              })
            })
          }
        }
      )
    },

    deleteEvent: function () { this.showConfirmationDialog = true },

    confirmationOfDeleteEvent: function (decision) {
      this.showConfirmationDialog = false
      if (decision) {
        this.$database.deleteDatabase()
          .then(() => {
            this.$router.push('/')
            this.$messages.addMessage('Event Deleted')
          })
          .catch(() => this.$messages.addMessage('Problem Deleting Event', 'error'))
      }
    },

    selectBackupLocation: function () {
      const { app, dialog } = this.$electron.remote
      dialog.showOpenDialog(
        {
          title: 'Nevis - Select File',
          buttonLabel: 'Select',
          defaultPath: app.getPath('documents'),
          properties: ['openFile'],
          filters: [
            { name: 'JSON', extensions: ['json', 'jsonc'] },
            { name: 'Plain Text', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        },
        filePath => { if (filePath) this.backupLocation = filePath[0] }
      )
    },

    restoreEvent: async function () {
      if (this.server === '') this.$messages.addMessage('No Server Set', 'error')
      else if (this.eventID === '') this.$messages.addMessage('No Event ID Set', 'error')
      else if (this.backupLocation === '') this.$messages.addMessage('No Backup Location Set', 'error')
      else {
        this.$node.fs.promises.readFile(this.backupLocation, { encoding: 'UTF8', flag: 'r' })
          .catch(() => this.$messages.addMessage('Problem Reading File', 'error'))
          .then(data => this.$database.restore(this.server, this.eventID, data, this.override))
          .then(() => {
            this.$messages.clearMessages()
            this.$router.push('/dashboard')
            this.$messages.addMessage('Event Restored')
          })
          .catch(error => {
            if (error.message === 'Event Already Exists') this.$messages.addMessage(error.message, 'error')
            else this.$messages.addMessage('Problem Restoring Event', 'error')
          })
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
@import '../assets/styles/helpers.styl'

main
  button
    margin: 5px 0 10px
    padding: 5px
    width: 100%
    outline: 0
    border: 1px solid alpha(main-color, 0.35)
    background-color: white
    color: main-color
    font-size: 14px
    transition: 0.3s
    default-font()

    &:hover
      background-color: hover-color
      color: white
</style>
