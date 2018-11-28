import { parseString } from 'xml2js'

const xml2json = async (xml) => {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, json) => {
      if (err) reject(err)
      else resolve(json)
    })
  })
}

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

  importCoursesFromXML: function (string) {
    return xml2json(string).then(async result => {
      if (result.CourseData && result.CourseData.RaceCourseData) {
        let courses = result.CourseData.RaceCourseData[0].Course
        courses = courses.map(course => {
          const toReturn = { name: '', length: '', climb: '', controls: [] }
          if (course.Name) toReturn.name = course.Name[0]
          if (course.Length) toReturn.length = (parseInt(course.Length[0]) / 1000).toString()
          if (course.Climb) toReturn.climb = course.Climb[0]
          if (course.CourseControl) {
            toReturn.controls = course.CourseControl
              .filter(control => control.$.type !== 'Start' && control.$.type !== 'Finish')
              .map(control => parseInt(control.Control[0]))
          }
          return toReturn
        })

        let lastID = await this.greatestCourseID()
        courses.forEach(course => {
          course._id = 'course-' + (lastID + 1)
          lastID += 1
        })

        return this.database.bulkDocs(courses)
      }
      else throw Error('Incorrect File Format')
    })
  },
}
