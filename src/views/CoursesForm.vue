<template>
  <base-layout>
    <div slot="menu">
      <div v-if="$route.params.id">
        <button @click="updateCourse">Update Course</button>
        <button @click="deleteCourse">Delete Course</button>
      </div>
      <div v-else>
        <button @click="addCourse">Submit Course</button>
        <button @click="clearCourse">Clear Course</button>
      </div>
      <a class="back" @click="$router.go(-1)">Back</a>
    </div>
    <div slot="main" class="main">
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
    _id: '',
    _rev: '',
    course: {
      name: '',
      length: 0,
      climb: 0,
      controls: '',
    },
  }),
  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.clearMessages()
      this.$messages.addMessage('Error: Not Connected to the Database', 'error')
    }
    this._id = this.$route.params.id
    if (this._id) {
      this.$database.findCourse(this._id)
        .then(data => {
          this.course = data
          this._rev = data._rev
        })
        .catch(error => this.$messages.addMessage('Error: ' + error.message, 'error'))
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
      if (this.name !== '') {
        this.$database.addCourse(this.course)
          .then(() => this.clearCourse())
          .catch(error => {
            if (error.message === 'Document update conflict') this.$messages.addMessage('Error: A Course with this Name already exists', 'error')
            else this.$messages.addMessage('Error: ' + error.message, 'error')
          })
      }
      else this.$messages.addMessage('Error: Please give the Course a Name', 'error')
    },

    updateCourse: function () {
      this.$database.updateCourse(this.course, this._id, this._rev)
        .then(() => this.$router.go(-1))
        .catch(error => this.$messages.addMessage('Error: ' + error.message, 'error'))
    },

    deleteCourse: function () {
      this.$database.deleteCourse(this._id)
        .then(() => {
          this.$router.go(-1)
          this.$messages.addMessage('Course Deleted', 'info')
        })
        .catch(error => this.$messages.addMessage('Error: ' + error.message, 'error'))
    },
  },
}
</script>
