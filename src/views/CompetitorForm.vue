<template>
  <main>
    <h1 class="mx-10 mb-1">
      <template v-if="$route.path.includes('create')">
        <back-arrow
          :to="`/events/${$route.params.eventId}/competitors`"
        />Create Entry
      </template>
      <template v-else> <back-arrow />Update Entry </template>
    </h1>
    <div v-if="$route.path.includes('create')" class="mx-12 mb-3">
      <button @click="submit" class="button">Create Entry</button>
      <button v-if="$archive.connected" @click="searchArchive" class="button">
        Search Archive
      </button>
      <button @click="clearForm" class="button">Clear Form</button>
    </div>
    <div v-else class="mx-12 mb-3">
      <button @click="submit" class="button">Update Entry</button>
      <button @click="showDeleteConfirmationDialog = true" class="button">
        Delete Entry
      </button>
    </div>
    <form @submit.prevent="submit" class="shadow mx-12 mb-3">
      <text-input v-model.trim="competitor.name" label="Name:" />
      <text-input v-model.trim="competitor.siid" label="SI Card: " />
      <text-input
        v-model.trim="competitor.membershipNumber"
        label="Membership Number:"
      />
      <text-input v-model.trim="competitor.ageClass" label="Age Class:" />
      <text-input v-model.trim="competitor.club" label="Club:" />
      <dropdown-input
        v-model="competitor.course"
        :list="listOfCourses"
        label="Course:"
      />
      <checkbox-input
        v-model="competitor.nonCompetitive"
        label="Non-Competitive?"
      />
    </form>
    <div v-if="punches.length > 0" class="mx-12 mb-3 shadow px-3 pt-2 pb-2">
      <h2>Punches</h2>
      <table class="w-full font-body">
        <tr class="font-heading text-center hover:bg-blue-light">
          <th>Control Code</th>
          <th>Time</th>
        </tr>
        <tr
          v-for="punch of punches"
          :key="punch.id"
          class="text-center even:bg-blue-lightest hover:bg-blue-light"
        >
          <td>{{ punch.controlCode }}</td>
          <td>{{ time.displayActualTime(punch.time) }}</td>
        </tr>
      </table>
    </div>
    <transition name="fade">
      <confirmation-dialog
        v-if="showDeleteConfirmationDialog"
        @close="onDeleteConfirm"
        heading="Delete Entry"
        message="Are You Sure You Want to Delete This Entry and Any Attatched Downloads? This Action Can't Be Recovered."
        confirm="Delete"
        cancel="Cancel"
      />
    </transition>
    <transition name="fade">
      <archive-dialog
        v-if="showArchiveDialog"
        :list-of-records="archiveData"
        @close="onArchiveSelect"
      />
    </transition>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import TextInput from '@/components/TextInput'
import DropdownInput from '@/components/DropdownInput'
import CheckboxInput from '@/components/CheckboxInput'
import ConfirmationDialog from '@/components/ConfirmationDialog'
import ArchiveDialog from '@/components/ArchiveDialog'

import timeFunctions from '@/scripts/time'
import ageClassFunctions from '@/scripts/ageClass'
import courseMatching from '@/scripts/courseMatching/courseMatching'

