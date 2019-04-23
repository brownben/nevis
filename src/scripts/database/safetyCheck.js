import time from '@/scripts/time'

export default {
  importSafetyCheckData: async function (filename, data) {
    const filenameNoExtension = filename.split('.')[0]
    const location = filenameNoExtension.replace(/.*:\\.*\\/g, '')

    const rows = data.split('\n')
    const punches = []
    for (const row of rows) {
      if (row.trim() !== '' && !row.includes('#;SIID;Control time;')) punches.push(row.trim().split(';'))
    }

    const competitors = punches.map(async punch => {
      const competitor = await this.findCompetitorBySIID(punch[1])
      const punchTime = time.toSeconds(punch[2].split('   ')[1])
      if (competitor) {
        if (!competitor.safetyCheck || time > competitor.safetyCheck.time) {
          competitor.safetyCheck = {
            location: location,
            time: punchTime,
          }
        }
        return competitor
      }
      else {
        return {
          name: 'UNKNOWN',
          siid: punch[1],
          ageClass: '',
          club: '',
          nonCompetitive: false,
          membershipNumber: '',
          course: 'UNKNOWN',
          safetyCheck: {
            location: location,
            time: punchTime,
          },
        }
      }
    })
    return Promise.all(competitors)
      .then(async competitors => {
        let lastID = await this.greatestCompetitorID()
        return competitors.map(competitor => {
          if (competitor) {
            if (!competitor._id) {
              competitor._id = 'competitor-' + (lastID + 1)
              lastID += 1
            }
            return competitor
          }
        })
      })
      .then(competitors => this.database.bulkDocs(competitors))
  },

  getOutstandingCompetitorsLength: function () {
    return this.getCompetitors()
      .then(competitors => competitors.filter(competitor => !competitor.doc.download && competitor.doc.safetyCheck))
      .then(competitors => competitors.length)
  },

  getOutstandingCompetitors: function () {
    return this.getCompetitors()
      .then(competitors => competitors.filter(competitor => !competitor.doc.download && competitor.doc.safetyCheck))
      .then(competitors => competitors.map(competitor => competitor.doc))
  },
}
