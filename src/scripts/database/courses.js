export default {

  addCourse: async function (course) {
    if (await this.checkDuplicateName(course.name)) {
      const size = await this.size()
      course._id = 'course-' + size
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
      .then(data => db.remove(data))
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
}
