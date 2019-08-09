<template>
  <main>
    <back-arrow />
    <h1 class="title">Entries</h1>
    <div>
      <router-link to="/entries/add" class="button">Create Entry</router-link>
      <button class="button" @click="importEntriesFromXML()">Import Entries from IOF XML</button>
      <button class="button" @click="deleteAllEntries()">Delete All Entries</button>
    </div>
    <div class="card input">
      <h2 id="search-title">Search</h2>
      <text-input v-model="name" label="Name:" @input="getEntries()" />
      <text-input v-model="siid" label="SI Card:" @input="getEntries()" />
      <dropdown-input v-model="course" :list="courses" label="Course:" @input="getEntries()" />
    </div>
    <div v-if="competitors && competitors.length > 0" class="card">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('name')">
              Name
              <up-down-arrows :active=" sortByField == 'name'" :ascending="!reverseSort" />
            </th>
            <th @click="sortBy('siid')">
              SI Card
              <up-down-arrows :active=" sortByField == 'siid'" :ascending="!reverseSort" />
            </th>
            <th @click="sortBy('course')">
              Course
              <up-down-arrows :active=" sortByField == 'course'" :ascending="!reverseSort" />
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
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        heading="Delete All Entries"
        message="Are You Sure You Want to Delete All Entries and Attatched Downloads? This Action can't be Recovered."
        confirm="Delete All"
        cancel="Cancel"
        @close="confirmationOfDeleteAllEntries"
      />
    </transition>
  </main>
</template>

<script>
import TextInput from '@/components/TextInput'
import DropdownInput from '@/components/DropdownInput'
import UpDownArrows from '@/components/UpDownArrows'
import Dialog from '@/components/Dialog'
import BackArrow from '@/components/BackArrow'

export default {
  components: {
    'dropdown-input': DropdownInput,
    'confirmation-dialog': Dialog,
    'up-down-arrows': UpDownArrows,
    'text-input': TextInput,
    'back-arrow': BackArrow,
  },

  data: () => ({
    name: '',
    siid: '',
    course: '',
    competitors: [],
    courses: [],
    sortByField: 'name',
    reverseSort: true,
    showConfirmationDialog: false,
  }),

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
    this.getEntries()
    this.getCourses()
  },

  methods: {
    sortBy: function (field) {
      if (this.sortByField === field) this.reverseSort = !this.reverseSort
      this.sortByField = field
      this.getEntries()
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
                this.getEntries()
              })
              .catch(error => this.$messages.addMessage(error.message, 'error'))
          }
        }
      )
    },

    deleteAllEntries: function () { this.showConfirmationDialog = true },

    confirmationOfDeleteAllEntries: function (decision) {
      this.showConfirmationDialog = false
      if (decision) {
        this.$database.deleteAllCompetitors()
          .then(() => {
            this.getEntries()
            this.$messages.addMessage('All Entries Deleted')
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
    },

    getEntries: function () {
      this.$database.searchCompetitors(this.name, this.siid, this.course, this.sortByField, this.reverseSort)
        .then(result => { this.competitors = result })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },

    getCourses: function () {
      this.$database.getCourses()
        .then(data => {
          let courses = data.map(course => course.doc.name)
          courses.unshift('')
          return courses
        })
        .then(result => { this.courses = result })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },
  },
}
</script>
<style lang="stylus" scoped>
@import '../assets/styles/helpers'

#search-title
  padding: 0.75rem 0.75rem 0
  color: main-color

.fade-item
  transition: all 0.3s ease-out

.fade-move
  transition: all 0.3s ease-out

.fade-enter, .fade-leave-to
  opacity: 0

.fade-enter-active, .fade-leave-to-active
  opacity: 0
</style>
