<template>
  <main>
    <h1 class="mx-10 mb-1">
      <back-arrow :disable="true" @clicked="exit" />Download
    </h1>
    <div class="mx-12 mb-3 shadow">
      <dropdown-input
        v-model="selectedPort"
        :hide="connected"
        :list="portsList"
        label="Port:"
        @opened="refreshPortsList"
      />
      <dropdown-input
        v-model="selectedBaudString"
        :hide="connected"
        :list="['Serial (4800)', 'USB (38400)']"
        label="Baud:"
      />
    </div>
    <div class="mx-12 mb-3">
      <button class="button" @click="connect">
        <template v-if="!connected">Connect</template>
        <template v-else>Disconnect</template>
      </button>
    </div>
    <div v-if="lastDownload && lastDownload.siid" class="mx-12 mb-3 shadow px-3 pt-2 pb-1">
      <h2 class="mb-1">Last Download</h2>
      <p>
        <b>Name:</b>
        {{ lastDownload.name || 'Unknown' }}
      </p>
      <p>
        <b>SI Card:</b>
        {{ lastDownload.siid }}
      </p>
      <p>
        <b>Course:</b>
        {{ lastDownload.courseName || 'Unknown' }}
      </p>
      <p>
        <b>Time:</b>
        {{ lastDownload.time }}
      </p>
    </div>
    <transition name="fade">
      <confirmation-dialog
        v-if="showConfirmationDialog"
        heading="Leave Download"
        message="Are You Sure You Want to Stop Downloading SI Cards?"
        confirm="Continue"
        cancel="Cancel"
        @close="leavePage"
      />
    </transition>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import DropdownInput from '@/components/DropdownInput'
import ConfirmationDialog from '@/components/ConfirmationDialog'

import si from '@/scripts/si/si'
import ageClassFunctions from '@/scripts/ageClass'
import timeFunctions from '@/scripts/time'
import courseMatching from '@/scripts/courseMatching/courseMatching'

