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
    const downloadLength = this.getDownloadsLength()
    const eventData = this.database.get('eventInformation')
    const databaseInfo = this.database.info()

    return Promise.all([coursesLength, competitorsLength, eventData, databaseInfo, downloadLength])
      .then(values => {
        return {
          name: values[2].name,
          date: values[2].date,
          noOfCourses: values[0],
          noOfCompetitors: values[1],
          database: values[3],
          noOfDownloads: values[4],
        }
      })
  },
}
