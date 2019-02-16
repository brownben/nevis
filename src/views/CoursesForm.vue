<template>
  <base-layout>
    <template v-slot:menu>
      <div v-if="$route.params.id">
        <button @click="updateCourse">Update Course</button>
        <button @click="deleteCourse">Delete Course</button>
      </div>
      <div v-else>
        <button @click="addCourse">Submit Course</button>
        <button @click="clearCourse">Clear Course</button>
      </div>
      <a class="back" @click="$router.go(-1)">Back</a>
    </template>
    <template v-slot:main>
      <div class="card">
        <label>Name:</label>
        <input v-model="course.name">
        <label>Length (km):</label>
        <input v-model="course.length" type="number" step="0.01" min="0">
        <label>Climb (m):</label>
        <input v-model="course.climb" type="number" step="0.01" min="0">
        <label>Control Codes: (Comma Separated)</label>
        <input v-model="course.controls">
      </div>
      <transition name="open">
        <confirmation-dialog
          v-if="showConfirmationDialog"
          v-model="confirmationDecision"
          heading="Delete Course"
          message="Are You Sure You Want to Delete This Course? This Action can't be Recovered."
          confirm="Delete"
          cancel="Cancel"
          :showing="showConfirmationDialog"
          @close="confirmationOfDeleteCourse()"
        />
      </transition>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import Dialog from '@/components/Dialog'

export default {
  components: {
    'base-layout': BaseLayout,
    'confirmation-dialog': Dialog,
  },

  data: () => ({
    _id: '',
    _rev: '',
    course: {
      name: '',
      length: 0,
      climb: 0,
      controls: '',
    },
    showConfirmationDialog: false,
    confirmationDecision: false,
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
    this._id = this.$route.params.id
    if (this._id) {
      this.$database.findCourse(this._id)
        .then(data => {
          this.course = data
          this.course.controls = this.course.controls.toString()
          this._rev = data._rev
        })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    }
  },

  methods: {
    clearCourse: function () {
      this._id = ''
      this._rev = ''
      this.course = {
        name: '',
        length: 0,
        climb: 0,
        controls: '',
      }
    },

    addCourse: function () {
      if (this.course.name !== '') {
        this.$database.addCourse(this.course)
          .then(() => this.clearCourse())
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
      else this.$messages.addMessage('Please give the Course a Name', 'error')
    },

    updateCourse: function () {
      this.$database.updateCourse(this.course, this._id, this._rev)
        .then(() => this.$router.go(-1))
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },

    deleteCourse: function () { this.showConfirmationDialog = true },

    confirmationOfDeleteCourse: function () {
      this.showConfirmationDialog = false
      if (this.confirmationDecision) {
        this.$database.deleteCourse(this._id)
          .then(message => {
            if (typeof message === 'string' && message.includes('Warning:')) this.$messages.addMessage(message, 'warning')
            this.$router.go(-1)
            this.$messages.addMessage('Course Deleted', 'info')
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
    },
  },
}
</script>
