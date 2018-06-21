'use strict'

module.exports.homeVue = new Vue({
    el: '#home-overview',
    data: {
        courses: { data: [] },
        competitors: { data: [] },
        eventInfo: { name: '', date: '' },
    },
    computed: {
        downloads: function () {
            if (this.competitors !== undefined && this.competitors.data.length !== 0) {
                return this.competitors.chain().find({ 'download': { '$ne': null } }).data().length
            }
            else {
                return 0
            }
        },
    },
})
