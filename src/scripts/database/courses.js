export default {

  addCourse: async function (course) {
    if (await this.checkDuplicateName(course.name)) {
      const lastID = await this.greatestCourseID()
      course._id = 'course-' + (lastID + 1)

      const controls = course.controls.split(',').map(control => parseInt(control))
      if (course.controls[0] != null) course.controls = controls
      else course.controls = []

      return this.database.put(course)
    }
    else throw Error('A Course with this Name already exists')
  },

  updateCourse: function (course, id, rev) {
    course._id = id
    course._rev = rev

    const controls = course.controls.split(',').map(control => parseInt(control))
    if (course.controls[0] != null) course.controls = controls
    else course.controls = []

    this.database.get(id).then(originalCourse => {
      if (originalCourse.name !== course.name && originalCourse.controls !== course.controls) {
        this.changeCourseOfCompetitorsAndRecalculateResults(originalCourse.name, course.name, course.controls)
      }
      else if (originalCourse.controls !== course.controls) {
        this.recalculateResultforCourse(originalCourse.name, course.controls)
      }
      else if (originalCourse.name !== course.name) {
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

  getCoursesData: function () {
    return this.database.allDocs({
      include_docs: true,
      startkey: 'course-',
      endkey: 'course-\ufff0',
    })
      .then(data => data.rows)
      .then(courses => courses.map(course => course.doc))
  },

  findCourse: function (id) {
    return this.database.get(id)
  },

  findCourseByName: function (name) {
    return this.getCourses()
      .then(courses => courses.filter(course => course.doc && course.doc.name))
      .then(courses => courses.filter(course => course.doc.name === name))
      .then(courses => { if (courses.length > 0) return courses[0].doc })
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
        courses.sort((a, b) => parseInt(a.id.split('-')[1]) > parseInt(b.id.split('-')[1]))
        if (courses[courses.length - 1] && courses.length > 0) return parseInt(courses[courses.length - 1].id.split('-')[1])
        else return 0
      })
  },

  checkCoursesExist: async function (coursesList) {
    const coursesFromDatabase = await this.getCoursesData()
    const coursesFromdatabasesNames = coursesFromDatabase.map(course => course.name)
    const courses = coursesList.filter(course => !coursesFromdatabasesNames.includes(course))
    return courses.filter((course, index) => courses.indexOf(course) === index)
  },
}
