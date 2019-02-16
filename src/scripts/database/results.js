import courseMatching from '../courseMatching/courseMatching'
import time from '../time'
import splits from '../splits'

export default {
  getDownloads: function () {
    return this.database.allDocs({
      include_docs: true,
      startkey: 'competitor-',
      endkey: 'competitor-\ufff0',
    })
      .then(data => data.rows)
      .then(data => data.map(data => data.doc))
      .then(competitors => competitors.filter(competitor => competitor.download))
  },

  getDownloadsLength: function () {
    return this.getDownloads().then(download => download.length)
  },

  changeCourseOfCompetitors: function (oldCourse, newCourse) {
    return this.getCompetitors()
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

  recalculateResultforCourse: function (courseName, controls) {
    return this.getCompetitors()
      .then(competitors => {
        competitors = competitors.filter(competitor => competitor.doc.course === courseName)
        competitors.forEach(competitor => {
          let toInsert = competitor.doc
          if (toInsert.download) {
            const match = courseMatching.linear(toInsert.download.controls, controls)
            if (toInsert.download.other) match.errors = (toInsert.download.other + ' ' + match.errors).trim()
            if (match.errors.length > 0) toInsert.result = match.errors
            else toInsert.result = time.calculateTime(toInsert.download)
            toInsert.splits = splits.generateSplits(toInsert.download, match.links, controls)
            this.database.put(toInsert)
          }
        })
      })
  },

  changeCourseOfCompetitorsAndRecalculateResults: function (oldCourse, newCourse, controls) {
    return this.getCompetitors()
      .then(competitors => {
        competitors = competitors.filter(competitor => competitor.doc.course === oldCourse)
        competitors.forEach(competitor => {
          let toInsert = competitor.doc
          toInsert._id = competitor.id
          toInsert.course = newCourse
          if (toInsert.download) {
            const match = courseMatching.linear(toInsert.download.controls, controls)
            if (toInsert.download.other) match.errors = (toInsert.download.other + ' ' + match.errors).trim()
            if (match.errors.length > 0) toInsert.result = match.errors
            else toInsert.result = time.calculateTime(toInsert.download)
            toInsert.splits = splits.generateSplits(toInsert.download, match.links, controls)
          }
          this.database.put(toInsert)
        })
      })
  },

  recalculateResultforCompetitor: async function (competitor, courseName) {
    let courses = await this.getCoursesData()
    courses = courses.filter(course => course.name === courseName)
    const course = courses[0]
    if (!course && competitor.download) {
      competitor.result = time.calculateTime(competitor.download)
      competitor.splits = []
    }
    else if (competitor.download) {
      const match = courseMatching.linear(competitor.download.controls, course.controls)
      if (competitor.download.other) match.errors = (competitor.download.other + ' ' + match.errors).trim()
      if (match.errors.length > 0) competitor.result = match.errors
      else competitor.result = time.calculateTime(competitor.download)
      competitor.splits = splits.generateSplits(competitor.download, match.links, course.controls)
    }
    return competitor
  },
}
