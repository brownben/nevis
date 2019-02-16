<template>
  <base-layout>
    <template v-slot:menu>
      <router-link to="/entries/add">Add Entry</router-link>
      <button @click="importEntriesFromXML()">Import IOF XML</button>
      <button @click="deleteAllEntries()">Delete All Entries</button>
      <router-link to="/dashboard" class="back">Back</router-link>
    </template>
    <template v-slot:main>
      <div class="card">
        <label>Name:</label>
        <input v-model="name">
        <label>SI Card Number:</label>
        <input v-model="siid">
        <label>Course:</label>
        <dropdown-input v-model="course" :list="courses"/>
      </div>
      <div v-if="competitors && competitors.length > 0" class="card">
        <table>
          <thead>
            <tr>
              <th @click="sortBy('name')">Name
                <up-down-arrows :active=" sortByField == 'name'" :ascending="!reverseSort"/>
              </th>
              <th @click="sortBy('siid')">SI Card
                <up-down-arrows :active=" sortByField == 'siid'" :ascending="!reverseSort"/>
              </th>
              <th @click="sortBy('course')">Course
                <up-down-arrows :active=" sortByField == 'course'" :ascending="!reverseSort"/>
              </th>
            </tr>
          </thead>
          <tbody is="transition-group" name="fade">
            <router-link
              v-for="competitor of competitors"
              :key="competitor._id"
              :to="'/entries/update/' + competitor._id"
              tag="tr"
            >
              <td>{{ competitor.name }}</td>
              <td>{{ competitor.siid }}</td>
              <td>{{ competitor.course }}</td>
            </router-link>
          </tbody>
        </table>
      </div>
      <transition name="open">
        <confirmation-dialog
          v-if="showConfirmationDialog"
          v-model="confirmationDecision"
          heading="Delete All Entries"
          message="Are You Sure You Want to Delete All Entries and Attatched Downloads? This Action can't be Recovered."
          confirm="Delete All"
          cancel="Cancel"
          :showing="showConfirmationDialog"
          @close="confirmationOfDeleteAllEntries()"
        />
      </transition>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import DropdownInput from '@/components/DropdownInput'
import UpDownArrows from '@/components/UpDownArrows'
import Dialog from '@/components/Dialog'

export default {
  components: {
    'base-layout': BaseLayout,
    'dropdown-input': DropdownInput,
    'confirmation-dialog': Dialog,
    'up-down-arrows': UpDownArrows,
  },

  data: () => ({
    name: '',
    siid: '',
    course: '',
    sortByField: 'name',
    reverseSort: false,
    refresh: 0,
    showConfirmationDialog: false,
    confirmationDecision: false,
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
  },

  methods: {
    refreshView: function () { this.refresh += 1 },

    sortBy: function (field) {
      if (this.sortByField === field) this.reverseSort = !this.reverseSort
      this.sortByField = field
    },

    importEntriesFromXML: function () {
      const { app, dialog } = this.$electron.remote
      dialog.showOpenDialog(
        {
          title: 'Nevis - Import Entries',
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
              .then(data => this.$database.importCompetitorsFromXML(data))
              .then(async result => {
                this.$messages.addMessage(result.noOfCompetitors + ' Competitors Imported')
                const nonExistantCourses = await this.$database.checkCoursesExist(result.courses)
                nonExistantCourses.forEach(course => this.$messages.addMessage('No Course called ' + course + ' Exists', 'warning'))
                this.refreshView()
              })
              .catch(error => this.$messages.addMessage(error.message, 'error'))
          }
        }
      )
    },

    deleteAllEntries: function () { this.showConfirmationDialog = true },

    confirmationOfDeleteAllEntries: function () {
      this.showConfirmationDialog = false
      if (this.confirmationDecision) {
        this.$database.deleteAllCompetitors()
          .then(() => {
            this.refresh += 1
            this.$messages.addMessage('All Entries Deleted')
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
    },
  },

  asyncComputed: {
    competitors: {
      get () {
        return this.$database.searchCompetitors(this.name, this.siid, this.course, this.sortByField, this.reverseSort)
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      },
      watch () { this.refresh },
    },

    courses: {
      get () {
        return this.$database.getCourses()
          .then(data => {
            let courses = data.map(course => course.doc.name)
            courses.unshift('')
            return courses
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      },
      watch () { this.refresh },
    },
  },
}
</script>
