export default {

  addCourse: async function (course) {
    if (await this.checkDuplicateName(course.name)) {
      const lastID = await this.greatestCourseID()
      course._id = 'course-' + (lastID + 1)
      course.controls = course.controls.split(',').map(control => parseInt(control))
      return this.database.put(course)
    }
    else throw Error('A Course with this Name already exists')
  },

  updateCourse: function (course, id, rev) {
    course._id = id
    course._rev = rev
    course.controls = course.controls.split(',').map(control => parseInt(control))

    this.database.get(id).then(originalCourse => {
      if (originalCourse.name !== course.name) {
        this.changeCourseOfCompetitors(originalCourse.name, course.name)
      }
    })

    return this.database.put(course)
  },

  deleteCourse: function (id) {
    let db = this.database
    return db.get(id)
      .then(async data => {
        db.remove(data)
        const competitorsOnCourse = await this.competitorsOnCourse(data.name)
        this.changeCourseOfCompetitors(data.name, '')
        if (competitorsOnCourse > 0) return `${competitorsOnCourse} Competitors Now Have No Assigned Course`
      })
  },

  getCourses: function () {
    return this.database.allDocs({
      include_docs: true,
      startkey: 'course-',
      endkey: 'course-\ufff0',
    })
      .then(data => data.rows)
  },

  findCourse: function (id) {
    return this.database.get(id)
  },

  checkDuplicateName: function (name) {
    return this.getCourses()
      .then(courses => courses.filter(course => course.doc.name === name).length === 0)
  },

  competitorsOnCourse: function (course) {
    return this.getCompetitors()
      .then(competitors => competitors.filter(competitor => competitor.doc.course === course).length)
  },

  greatestCourseID: function () {
    return this.getCourses()
      .then(courses => {
        if (courses[courses.length - 1]) {
          return parseInt(courses[courses.length - 1].id.split('-')[1])
        }
      })
  },
}
