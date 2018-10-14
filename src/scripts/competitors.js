export default {
  addCompetitor: function (competitor) {
    competitor._id = 'competitor-' + competitor.siid
    return this.database.put(competitor)
  },

  updateCompetitor: function (competitor, id, rev) {
    competitor._id = id
    competitor._rev = rev
    return this.database.put(competitor)
  },

  deleteCompetitor: function (id) {
    let db = this.database
    db.get(id).then(data => db.remove(data))
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

  searchCompetitors: function (name, siid, course) {
    return this.getCompetitors().then(data => {
      let competitors = data.map(data => data.doc)
      competitors = competitors.filter(data =>
        data.name.includes(name) &&
        data.siid.includes(siid) &&
        data.course === course
      )
      return competitors
    })
  },
}
