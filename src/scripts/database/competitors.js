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
    let db = this.database
    return db.get(id)
      .then(data => db.remove(data))
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
        competitors.sort((a, b) => a[sortBy] > b[sortBy])
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
}
