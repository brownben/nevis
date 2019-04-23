export default {
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

  getEventInformation: function () {
    return this.database.get('eventInformation')
  },

  eventInformationExists: function () {
    return this.getEventInformation()
      .then(() => true)
      .catch(() => false)
  },

  setEventInformation: function (event) {
    event._id = 'eventInformation'
    return this.database.put(event)
  },

  getOverview: function () {
    const coursesLength = this.getCoursesLength()
    const competitorsLength = this.getCompetitorsLength()
    const downloadLength = this.getDownloadsLength()
    const outstandingCompetitorsLength = this.getOutstandingCompetitorsLength()
    const eventData = this.getEventInformation()
    const databaseInfo = this.database.info()

    return Promise.all([coursesLength, competitorsLength, eventData, databaseInfo, downloadLength, outstandingCompetitorsLength])
      .then(values => {
        return {
          name: values[2].name,
          date: values[2].date,
          noOfCourses: values[0],
          noOfCompetitors: values[1],
          database: values[3],
          noOfDownloads: values[4],
          noOfOutstandingCompetitors: values[5],
        }
      })
  },
}
