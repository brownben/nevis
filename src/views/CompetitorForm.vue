<template>
  <main>
    <h1 class="mx-10 mb-1">
      <template v-if="$route.path.includes('create')">
        <back-arrow :to="`/events/${$route.params.eventId}/competitors`" />Create Entry
      </template>
      <template v-else>
        <back-arrow />Update Entry
      </template>
    </h1>
    <div v-if="$route.path.includes('create')" class="mx-12 mb-3">
      <button class="button" @click="submit">Create Entry</button>
    </div>
    <div v-else class="mx-12 mb-3">
      <button class="button" @click="submit">Update Entry</button>
      <button class="button" @click="deleteCompetitor">Delete Entry</button>
    </div>
    <form class="shadow mx-12" @submit.prevent="submit">
      <text-input v-model.trim="competitor.name" label="Name:" />
      <text-input v-model.trim="competitor.siid" label="SI Card: " />
      <text-input v-model.trim="competitor.membershipNumber" label="Membership Number:" />
      <text-input v-model.trim="competitor.ageClass" label="Age Class:" />
      <text-input v-model.trim="competitor.club" label="Club:" />
      <dropdown-input v-model="competitor.course" :list="listOfCourses" label="Course:" />
    </form>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import TextInput from '@/components/TextInput'
import DropdownInput from '@/components/DropdownInput'

export default {
  components: {
    'back-arrow': BackArrow,
    'text-input': TextInput,
    'dropdown-input': DropdownInput,
  },

  data: function () {
    return {
      competitor: {
        name: '',
        id: undefined,
        siid: '',
        membershipNumber: '',
        ageClass: '',
        club: '',
        course: '',
        downloaded: false,
      },
      courses: [],
    }
  },

  computed: {
    listOfCourses: function () {
      if (this.courses && typeof this.courses.map === 'function') return this.courses.map(course => course.name)
      else return []
    },
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) this.$router.push('/')
    else if (this.$route.params && this.$route.params.competitorId) this.getCompetitorDetails()
    else this.getCourses()
  },

  methods: {
    submit: async function () {
      if (this.competitor.name === '') this.$messages.addMessage('Please Enter a Name', 'error')
      else if (await this.checkForDuplicateSIID()) {
        this.$messages.addMessage('An Entry with that SI Card Already Exists', 'error')
      }
      else if (!this.competitor.siid.match(/^[0-9]{1,7}$/)) {
        this.$messages.addMessage('Please Enter a Valid SI Card Number', 'error')
      }
      else if (this.competitor.course === '') this.$messages.addMessage('Please Select a Course', 'error')
      else if (this.competitor.id) this.updateCompetitor()
      else this.createCompetitor()
    },

    getCompetitorDetails: function () {
      return this.$database.query('SELECT * FROM competitors WHERE id=? LIMIT 1', this.$route.params.competitorId)
        .then(async result => {
          if (result && result[0] && result[0].course) {
            this.competitor = result[0]
            this.competitor.course = await this.getCourseNameFromId(result[0].course)
          }
          else {
            this.$messages.addMessage('Problem Fetching Entry Data', 'error')
          }
        })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    getCourses: function () {
      return this.$database.query('SELECT * FROM courses WHERE event=?', this.$route.params.eventId)
        .then(result => { this.courses = result })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    createCompetitor: function () {
      return this.$database.query('INSERT INTO competitors SET ?', {
        name: this.competitor.name,
        event: this.$route.params.eventId,
        siid: this.competitor.siid,
        membershipNumber: this.competitor.membershipNumber,
        ageClass: this.competitor.ageClass,
        club: this.competitor.club,
        course: this.getCourseIdFromName(this.competitor.course),
        downloaded: false,
      })
        .then(() => this.$router.push(`/events/${this.$route.params.eventId}/competitors`))
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    updateCompetitor: function () {
      return this.$database.query('UPDATE competitors SET ? WHERE id=?', [{
        name: this.competitor.name,
        event: this.$route.params.eventId,
        siid: this.competitor.siid,
        membershipNumber: this.competitor.membershipNumber,
        ageClass: this.competitor.ageClass,
        club: this.competitor.club,
        course: this.getCourseIdFromName(this.competitor.course),
        downloaded: this.competitor.downloaded,
      }, this.competitor.id])
        .then(() => this.$router.push(`/events/${this.$route.params.eventId}/competitors`))
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    deleteCompetitor: function () {
      return this.$database.query('DELETE FROM competitors WHERE id=?', this.competitor.id)
        .then(() => {
          this.$messages.addMessage(`Entry for "${this.competitor.name}" Deleted`)
          this.$router.push(`/events/${this.$route.params.eventId}/competitors`)
        })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },

    getCourseIdFromName: function (name) {
      return this.courses.filter(course => course.name === name)[0].id
    },

    getCourseNameFromId: async function (id) {
      await this.getCourses()
      return this.courses.filter(course => course.id === id)[0].name
    },

    checkForDuplicateSIID: async function () {
      const queryResult = await this.$database.query('SELECT downloaded FROM competitors WHERE siid=? AND event=?', [this.competitor.siid, parseInt(this.$route.params.eventId)])
      return queryResult.filter(competitor => !competitor.downloaded).length > 0
    },
  },
}

</script>

