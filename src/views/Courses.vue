<template>
  <main>
    <back-arrow />
    <h1 class="title">Courses</h1>
    <div>
      <router-link to="/courses/add" class="button">Add Course</router-link>
      <button class="button" @click="importCoursesFromXML()">Import XML Courses</button>
      <button class="button" @click="deleteAllCourses()">Delete All Courses</button>
    </div>
    <router-link
      v-for="course of courses"
      :key="course._id"
      :to="'/courses/update/' + course._id"
      class="card course"
      tag="div"
    >
      <h1>{{ course.name }}</h1>
      <p>
        <b>Length:</b>
        {{ course.length }}km &emsp;
        <b>Climb:</b>
        {{ course.climb }}m &emsp;
      </p>
      <p>
        <b>Number of Entrants:</b>
        {{ course.noOfEntrants }}
      </p>
      <p>
        <b>Controls:</b>
        {{ course.controls.toString() }}
      </p>
    </router-link>
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        heading="Delete All Courses"
        message="Are You Sure You Want to Delete All Courses? This Action can't be Recovered."
        confirm="Delete All"
        cancel="Cancel"
        @close="confirmationOfDeleteAllCourses"
      />
    </transition>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import Dialog from '@/components/Dialog'

export default {
  components: {
    'confirmation-dialog': Dialog,
    'back-arrow': BackArrow,
  },

  data: () => ({
    showConfirmationDialog: false,
    courses: [],
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
    this.getCourses()
  },

  methods: {
    importCoursesFromXML: function () {
      const { app, dialog } = this.$electron.remote
      dialog.showOpenDialog(
        {
          title: 'Nevis - Import Courses',
          buttonLabel: 'Import',
          defaultPath: app.getPath('documents'),
          properties: ['openFile'],
          filters: [
            { name: 'IOF XML 3.0', extensions: ['xml'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        },
        filePath => {
          if (filePath && filePath[0]) {
            this.$node.fs.promises.readFile(filePath[0], { encoding: 'UTF8', flag: 'r' })
              .catch(() => this.$messages.addMessage('Problem Reading File', 'error'))
              .then(data => this.$database.importCoursesFromXML(data))
              .then(result => {
                this.getCourses()
                this.$messages.addMessage(result.length + ' Courses Imported')
              })
              .catch(error => this.$messages.addMessage(error.message, 'error'))
          }
        }
      )
    },

    deleteAllCourses: function () { this.showConfirmationDialog = true },

    confirmationOfDeleteAllCourses: function (decision) {
      this.showConfirmationDialog = false
      if (decision) {
        this.$database.deleteAllCourses()
          .then(() => {
            this.getCourses()
            this.$messages.addMessage('All Courses Deleted')
            this.$messages.addMessage('All Competitors will have no Assigned Course', 'warning')
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
    },

    getCourses: function () {
      this.$database.getCoursesData()
        .then(data => data.map(async course => {
          course.noOfEntrants = await this.$database.competitorsOnCourse(course.name)
          return course
        }))
        .then(data => Promise.all(data))
        .then(result => { this.courses = result })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },
  },
}
</script>
<style lang="stylus" scoped>
.card
  h1
    padding: 0 0 0.25rem
    font-size: 1.8rem

  p
    padding: 0.1rem 0
</style>
