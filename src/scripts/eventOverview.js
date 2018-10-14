export default {
  getEventData: function () {
    return this.database.get('eventInformation')
  },

  getOverview: function () {
    const coursesLength = this.database.allDocs({
      include_docs: true,
      startkey: 'course-',
      endkey: 'course-\ufff0',
    }).then(data => data.rows.length)

    const competitorsLength = this.database.allDocs({
      include_docs: true,
      startkey: 'competitor-',
      endkey: 'competitor-\ufff0',
    }).then(data => data.rows.length)

    return Promise.all([coursesLength, competitorsLength]).then(values => {
      return {
        noOfCourses: values[0],
        noOfCompetitors: values[1],
        noOfDownloads: values[2],
      }
    })
  },
}
