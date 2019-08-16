export default {
  connection: null,
  connected: false,
  connect: function () {
    return new Promise((resolve, reject) => {
      this.connection.connect(error => {
        if (error) return reject(error)
        resolve()
      })
    })
  },
  query: function (sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (error, rows) => {
        if (error) return reject(error)
        resolve(rows)
      })
    })
  },
}
