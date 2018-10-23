export default {
  size: function () {
    return this.database.allDocs().then(data => data.rows.length)
  },

  getCoursesLength: function () {
    return this.database.allDocs({
      include_docs: true,
      startkey: 'course-',
      endkey: 'course-\ufff0',
    }).then(data => data.rows.length)
  },

  getCompetitorsLength: function () {
    return this.database.allDocs({
      include_docs: true,
      startkey: 'competitor-',
      endkey: 'competitor-\ufff0',
    }).then(data => data.rows.length)
  },

  getOverview: function () {
    const coursesLength = this.getCoursesLength()
    const competitorsLength = this.getCompetitorsLength()
    const eventData = this.database.get('eventInformation')

    return Promise.all([coursesLength, competitorsLength, eventData]).then(values => {
      return {
        name: values[2].name,
        date: values[2].date,
        noOfCourses: values[0],
        noOfCompetitors: values[1],
      }
    })
  },
}
