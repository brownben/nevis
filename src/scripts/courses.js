export default {
  getCourses: function () {
    return this.database.allDocs({
      include_docs: true,
      startkey: 'course-',
      endkey: 'course-\ufff0',
    })
      .then(data => data.rows)
  },
}
