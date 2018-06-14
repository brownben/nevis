'use strict'

module.exports.homeVue = new Vue({
    el: '#home-overview',
    data: {
        competitorsData: [],
        courses: [],
        competitors: 'empty',
        eventInfo: { name: '', date: '' },
    },
    computed: {
        downloads: function () {
            if (this.competitors !== undefined && this.competitors !== 'empty') {
                return this.competitors.chain().find({ 'download': { '$ne': null } }).data().length
            }
            else {
                return 0
            }
        },
    },
})
