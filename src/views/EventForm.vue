<template>
  <main>
    <back-arrow />
    <h1 v-if="currentRoute === '/event/add'" class="title">Create Event</h1>
    <h1 v-if="currentRoute === '/event/edit'" class="title">Edit Event</h1>
    <h1 v-if="currentRoute === '/event/restore'" class="title">Restore Event</h1>
    <div v-if="currentRoute === '/event/add' ||currentRoute === '/event/edit'">
      <button v-if="currentRoute === '/event/add'" class="button" @click="createEvent">Create Event</button>
      <button v-if="currentRoute === '/event/edit'" class="button" @click="updateEvent">Update Event</button>
      <button v-if="currentRoute === '/event/edit'" class="button" @click="backupEvent">Backup Event</button>
      <button v-if="currentRoute === '/event/edit'" class="button" @click="deleteEvent">Delete Event</button>
    </div>
    <div class="card input">
      <template v-if="currentRoute === '/event/add' || currentRoute === '/event/edit'">
        <text-input v-model="name" label="Name:" />
        <text-input v-model="date" label="Date:" />
      </template>
      <template v-if="currentRoute === '/event/add' || currentRoute === '/event/restore'">
        <text-input v-model="server" label="Server Hostname:" />
        <text-input v-model="eventID" label="Event ID:" />
      </template>
      <template v-if="currentRoute === '/event/restore'">
        <button class="file-select" @click="selectBackupLocation">Select File Location</button>
        <text-input v-model="backupLocation" label="File Location:" />
        <checkbox-input v-model="override" label="Override Event if it Already Exists?" />
      </template>
    </div>
    <div>
      <button
        v-if="currentRoute === '/event/restore'"
        class="button"
        @click="restoreEvent"
      >
        Restore Event
      </button>
    </div>
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        heading="Delete Event"
        message="Are You Sure You Want to Delete This Event? This Action can't be Recovered."
        confirm="Delete"
        cancel="Cancel"
        @close="confirmationOfDeleteEvent"
      />
    </transition>
  </main>
</template>

<script>
import TextInput from '@/components/TextInput'
import CheckboxInput from '@/components/CheckboxInput'
import BackArrow from '@/components/BackArrow'
import Dialog from '@/components/Dialog'

export default {
  components: {
    'confirmation-dialog': Dialog,
    'text-input': TextInput,
    'checkbox-input': CheckboxInput,
    'back-arrow': BackArrow,
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
      if (this.eventID.toLowerCase() === 'archive') this.$messages.addMessage('Event ID can\'t be "archive"', 'error')
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
@import '../assets/styles/helpers'

.card.input
  display: relative

.file-select
  position: absolute
  top: -2.75rem
  right: 0
  padding: 0 0.5rem
  height: 2.7rem
  outline: 0
  border: 0
  background: white
  font-size: 1rem
  transition: 0.3s

  &:hover
    background-color: main-color
    color: white
</style>