export default {
  components: {
    'back-arrow': BackArrow,
    'text-input': TextInput,
    'dropdown-input': DropdownInput,
    'checkbox-input': CheckboxInput,
    'confirmation-dialog': ConfirmationDialog,
    'archive-dialog': ArchiveDialog,
  },

  data: function() {
    return {
      showDeleteConfirmationDialog: false,
      showArchiveDialog: false,
      competitor: {
        name: '',
        id: undefined,
        siid: '',
        membershipNumber: '',
        ageClass: '',
        club: '',
        course: '',
        downloaded: false,
        nonCompetitive: false,
      },
      courses: [],
      punches: [],
      archiveData: [],
      time: timeFunctions,
      originalCourse: '',
    }
  },

  computed: {
    listOfCourses: function() {
      if (this.courses && typeof this.courses.map === 'function')
        return this.courses.map(course => course.name)
      else return []
    },
  },

  mounted: function() {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    } else if (this.$route.params && this.$route.params.competitorId)
      this.getCompetitorDetails()
    else this.getCourses()
  },

  methods: {
    submit: async function() {
      if (this.competitor.name === '')
        this.$messages.addMessage('Please Enter a Name', 'error')
      else if (
        (await this.checkForDuplicateSIID()) &&
        this.competitor.siid !== ''
      ) {
        this.$messages.addMessage(
          'An Entry with that SI Card Already Exists',
          'error'
        )
      } else if (
        !this.competitor.siid.match(/^[0-9]{1,7}$/) &&
        this.competitor.siid !== ''
      ) {
        this.$messages.addMessage(
          'Please Enter a Valid SI Card Number',
          'error'
        )
      } else if (this.competitor.course === '')
        this.$messages.addMessage('Please Select a Course', 'error')
      else if (this.competitor.id) this.updateCompetitor()
      else this.createCompetitor()
    },

    getCompetitorDetails: function() {
      return this.$database
        .query(
          'SELECT * FROM competitors WHERE id=? LIMIT 1',
          this.$route.params.competitorId
        )
        .then(async result => {
          if (result && result[0]) {
            this.competitor = result[0]
            this.competitor.course = await this.getCourseNameFromId(
              result[0].course
            )
            this.originalCourse = this.competitor.course
            if (this.competitor.downloaded) this.getCompetitorPunches()
          } else
            this.$messages.addMessage('Problem Fetching Entry Data', 'error')
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Entry Data', 'error')
        )
    },

    getCourses: function() {
      return this.$database
        .query(
          'SELECT * FROM courses WHERE event=?',
          this.$route.params.eventId
        )
        .then(result => {
          this.courses = result
          if (this.courses.length === 0)
            this.$messages.addMessage('No Courses Exist', 'warning')
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Courses', 'error')
        )
    },

    getCompetitorPunches: function() {
      return this.$database
        .query(
          'SELECT * FROM punches WHERE competitor=? ORDER BY time',
          this.competitor.id
        )
        .then(result => {
          this.punches = result
        })
        .catch(() =>
          this.$messages.addMessage(
            'Problem Fetching Competitors Punches',
            'error'
          )
        )
    },

    createCompetitor: function() {
      return this.$database
        .query('INSERT INTO competitors SET ?', {
          name: this.competitor.name,
          event: this.$route.params.eventId,
          siid: this.competitor.siid,
          membershipNumber: this.competitor.membershipNumber,
          ageClass: this.competitor.ageClass,
          club: this.competitor.club,
          course: this.getCourseIdFromName(this.competitor.course),
          downloaded: false,
          nonCompetitive: this.competitor.nonCompetitive,
        })
        .then(() => this.$messages.clearMessages())
        .then(() =>
          this.$router.push(`/events/${this.$route.params.eventId}/competitors`)
        )
        .catch(() =>
          this.$messages.addMessage('Problem Creating Entry', 'error')
        )
    },

    updateCompetitor: function() {
      return this.$database
        .query('UPDATE competitors SET ? WHERE id=?', [
          {
            name: this.competitor.name,
            event: this.$route.params.eventId,
            siid: this.competitor.siid,
            membershipNumber: this.competitor.membershipNumber,
            ageClass: this.competitor.ageClass,
            club: this.competitor.club,
            course: this.getCourseIdFromName(this.competitor.course),
            downloaded: this.competitor.downloaded,
            nonCompetitive: this.competitor.nonCompetitive,
          },
          this.competitor.id,
        ])
        .then(this.recalculateResult)
        .then(() => this.$messages.clearMessages())
        .then(() =>
          this.$router.push(`/events/${this.$route.params.eventId}/competitors`)
        )
        .catch(() =>
          this.$messages.addMessage('Problem Updating Entry', 'error')
        )
    },

    deleteCompetitor: function() {
      return this.$database
        .query('DELETE FROM competitors WHERE id=?', this.competitor.id)
        .then(() => {
          this.$messages.addMessage(
            `Entry for "${this.competitor.name}" Deleted`
          )
          this.$router.push(`/events/${this.$route.params.eventId}/competitors`)
        })
        .catch(() =>
          this.$messages.addMessage('Problem Deleting Entry', 'error')
        )
    },

    getCourseIdFromName: function(name) {
      return this.courses.filter(course => course.name === name)[0].id
    },

    getCourseNameFromId: async function(id) {
      await this.getCourses()
      if (this.competitor.course === null || this.competitor.course === '')
        return ''
      else return this.courses.filter(course => course.id === id)[0].name
    },

    checkForDuplicateSIID: async function() {
      const queryResult = await this.$database.query(
        'SELECT id, downloaded FROM competitors WHERE siid=? AND event=?',
        [this.competitor.siid, parseInt(this.$route.params.eventId)]
      )
      return (
        queryResult.filter(
          competitor =>
            !competitor.downloaded && competitor.id !== this.competitor.id
        ).length > 0
      )
    },

    onDeleteConfirm: function(decision) {
      this.showDeleteConfirmationDialog = false
      if (decision) this.deleteCompetitor()
    },

    clearForm: function() {
      this.competitor = {
        name: '',
        id: undefined,
        siid: '',
        membershipNumber: '',
        ageClass: '',
        club: '',
        course: '',
        downloaded: false,
        nonCompetitive: false,
      }
    },

    searchArchive: function() {
      return this.$archive
        .query(
          `
      SELECT *
      FROM people
      WHERE name LIKE '%${this.competitor.name}%'
        AND siid LIKE '%${this.competitor.siid}%'
        AND membershipNumber LIKE '%${this.competitor.membershipNumber}%'
        AND status != 'Hire'
     `
        )
        .then(result => {
          if (result.length === 1) {
            this.competitor = result[0]
            this.competitor.id = null
            this.competitor.ageClass = ageClassFunctions(
              this.competitor.gender,
              this.competitor.yearOfBirth
            )
            if (this.competitor.status === 'Lost')
              this.$messages.addMessage(
                'This SI Card is Marked as Lost',
                'warning'
              )
          } else {
            this.showArchiveDialog = true
            this.archiveData = result
          }
        })
        .catch(() =>
          this.$messages.addMessage(
            'Problem Fetching Data From Archive',
            'error'
          )
        )
    },

    onArchiveSelect: function(decision) {
      this.showArchiveDialog = false
      this.archiveData = []
      if (decision) {
        this.competitor = decision
        this.competitor.id = null
        this.competitor.ageClass = ageClassFunctions(
          this.competitor.gender,
          this.competitor.yearOfBirth
        )
        if (this.competitor.status === 'Lost')
          this.$messages.addMessage('This SI Card is Marked as Lost', 'warning')
      }
    },

    calculateAgeClass: (gender, yearOfBirth) =>
      ageClassFunctions(gender, yearOfBirth),

    recalculateResult: function() {
      if (this.competitor.course !== this.originalCourse) {
        const courseId = this.getCourseIdFromName(this.competitor.course)
        const courseControls = this.courses
          .filter(course => course.id === courseId)[0]
          .controls.split(',')
          .filter(punch => punch !== '')
        const punchesNoStartAndFinish = this.punches
          .map(punch => punch.controlCode.toString())
          .filter(punch => punch !== 'S' && punch !== 'F')

        const courseMatchingStats = courseMatching.linear(
          punchesNoStartAndFinish,
          courseControls
        )
        const time = this.calculateTime(courseMatchingStats, this.punches)

        return this.$database
          .query('REPLACE INTO results SET ?', {
            time: time.time,
            links: JSON.stringify(courseMatchingStats.links),
            errors: time.errors,
            competitor: this.competitor.id,
            event: this.$route.params.eventId,
          })
          .then(() =>
            this.$messages.addMessage(
              `"${this.competitor.name}" result recalculated`
            )
          )
          .catch(() =>
            this.$messages.addMessage('Problem Recalculating Result', 'error')
          )
      }
    },

    calculateTime: function(courseMatchingStats, punches) {
      let errors = courseMatchingStats.errors
      const startPunch = punches.filter(punch => punch.controlCode === 'S')
      const finishPunch = punches.filter(punch => punch.controlCode === 'F')

      if (!startPunch || !startPunch[0] || !startPunch[0].time)
        errors = `MS ${errors}`
      if (!finishPunch || !finishPunch[0] || !finishPunch[0].time)
        errors = 'Rtd'
      errors = errors.trim()

      let time = 0
      if (
        startPunch[0] &&
        startPunch[0].time &&
        finishPunch[0] &&
        finishPunch[0].time
      ) {
        time = finishPunch[0].time - startPunch[0].time
      }

      return {
        time,
        errors,
        displayTime: timeFunctions.displayTime(time, errors),
      }
    },
  },
}
</script>
