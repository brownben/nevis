<template>
  <main>
    <back-arrow />
    <h1 v-if="$route.params.id" class="title">Update Course</h1>
    <h1 v-else class="title">Create Course</h1>
    <div v-if="$route.params.id">
      <button class="button" @click="updateCourse">Update Course</button>
      <button class="button" @click="deleteCourse">Delete Course</button>
    </div>
    <div v-else>
      <button class="button" @click="addCourse">Submit Course</button>
      <button class="button" @click="clearCourse">Clear Course</button>
    </div>
    <div class="card input">
      <text-input v-model="course.name" label="Name:" />
      <number-input v-model.number="course.length" label="Length (km):" type="number" />
      <number-input v-model.number="course.climb" label="Climb (m):" type="number" />
      <text-input v-model="course.controls" label="Control Codes (Comma Separated):" />
    </div>
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        heading="Delete Course"
        message="Are You Sure You Want to Delete This Course? This Action can't be Recovered."
        confirm="Delete"
        cancel="Cancel"
        @close="confirmationOfDeleteCourse"
      />
    </transition>
  </main>
</template>
<style lang="stylus" scoped>
label
  width: 150px
  font-weight: 500

input
  width: calc(100% - 150px)
</style>

<script>
import Dialog from '@/components/Dialog'
import TextInput from '@/components/TextInput'
import NumberInput from '@/components/NumberInput'
import BackArrow from '@/components/BackArrow'

export default {
  components: {
    'confirmation-dialog': Dialog,
    'text-input': TextInput,
    'number-input': NumberInput,
    'back-arrow': BackArrow,
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
          this.course.name = data.name
          this.course.length = parseInt(data.length)
          this.course.climb = parseInt(data.climb)
          this.course.controls = data.controls.toString()
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
          .then(() => {
            this.$messages.addMessage('Course - ' + this.course.name + 'Created')
            this.clearCourse()
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
      else this.$messages.addMessage('Please Provide a Name for the Course', 'error')
    },

    updateCourse: function () {
      this.$database.updateCourse(this.course, this._id, this._rev)
        .then(() => {
          this.$messages.addMessage('Course - ' + this.course.name + 'Update')
          this.$router.go(-1)
        })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },

    deleteCourse: function () { this.showConfirmationDialog = true },

    confirmationOfDeleteCourse: function (decision) {
      this.showConfirmationDialog = false
      if (decision) {
        this.$database.deleteCourse(this._id)
          .then(message => {
            if (typeof message === 'string' && message.includes('Warning:')) this.$messages.addMessage(message, 'warning')
            this.$router.go(-1)
            this.$messages.addMessage('Course - ' + this.course.name + 'Deleted')
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
    },
  },
}
</script>
