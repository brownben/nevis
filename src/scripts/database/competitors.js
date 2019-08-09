import { parseString } from 'xml2js'

const xml2json = async (xml) => {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, json) => {
      if (err) reject(err)
      else resolve(json)
    })
  })
}

export default {
  addCompetitor: async function (competitor) {
    if (await this.checkDuplicateSIID(competitor.siid)) {
      const lastID = await this.greatestCompetitorID()
      competitor._id = 'competitor-' + (lastID + 1)
      return this.database.put(competitor)
    }
    else throw Error('A Competitor with this SI Card already exists')
  },

  updateCompetitor: async function (competitor, id, rev) {
    competitor._id = id || competitor._id
    competitor._rev = rev || competitor._rev
    const oldCompetitor = await this.findCompetitor(competitor._id)
    if (competitor.course !== oldCompetitor.course) {
      competitor = await this.recalculateResultforCompetitor(competitor, competitor.course)
      return this.database.put(competitor)
    }
    else return this.database.put(competitor)
  },

  deleteCompetitor: function (id) {
    const db = this.database
    return db.get(id)
      .then(data => db.remove(data))
  },

  deleteAllCompetitors: function () {
    return this.getCompetitors()
      .then(competitors => {
        let deletedCompetitors = competitors.map(competitor => {
          competitor.doc._deleted = true
          return competitor.doc
        })
        return this.database.bulkDocs(deletedCompetitors)
      })
  },

  getCompetitors: function () {
    return this.database.allDocs({
      include_docs: true,
      startkey: 'competitor-',
      endkey: 'competitor-\ufff0',
    })
      .then(data => data.rows)
  },

  findCompetitor: function (id) {
    return this.database.get(id)
  },

  findCompetitorBySIID: function (siid) {
    siid = siid.toString()
    return this.getCompetitors()
      .then(competitors => competitors.filter(competitor => competitor.doc && competitor.doc.siid))
      .then(competitors => competitors.filter(competitor => competitor.doc.siid === siid))
      .then(competitors => { if (competitors.length > 0) return competitors[0].doc })
  },

  searchCompetitors: function (name, siid, course, sortBy, invert) {
    return this.getCompetitors()
      .then(data => {
        let competitors = data.map(data => data.doc)
        competitors = competitors.filter(data =>
          data.name.toLowerCase().includes(name.toLowerCase()) &&
          data.siid.includes(siid) &&
          data.course.includes(course)
        )
        competitors.sort((a, b) => {
          if (a[sortBy] === b[sortBy]) return 0
          else if (a[sortBy] === null || a[sortBy] === undefined) return 1
          else if (b[sortBy] === null || b[sortBy] === undefined) return -1
          else if (a[sortBy] < b[sortBy]) return 1
          else return -1
        })
        if (invert) competitors.reverse()
        return competitors
      })
  },

  changeCourseOfCompetitors: function (oldCourse, newCourse) {
    this.getCompetitors()
      .then(competitors => {
        competitors = competitors.filter(competitor => competitor.doc.course === oldCourse)
        competitors.forEach(competitor => {
          let toInsert = competitor.doc
          toInsert._id = competitor.id
          toInsert.course = newCourse
          this.database.put(toInsert)
        })
      })
  },

  checkDuplicateSIID: function (siid) {
    return this.getCompetitors()
      .then(competitors => competitors.filter(competitor => competitor.doc.siid === siid).length === 0)
  },

  greatestCompetitorID: function () {
    return this.getCompetitors()
      .then(competitors => {
        competitors.sort((a, b) => parseInt(a.id.split('-')[1]) > parseInt(b.id.split('-')[1]))
        if (competitors[competitors.length - 1] && competitors.length > 0) return parseInt(competitors[competitors.length - 1].id.split('-')[1])
        else return 0
      })
  },

  importCompetitorsFromXML: function (string) {
    return xml2json(string).then(async result => {
      if (result.EntryList) {
        const lastCompID = await this.greatestCompetitorID()
        let noOfCompetitors = 0
        let coursesList = []
        let competitors = []
        result.EntryList.PersonEntry.forEach(person => {
          const competitor = {}

          if (person.Person[0].Name) competitor.name = person.Person[0].Name[0].Given[0] + ' ' + person.Person[0].Name[0].Family[0]
          else competitor.name = ''

          if (person.ControlCard) competitor.siid = person.ControlCard[0]
          else competitor.siid = 'Hire - ' + (lastCompID + noOfCompetitors)

          if (person.Person[0].Id) competitor.membershipNumber = person.Person[0].Id[0]
          else competitor.membershipNumber = ''

          if (person.Class) {
            competitor.course = person.Class[0].Name[0]
            coursesList.push(person.Class[0].Name[0])
          }
          else competitor.course = 'Unknown'

          if (person.Organisation) competitor.club = person.Organisation[0].Name[0]
          else competitor.club = ''

          noOfCompetitors += 1
          competitor._id = 'competitor-' + (lastCompID + noOfCompetitors)
          competitors.push(competitor)
        })
        this.database.bulkDocs(competitors)
        return {
          noOfCompetitors: noOfCompetitors,
          courses: coursesList,
        }
      }
    })
  },
}
