<template>
  <main>
    <back-arrow />
    <h1 v-if="$route.params.id" class="title">Update Entry</h1>
    <h1 v-else class="title">Create Entry</h1>
    <div v-if="$route.params.id">
      <button class="button" @click="updateEntry">Update Entry</button>
      <button class="button" @click="deleteEntry">Delete Entry</button>
    </div>
    <div v-else>
      <button class="button" @click="addEntry">Submit Entry</button>
      <button class="button" @click="clearEntry">Clear Entry</button>
    </div>
    <div class="card input">
      <text-input v-model="competitor.name" label="Name:" />
      <text-input v-model="competitor.siid" label="SI Card Number:" />
      <text-input v-model="competitor.membershipNumber" label="Membership No:" />
      <text-input v-model="competitor.ageClass" label="Age Class:" />
      <text-input v-model="competitor.club" label="Club:" />
      <dropdown-input v-model="competitor.course" :list="courses" label="Course:" />
      <checkbox-input v-model="competitor.nonCompetitive" label="Non-Competitive?" />
    </div>
    <div v-if="_id && competitor.download" class="card">
      <h2>Download</h2>
      <p>Time: {{ time }}</p>
      <p>Start: {{ timeActual(competitor.download.start) || 'MS' }}</p>
      <p>Finish: {{ timeActual(competitor.download.finish) || 'MF' }}</p>
    </div>
    <div v-if="_id && competitor.splits" class="card">
      <h2>Splits</h2>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Control Code</th>
            <th>Leg Split</th>
            <th>Elapsed Time</th>
            <th>Punch Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>S</td>
            <td />
            <td>00:00</td>
            <td>00:00</td>
            <td>{{ timeActualSplit(competitor.download.start) }}</td>
          </tr>
          <tr v-for="split of competitor.splits" :key="competitor.splits.indexOf(split)">
            <td>{{ split.number }}</td>
            <td>{{ split.control }}</td>
            <td>{{ timeElapsedSplit(split.splitTime) }}</td>
            <td>{{ timeElapsedSplit(split.elapsedTime) }}</td>
            <td>{{ timeActualSplit(split.punchTime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        heading="Delete Entry"
        message="Are You Sure You Want to Delete This Entry and any Attahced Downloads? This Action can't be Recovered."
        confirm="Delete"
        cancel="Cancel"
        @close="confirmationOfDeleteEntry()"
      />
    </transition>
  </main>
</template>

<script>
import TextInput from '@/components/TextInput'
import DropdownInput from '@/components/DropdownInput'
import CheckboxInput from '@/components/CheckboxInput'
import Dialog from '@/components/Dialog'
import BackArrow from '@/components/BackArrow'
import time from '@/scripts/time'

export default {
  components: {
    'text-input': TextInput,
    'dropdown-input': DropdownInput,
    'checkbox-input': CheckboxInput,
    'confirmation-dialog': Dialog,
    'back-arrow': BackArrow,
  },

  data: () => ({
    competitor: {
      name: '',
      siid: '',
      ageClass: '',
      club: '',
      course: '',
      courses: [],
      membershipNumber: '',
      nonCompetitive: false,
    },
    _id: '',
    _rev: '',
    courses: [],
    showConfirmationDialog: false,
  }),

  computed: {
    time: function () {
      if (this._id && this.competitor.download) return this.timeElapsed(this.competitor.result)
      else return ''
    },
  },

  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
    this.getCourses()
    this._id = this.$route.params.id
    if (this._id) {
      this.$database.findCompetitor(this._id)
        .then(data => {
          this.competitor = data
          this._rev = data._rev
        })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    }
  },

  methods: {
    timeActual: timeValue => time.displayActualTime(timeValue),
    timeActualSplit: timeValue => time.displayActualTime(timeValue) || '--:--',
    timeElapsed: timeValue => time.displayTime(timeValue),
    timeElapsedSplit: timeValue => time.displayTime(timeValue) || '--:--',

    clearEntry: function () {
      this._id = ''
      this._rev = ''
      this.competitor = {
        name: '',
        siid: '',
        ageClass: '',
        club: '',
        course: '',
        membershipNumber: '',
        nonCompetitive: false,
      }
    },

    addEntry: function () {
      if (this.name !== '' || this.siid !== '') {
        this.$database.addCompetitor(this.competitor)
          .then(() => {
            this.$messages.addMessage('Entry Created for ' + this.competitor.name)
            this.clearEntry()
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
      else this.$messages.addMessage('Please set the Competitors Name or SI Card', 'error')
    },

    updateEntry: function () {
      this.$database.updateCompetitor(this.competitor, this._id, this._rev)
        .then(() => {
          this.$router.go(-1)
          this.$messages.addMessage('Entry for ' + this.competitor.name + ' Updated', 'info')
        })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },

    deleteEntry: function () { this.showConfirmationDialog = true },

    confirmationOfDeleteEntry: function (decision) {
      this.showConfirmationDialog = false
      if (decision) {
        this.$database.deleteCompetitor(this._id)
          .then(() => {
            this.$router.go(-1)
            this.$messages.addMessage('Entry for ' + this.competitor.name + ' Deleted', 'info')
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
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
h2
  padding-bottom: 0.35rem

p
  padding: 0.2rem 0
</style>
