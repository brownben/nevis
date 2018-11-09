export default {
  getDownloads: function () {
    return this.database.allDocs({
      include_docs: true,
      startkey: 'competitor-',
      endkey: 'competitor-\ufff0',
    })
      .then(data => data.rows)
      .then(data => data.map(data => data.doc))
      .then(competitors => competitors.filter(competitor => competitor.download))
  },

  getDownloadsLength: function () {
    return this.getDownloads().then(download => download.length)
  },
}
