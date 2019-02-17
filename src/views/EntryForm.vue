<template>
  <base-layout>
    <template v-slot:menu>
      <div v-if="$route.params.id">
        <button @click="updateEntry">Update Entry</button>
        <button @click="deleteEntry">Delete Entry</button>
      </div>
      <div v-else>
        <button @click="addEntry">Submit Entry</button>
        <button @click="clearEntry">Clear Entry</button>
      </div>
      <a class="back" @click="$router.go(-1)">Back</a>
    </template>
    <template v-slot:main>
      <div class="card">
        <label>Name:</label>
        <input v-model="competitor.name">
        <label>SI Card Number:</label>
        <input v-model="competitor.siid">
        <label>Membership Number:</label>
        <input v-model="competitor.membershipNumber">
        <label>Age Class:</label>
        <input v-model="competitor.ageClass">
        <label>Club:</label>
        <input v-model="competitor.club">
        <label>Course:</label>
        <dropdown-input v-model="competitor.course" :list="courses"/>
        <checkbox-input v-model="competitor.nonCompetitive" label="Non-Competitive?"/>
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
              <td/>
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
      <transition name="open">
        <confirmation-dialog
          v-if="showConfirmationDialog"
          v-model="confirmationDecision"
          heading="Delete Entry"
          message="Are You Sure You Want to Delete This Entry and any Attahced Downloads? This Action can't be Recovered."
          confirm="Delete"
          cancel="Cancel"
          :showing="showConfirmationDialog"
          @close="confirmationOfDeleteEntry()"
        />
      </transition>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import DropdownInput from '@/components/DropdownInput'
import CheckboxInput from '@/components/CheckboxInput'
import Dialog from '@/components/Dialog'
import time from '@/scripts/time'

export default {
  components: {
    'base-layout': BaseLayout,
    'dropdown-input': DropdownInput,
    'checkbox-input': CheckboxInput,
    'confirmation-dialog': Dialog,
  },

  data: () => ({
    competitor: {
      name: '',
      siid: '',
      ageClass: '',
      club: '',
      course: '',
      membershipNumber: '',
      nonCompetitive: false,
    },
    _id: '',
    _rev: '',
    courses: [],
    showConfirmationDialog: false,
    confirmationDecision: false,
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
          .then(() => this.clearEntry())
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
      else this.$messages.addMessage('Please set the Competitors Name or SI Card', 'error')
    },

    updateEntry: function () {
      this.$database.updateCompetitor(this.competitor, this._id, this._rev)
        .then(() => {
          this.$router.go(-1)
          this.$messages.addMessage('Entry Updated', 'info')
        })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },

    deleteEntry: function () { this.showConfirmationDialog = true },

    confirmationOfDeleteEntry: function () {
      this.showConfirmationDialog = false
      if (this.confirmationDecision) {
        this.$database.deleteCompetitor(this._id)
          .then(() => {
            this.$router.go(-1)
            this.$messages.addMessage('Entry Deleted', 'info')
          })
          .catch(error => this.$messages.addMessage(error.message, 'error'))
      }
    },
  },

  asyncComputed: {
    courses: function () {
      return this.$database.getCourses()
        .then(data => {
          let courses = data.map(course => course.doc.name)
          courses.unshift('')
          return courses
        })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },
  },
}
</script>