export default {
  components: {
    'back-arrow': BackArrow,
    'dropdown-input': DropdownInput,
    'confirmation-dialog': ConfirmationDialog,
  },

  data: function () {
    return {
      connected: false,
      showConfirmationDialog: false,
      selectedPort: '',
      selectedBaudString: 'USB (38400)',
      portsList: ['No Ports Found'],
      port: { isOpen: false },
      lastDownload: {},
    }
  },

  computed: {
    selectedBaud: function () {
      if (this.selectedBaudString === 'USB (38400)') return 38400
      else return 4800
    },
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    }
    else {
      this.refreshPortsList()
    }
  },

  methods: {
    exit: function () {
      if (this.connected) this.showConfirmationDialog = true
      else this.$router.push(`/events/${this.$route.params.id}`)
    },

    leavePage: function (decision) {
      this.showConfirmationDialog = false
      if (decision) {
        this.port.close()
        this.$router.push(`/events/${this.$route.params.id}`)
      }
    },

    refreshPortsList: function () {
      return this.$serialPort.list()
        .then(ports => {
          if (ports.length === 0) this.portsList = ['No Ports Found']
          else this.portsList = ports.map(port => port.comName)
        })
        .catch(() => this.$messages.addMessage('Problem Finding Ports', 'error'))
    },

    connect: function () {
      if (this.connected) this.port.close()
      else if (this.selectedPort === '' || this.selectedPort === 'No Ports Found') this.$messages.addMessage('No Port Selected', 'error')
      else {
        this.port = new this.$serialPort(this.selectedPort, {
          baudRate: this.selectedBaud,
          dataBits: 8,
          stopBits: 1,
          parity: 'none',
          autoOpen: true,
        })
        this.port.on('open', this.portOnOpen)
        this.port.on('close', this.portOnClose)
        this.port.on('error', this.portOnError)
        this.port.on('data', this.portOnData)
      }
    },

    portOnOpen: function () {
      this.connected = true
      this.$messages.clearMessages()
    },
    portOnClose: function () { this.connected = false },
    portOnError: function (error) { this.$messages.addMessage(error.message, 'error') },
    portOnData: function (data) {
      try {
        const siData = si.parseData(data, this.port)
        if (siData) this.saveDownload(siData)
      }
      catch (error) { this.$messages.addMessage('Problem Saving Download', 'error') }
    },

    saveDownload: async function (siData) {
      const competitor = await this.findCompetitorForDownload(siData)

      const punchesForDatabase = siData.punches.map(punch => [punch.controlCode, punch.time, competitor.id, this.$route.params.id])
      await this.$database.query('INSERT INTO punches (controlCode, time, competitor, event) VALUES ?', [punchesForDatabase])

      const cardPunches = siData.punches
        .map(punch => punch.controlCode.toString())
        .filter(punch => punch !== 'S' && punch !== 'F')

      let competitorCourse
      if (!competitor.course) {
        competitorCourse = courseMatching.findBestCourse(cardPunches, await this.getCourses())
        await this.$database.query('UPDATE competitors SET ? WHERE id=?', [{ course: competitorCourse.id }, competitor.id])
      }
      else competitorCourse = await this.getCourseFromId(competitor.course)

      const courseMatchingStats = courseMatching.linear(cardPunches, competitorCourse.controls)
      const time = this.calculateTime(courseMatchingStats, siData.punches)

      await this.$database.query('UPDATE competitors SET ? WHERE id=?', [{ downloaded: true }, competitor.id])
      await this.$database.query('REPLACE INTO results SET ?', {
        time: time.time,
        links: JSON.stringify(courseMatchingStats.links),
        errors: time.errors,
        competitor: competitor.id,
        event: this.$route.params.id,
      })

      this.lastDownload = {
        ...competitor,
        courseName: competitorCourse.name,
        time: time.displayTime,
      }
    },

    findCompetitorForDownload: async function (siData) {
      const databaseCompetitors = await this.$database.query(`SELECT * FROM competitors WHERE competitors.event=? AND competitors.siid=?`, [this.$route.params.id, siData.siid, this.$route.params.id, siData.siid])

      const archiveCompetitor = await this.$archive.query('SELECT * FROM people WHERE siid=? AND status != "Hire" LIMIT 1', siData.siid.toString()).then(result => result[0])

      const databaseCompetitorsNotDownloaded = databaseCompetitors.filter(competitor => !competitor.downloaded)

      if (databaseCompetitorsNotDownloaded.length > 0) return databaseCompetitorsNotDownloaded[0]

      else if (databaseCompetitors.length > 0) {
        const punchesFromDatabase = await this.$database.query(`SELECT controlCode, time FROM punches WHERE competitor=? AND (controlCode='F' OR controlCode='S')`, databaseCompetitors[0].id)
        const siCardStartAndFinishPunches = siData.punches.filter(punch => punch.controlCode === 'S' || punch.controlCode === 'F')

        if (JSON.stringify(punchesFromDatabase) === JSON.stringify(siCardStartAndFinishPunches)) {
          await this.$database.query(`DELETE FROM punches WHERE competitor=?`, databaseCompetitors[0].id)
          return databaseCompetitors[0]
        }
      }

      let newCompetitor = {}
      if (archiveCompetitor) {
        newCompetitor = {
          name: archiveCompetitor.name,
          event: this.$route.params.id,
          siid: siData.siid,
          membershipNumber: archiveCompetitor.membershipNumber,
          ageClass: ageClassFunctions(archiveCompetitor.gender, archiveCompetitor.yearOfBirth),
          club: archiveCompetitor.club,
          downloaded: false,
        }
      }
      else if (siData.personalData) {
        newCompetitor = {
          name: siData.personalData[0] + ' ' + siData.personalData[1],
          event: this.$route.params.id,
          siid: siData.siid,
          ageClass: ageClassFunctions(siData.personalData[2], siData.personalData[3]),
          club: siData.personalData[4],
          downloaded: false,
        }
      }
      else {
        newCompetitor = {
          name: 'Unknown',
          event: this.$route.params.id,
          siid: siData.siid,
          downloaded: false,
        }
      }
      const result = await this.$database.query('INSERT INTO competitors SET ?', newCompetitor)
      newCompetitor.id = result.insertId
      return newCompetitor
    },

    getCourses: function () {
      return this.$database.query(`SELECT * FROM courses WHERE event=?`, this.$route.params.id)
        .then(courses => courses.map(course => {
          course.controls = course.controls.split(',').filter(punch => punch !== '')
          return course
        }))
        .catch(() => this.$messages.addMessage('Problem Fetching Courses', 'error'))
    },

    getCourseFromId: function (id) {
      return this.$database.query(`SELECT * FROM courses WHERE event=? AND id=?`, [this.$route.params.id, id])
        .then(courses => {
          const course = courses[0]
          course.controls = course.controls.split(',').filter(punch => punch !== '')
          return course
        })
        .catch(() => this.$messages.addMessage('Problem Fetching Courses', 'error'))
    },

    calculateTime: function (courseMatchingStats, punches) {
      let errors = courseMatchingStats.errors
      const startPunch = punches.filter(punch => punch.controlCode === 'S')
      const finishPunch = punches.filter(punch => punch.controlCode === 'F')

      if (!startPunch || !startPunch[0] || !startPunch[0].time) errors = 'MS ' + errors
      if (!finishPunch || !finishPunch[0] || !finishPunch[0].time) errors = 'Rtd'
      errors = errors.trim()

      let time = 0
      if (startPunch[0] && startPunch[0].time && finishPunch[0] && finishPunch[0].time) {
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

