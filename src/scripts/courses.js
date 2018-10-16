export default {
  addCourse: function (course) {
    course._id = 'course-' + course.name
    course.controls = course.controls.split(',').map(control => parseInt(control))
    return this.database.put(course)
  },

  updateCourse: function (course, id, rev) {
    course._id = id
    course._rev = rev
    course.controls = course.controls.split(',').map(control => parseInt(control))
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
}
