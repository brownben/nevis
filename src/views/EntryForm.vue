<template>
  <base-layout>
    <div slot="menu">
      <div v-if="$route.params.id">
        <button @click="updateEntry">Update Entry</button>
        <button @click="deleteEntry">Delete Entry</button>
      </div>
      <div v-else>
        <button @click="addEntry">Submit Entry</button>
        <button @click="clearEntry">Clear Entry</button>
      </div>
      <a class="back" @click="$router.go(-1)">Back</a>
    </div>
    <div slot="main" class="main">
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
        <dropdown-input :list="courses" :initial="competitor.course" @changed="dropdownChanged"/>
        <checkbox-input
          :state="competitor.nonCompetitive"
          label="Non-Competitive?"
          @changed="checkboxChanged"
        />
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout.vue'
import DropdownInput from '@/components/DropdownInput.vue'
import CheckboxInput from '@/components/CheckboxInput.vue'

export default {
  components: {
    'base-layout': BaseLayout,
    'dropdown-input': DropdownInput,
    'checkbox-input': CheckboxInput,
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

  }),
  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.clearMessages()
      this.$messages.addMessage('Error: Not Connected to the Database', 'error')
    }
    this._id = this.$route.params.id
    if (this._id) {
      this.$database.findCompetitor(this._id)
        .then(data => {
          this.competitor = data
          this._rev = data._rev
        })
        .catch(error => this.$messages.addMessage('Error: ' + error.message, 'error'))
    }
  },
  methods: {
    dropdownChanged: function (value) { this.competitor.course = value },
    checkboxChanged: function (value) { this.competitor.nonCompetitive = value },

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
          .catch(error => {
            if (error.message === 'Document update conflict') this.$messages.addMessage('Error: A Competitor with this SI Card already exists', 'error')
            else this.$messages.addMessage('Error: ' + error.message, 'error')
          })
      }
      else this.$messages.addMessage('Error: Please set the Competitors Name or SI Card', 'error')
    },

    updateEntry: function () {
      this.$database.updateCompetitor(this.competitor, this._id, this._rev)
        .then(() => this.$router.go(-1))
        .catch(error => this.$messages.addMessage('Error: ' + error.message, 'error'))
    },

    deleteEntry: function () {
      this.$database.deleteCompetitor(this._id)
        .then(() => {
          this.$router.go(-1)
          this.$messages.addMessage('Entry Deleted', 'info')
        })
        .catch(error => this.$messages.addMessage('Error: ' + error.message, 'error'))
    },
  },
}
</script>
