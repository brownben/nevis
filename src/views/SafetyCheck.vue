<template>
  <main>
    <back-arrow :to="`/events/${$route.params.id}`" />
    <h1 class="mx-10 mb-1 px-1">
      Safety Check
    </h1>
    <div class="mx-12 mb-3">
      <button class="button" @click="importPunches">Import Punches</button>
      <button class="button" @click="getOutstandingCompetitors">Refresh</button>
    </div>
    <div
      v-if="outstandingCompetitors && outstandingCompetitors.length > 0"
      class="mx-12 my-shadow mx-12 mb-3 p-2"
    >
      <table class="w-full font-body">
        <tr class="font-heading text-center hover:bg-blue-light">
          <th @click="changeSortBy('name')">
            Name
            <up-down-arrows
              :active="sortBy === 'name'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
          <th @click="changeSortBy('controlCode')">
            Control
            <up-down-arrows
              :active="sortBy === 'controlCode'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
          <th @click="changeSortBy('time')">
            Time
            <up-down-arrows
              :active="sortBy === 'time'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
          <th
            class="hidden sm:table-cell"
            @click="changeSortBy('competitors.course')"
          >
            Course
            <up-down-arrows
              :active="sortBy === 'competitors.course'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
          <th class="hidden md:table-cell" @click="changeSortBy('ageClass')">
            Age Class
            <up-down-arrows
              :active="sortBy === 'ageClass'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
        </tr>
        <tbody is="transition-group" name="fade">
          <tr
            v-for="competitor of outstandingCompetitors"
            :key="competitor.punchesId"
            class="text-center even:bg-blue-lightest hover:bg-blue-light"
          >
            <td>{{ competitor.name }}</td>
            <td>{{ competitor.controlCode }}</td>
            <td>{{ time.displayActualTime(competitor.time) }}</td>
            <td class="hidden sm:table-cell">{{ competitor.course }}</td>
            <td class="hidden md:table-cell">{{ competitor.ageClass }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import UpDownArrows from '@/components/UpDownArrows'

import time from '@/scripts/time'
import ageClassFunctions from '@/scripts/ageClass'

export default {
  components: {
    'back-arrow': BackArrow,
    'up-down-arrows': UpDownArrows,
  },

  data: function () {
    return {
      outstandingCompetitors: [],
      time: time,
      sortBy: 'time',
      sortDirection: 'DESC',
    }
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    } else this.getOutstandingCompetitors()
  },

  methods: {
    changeSortBy: function (field) {
      if (this.sortBy === field && this.sortDirection === 'ASC')
        this.sortDirection = 'DESC'
      else if (this.sortBy === field) this.sortDirection = 'ASC'
      this.sortBy = field
      this.getOutstandingCompetitors()
    },

    getOutstandingCompetitors: function () {
      return this.$database
        .query(
          `
          SELECT time, controlCode, punches.id as punchesId, competitors.*, courses.name as course
          FROM punches, competitors
          LEFT JOIN courses ON competitors.course=courses.id
          WHERE punches.competitor=competitors.id
              AND competitors.downloaded=False
			        AND punches.event=?
          GROUP BY competitors.id
          ORDER BY ${this.sortBy} ${this.sortDirection}
      `,
          [this.$route.params.id]
        )
        .then((result) => {
          this.outstandingCompetitors = result
        })
        .catch(() =>
          this.$messages.addMessage(
            'Problem Fetching Outstanding Competitors',
            'error'
          )
        )
    },

    rawFileToPunchRecords: function (rawData) {
      return rawData
        .trim()
        .split('\n')
        .filter((record) => record.slice(0, 3) !== 'No;' && record !== '')
        .map((line) => {
          let splitLine = line.split(';')
          return {
            siid: parseInt(splitLine[2], 10),
            controlCode: parseInt(splitLine[6], 10),
            time: time.timeToSeconds(splitLine[8]),
            event: this.$route.params.id,
            type: 'imported',
          }
        })
    },

    findCompetitorForPunches: async function (punchRecords) {
      const results = []

      for (const record of punchRecords) {
        const competitorsMatchingSIID = await this.$database.query(
          `
          SELECT *
          FROM competitors
          WHERE competitors.event=?
            AND competitors.siid=?
          ORDER BY downloaded DESC`,
          [this.$route.params.id, record.siid.toString()]
        )

        if (competitorsMatchingSIID.length >= 1)
          results.push({ ...record, competitor: competitorsMatchingSIID[0].id })
        else {
          const archiveCompetitors = await this.$archive.query(
            'SELECT * FROM people WHERE siid=? AND status != "Hire" LIMIT 1',
            record.siid
          )

          let newCompetitor = {}
          if (archiveCompetitors.length >= 1)
            newCompetitor = {
              name: archiveCompetitors[0].name,
              event: this.$route.params.id,
              siid: record.siid,
              membershipNumber: archiveCompetitors[0].membershipNumber,
              ageClass: ageClassFunctions(
                archiveCompetitors[0].gender,
                archiveCompetitors[0].yearOfBirth
              ),
              club: archiveCompetitors[0].club,
              downloaded: false,
            }
          else
            newCompetitor = {
              name: 'Unknown',
              event: this.$route.params.id,
              siid: record.siid,
              downloaded: false,
            }

          const result = await this.$database.query(
            'INSERT INTO competitors SET ?',
            newCompetitor
          )

          results.push({ ...record, competitor: result.insertId })
        }
      }

      return results
    },

    punchRecordToArray: function (punchRecords) {
      return punchRecords.map((record) => [
        record.competitor,
        record.controlCode,
        record.time,
        record.event,
        record.type,
      ])
    },

    filterExistingPunches: async function (punchRecords) {
      const existingPunches = await this.$database.query(
        `
          SELECT siid, time, controlCode
          FROM punches, competitors
          WHERE punches.event=?
              AND competitors.id=punches.competitor
           `,
        [this.$route.params.id]
      )

      return punchRecords.filter((record) => {
        const punch = [record.siid, record.time, record.controlCode]
        for (const exisitingPunch of existingPunches) {
          if (JSON.stringify(exisitingPunch) === JSON.stringify(punch))
            return false
        }
        return true
      })
    },

    importPunches: function () {
      const { dialog } = this.$electron.remote
      return dialog
        .showOpenDialog({
          title: 'Nevis - Import Punches',
          buttonLabel: 'Import',
          properties: ['openFile'],
          filters: [
            { name: 'Comma Separated Values', extensions: ['csv'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        })
        .then((result) => {
          if (!result.canceled)
            return this.$fs.readFile(result.filePaths[0], { encoding: 'utf8' })
          else throw Error()
        })
        .then(this.rawFileToPunchRecords)
        .then(this.findCompetitorForPunches)
        .then(this.filterExistingPunches)
        .then(this.punchRecordToArray)
        .then((result) => {
          if (result.length > 0)
            return this.$database.query(
              'INSERT INTO punches (competitor,controlCode,time,event,type) VALUES ?',
              [result]
            )
          else return { affectedRows: 0 }
        })
        .then((result) =>
          this.$messages.addMessage(`${result.affectedRows} Punches Imported`)
        )
        .then(this.getOutstandingCompetitors)
        .catch(() =>
          this.$messages.addMessage('Problem Importing Punches', 'error')
        )
    },
  },
}
</script>
