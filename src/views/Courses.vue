<template>
  <base-layout>
    <div slot="menu">
      <router-link to="/courses/add">Add Course</router-link>
      <button @click="importCoursesFromXML()">Import XML Courses</button>
      <router-link to="/dashboard" class="back">Back</router-link>
    </div>
    <div is="transition-group" slot="main" class="main" name="fade">
      <router-link
        v-for="course of courses"
        :key="course._id"
        :to="'/courses/update/' + course._id"
        class="card"
        tag="div"
      >
        <h1>{{ course.name }}</h1>
        <p>Length: {{ course.length }}km &emsp; Climb: {{ course.climb }}m &emsp;</p>
        <p>Number of Entrants: {{ course.noOfEntrants }}</p>
        <p>Controls: {{ course.controls.toString() }}</p>
      </router-link>
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
    refresh: 0,
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
  },

  methods: {
    refreshView: function () { this.refresh += 1 },

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
                this.refreshView()
                this.$messages.addMessage(result.length + ' Courses Imported')
              })
              .catch(error => this.$messages.addMessage(error.message, 'error'))
          }
        }
      )
    },
  },

  asyncComputed: {
    courses: {
      get () {
        const database = this.$database
        return database.getCoursesData()
          .then(data => data.map(async course => {
            course.noOfEntrants = await database.competitorsOnCourse(course.name)
            return course
          }))
          .then(data => Promise.all(data))
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      },
      watch () { this.refresh },
    },
  },
}
</script>
