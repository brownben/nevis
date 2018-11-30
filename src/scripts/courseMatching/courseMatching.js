import linear from './linear.js'

export default {
  linear: linear,

  findBestCourse: (cardList, coursesList) => {
    if (coursesList.length > 0) {
      coursesList.map(course => {
        course.percentageMatch = linear(cardList, course.controls).percentageCorrect
        return course
      })

      return coursesList.reduce((matchedCourse, course) => {
        if (course.percentageMatch > matchedCourse.percentageMatch) return course
        else return matchedCourse
      })
    }
  },
}
