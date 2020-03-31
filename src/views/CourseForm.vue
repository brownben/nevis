<template>
  <main>
    <h1 class="mx-10 mb-1 px-1">
      <template v-if="$route.path.includes('create')">
        <back-arrow :to="`/events/${$route.params.eventId}/courses`" />Create
        Course
      </template>
      <template v-else> <back-arrow />Update Course </template>
    </h1>
    <div v-if="$route.path.includes('create')" class="mx-12 mb-3">
      <button @click="submit" class="button">Create Course</button>
    </div>
    <div v-else class="mx-12 mb-3">
      <button @click="submit" class="button">Update Course</button>
      <button @click="showConfirmationDialog = true" class="button">
        Delete Course
      </button>
    </div>
    <form @submit.prevent="submit" class="my-shadow mx-12">
      <text-input v-model.trim="course.name" label="Name:" />
      <text-input v-model="course.length" label="Length (km): " />
      <text-input v-model="course.climb" label="Climb (m):" />
      <text-input v-model.trim="course.controls" label="Controls:" />
    </form>
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        @close="onConfirm"
        heading="Delete Course"
        message="Are You Sure You Want to Delete This Course? This Action Can't Be Recovered."
        confirm="Delete"
        cancel="Cancel"
      />
    </transition>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import TextInput from '@/components/TextInput'
import ConfirmationDialog from '@/components/ConfirmationDialog'

import courseMatching from '@/scripts/courseMatching/courseMatching'

export default {
  components: {
    'back-arrow': BackArrow,
    'text-input': TextInput,
    'confirmation-dialog': ConfirmationDialog,
  },

  data: function() {
    return {
      showConfirmationDialog: false,
      originalControls: '',
      course: {
        name: '',
        length: 0,
        climb: 0,
        controls: '',
        id: undefined,
      },
    }
  },

  mounted: function() {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    } else if (this.$route.params && this.$route.params.courseId)
      this.getCourseDetails()
  },

  methods: {
    submit: async function() {
      if (await this.checkForDuplicateCourse()) {
        this.$messages.addMessage(
          `Course "${this.course.name}" Already Exists`,
          'error'
        )
      } else if (
        !this.course.controls.match(/^[0-9,\s]*$/) ||
        this.course.controls.match(/^.*,$/)
      ) {
        this.$messages.addMessage(`Invalid Format for Controls`, 'error')
        this.$messages.addMessage(
          `Please Separate Each Code With a Comma e.g. 101, 102, 103`
        )
      } else if (
        typeof this.course.length === 'string' &&
        !this.course.length.match(/^[0-9]*\.*[0-9]*$/)
      ) {
        this.$messages.addMessage(
          `Please enter a number for Course Length`,
          'error'
        )
      } else if (
        typeof this.course.climb === 'string' &&
        !this.course.climb.match(/^[0-9]*\.*[0-9]*$/)
      ) {
        this.$messages.addMessage(
          `Please enter a number for Course Climb`,
          'error'
        )
      } else if (this.course.id) this.updateCourse()
      else this.createCourse()
    },

    getCourseDetails: function() {
      return this.$database
        .query(
          'SELECT * FROM courses WHERE id=? LIMIT 1',
          this.$route.params.courseId
        )
        .then(result => {
          if (result && result[0]) {
            this.course = result[0]
            this.originalControls = this.course.controls
            if (result[0].length) this.course.length = this.course.length / 1000
          } else {
            this.$messages.addMessage('Problem Fetching Course Data', 'error')
          }
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Course Data', 'error')
        )
    },

    createCourse: function() {
      return this.$database
        .query('INSERT INTO courses SET ?', {
          name: this.course.name,
          event: this.$route.params.eventId,
          length: this.course.length * 1000 || 0,
          climb: this.course.climb || 0,
          controls: this.course.controls,
          type: 'linear',
        })
        .then(() => this.$messages.clearMessages())
        .then(() =>
          this.$router.push(`/events/${this.$route.params.eventId}/courses`)
        )
        .catch(() =>
          this.$messages.addMessage('Problem Creating Course', 'error')
        )
    },

    updateCourse: function() {
      return this.$database
        .query('UPDATE courses SET ? WHERE id=?', [
          {
            id: this.course.id,
            name: this.course.name,
            event: this.$route.params.eventId,
            length: this.course.length * 1000 || 0,
            climb: this.course.climb || 0,
            controls: this.course.controls,
            type: 'linear',
          },
          this.course.id,
        ])
        .then(() => this.$messages.clearMessages())
        .then(() => this.recalculateCourseResults())
        .then(() =>
          this.$router.push(`/events/${this.$route.params.eventId}/courses`)
        )
        .catch(() =>
          this.$messages.addMessage('Problem Updating Course', 'error')
        )
    },

    deleteCourse: function() {
      return this.$database
        .query('DELETE FROM courses WHERE id=?', this.course.id)
        .then(() => {
          this.$messages.addMessage(
            `Some Competitors May Not Have a Course Allocated`,
            'warning'
          )
          this.$messages.addMessage(`Course "${this.course.name}" Deleted`)
          this.$router.push(`/events/${this.$route.params.eventId}/courses`)
        })
        .catch(() =>
          this.$messages.addMessage('Problem Deleting Course', 'error')
        )
    },

    checkForDuplicateCourse: async function() {
      const queryResult = await this.$database.query(
        'SELECT * FROM courses WHERE name=? AND event=?',
        [this.course.name, parseInt(this.$route.params.eventId)]
      )
      if (
        this.course.id &&
        queryResult[0] &&
        queryResult[0].id === this.course.id
      )
        return false
      else return queryResult.length > 0
    },

    onConfirm: function(decision) {
      this.showConfirmationDialog = false
      if (decision) this.deleteCourse()
    },

    recalculateCourseResults: function() {
      if (this.course.controls !== this.originalControls) {
        return this.$database
          .query(
            'SELECT * FROM competitors WHERE event=? AND course=? AND downloaded=true',
            [this.$route.params.eventId, this.course.id]
          )
          .then(competitors =>
            Promise.all(
              competitors.map(async competitor => {
                const punches = await this.$database.query(
                  'SELECT * FROM punches WHERE competitor=?',
                  [competitor.id]
                )
                return this.recalculateResult(competitor, punches)
              })
            )
          )
          .then(() =>
            this.$messages.addMessage(
              `Results for Course "${this.course.name}" Recalculated`
            )
          )
          .catch(() =>
            this.$messages.addMessage(
              'Problem Recalulating Course Results',
              'error'
            )
          )
      }
    },

    recalculateResult: function(competitor, punches) {
      const courseControls = this.course.controls
        .split(',')
        .filter(punch => punch !== '')
      const punchesNoStartAndFinish = punches
        .map(punch => punch.controlCode.toString())
        .filter(punch => punch !== 'S' && punch !== 'F')

      const courseMatchingStats = courseMatching.linear(
        punchesNoStartAndFinish,
        courseControls
      )
      const time = this.calculateTime(courseMatchingStats, punches)
      return this.$database.query('REPLACE INTO results SET ?', {
        time: time.time,
        links: JSON.stringify(courseMatchingStats.links),
        errors: time.errors,
        competitor: competitor.id,
        event: this.$route.params.eventId,
      })
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
      }
    },
  },
}
</script>
