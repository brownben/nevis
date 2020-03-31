import linear from './linear.js'

export default {
  linear: linear,

  findBestCourse: function(cardList, coursesList) {
    if (coursesList.length > 0) {
      const coursesListWithPercentageMatch = coursesList.map(course => {
        course.percentageMatch = this.linear(
          cardList,
          course.controls
        ).percentageCorrect
        return course
      })

      return coursesListWithPercentageMatch.reduce((matchedCourse, course) => {
        if (course.percentageMatch > matchedCourse.percentageMatch)
          return course
        else return matchedCourse
      })
    }
  },
}
