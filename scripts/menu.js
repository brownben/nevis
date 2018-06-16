'use strict'
module.exports.navigatePage = function (page) {
    if (page === 'Welcome') {
        document.getElementById('welcome').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('menu').setAttribute('style', 'display:none')
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-back').setAttribute('style', 'display:none')
    }
    else if (page === 'Home') {
        document.getElementById('welcome').setAttribute('style', 'display:none')
        document.getElementById('home').setAttribute('style', 'display:block')
        document.getElementById('menu').setAttribute('style', 'display:block')
        document.getElementById('menu-main').setAttribute('style', 'display:block')
        document.getElementById('menu-back').setAttribute('style', 'display:none')
    }
    else if (page === 'Download') {
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-download').setAttribute('style', 'display:block')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('download').setAttribute('style', 'display:block')
    }
    else if (page === 'Entries') {
        entriesAddCourseDropdownRefresh()
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-entries').setAttribute('style', 'display:block')
        document.getElementById('menu-entries-add').setAttribute('style', 'display:none')
        document.getElementById('menu-entries-update').setAttribute('style', 'display:none')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('entries').setAttribute('style', 'display:block')
        document.getElementById('entries-info').setAttribute('style', 'display:none')
        document.getElementById('entries-search').setAttribute('style', 'display:block')
        document.getElementById('entries-add').setAttribute('style', 'display:none')
        document.getElementById('entries-download-data').setAttribute('style', 'display:none')
    }
    else if (page === 'Entries/Add') {
        blankEntry()
        entriesAddCourseDropdownRefresh()
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-entries').setAttribute('style', 'display:none')
        document.getElementById('menu-entries-add').setAttribute('style', 'display:block')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('entries').setAttribute('style', 'display:block')
        document.getElementById('entries-info').setAttribute('style', 'display:none')
        document.getElementById('entries-search').setAttribute('style', 'display:none')
        document.getElementById('entries-add').setAttribute('style', 'display:block')
        document.getElementById('entries-download-data').setAttribute('style', 'display:none')
    }
    else if (page === 'Entries/Update') {
        blankEntry()
        entriesAddCourseDropdownRefresh()
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-entries').setAttribute('style', 'display:none')
        document.getElementById('menu-entries-add').setAttribute('style', 'display:none')
        document.getElementById('menu-entries-update').setAttribute('style', 'display:block')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('entries').setAttribute('style', 'display:block')
        document.getElementById('entries-info').setAttribute('style', 'display:none')
        document.getElementById('entries-search').setAttribute('style', 'display:none')
        document.getElementById('entries-add').setAttribute('style', 'display:block')
        document.getElementById('entries-download-data').setAttribute('style', 'display:none')
    }
    else if (page === 'Courses') {
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('menu-courses').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('courses').setAttribute('style', 'display:block')
        document.getElementById('courses-overview').setAttribute('style', 'display:block')
        document.getElementById('menu-courses-add').setAttribute('style', 'display:none')
        document.getElementById('courses-add').setAttribute('style', 'display:none')
        document.getElementById('menu-courses-update').setAttribute('style', 'display:none')
    }
    else if (page === 'Courses/Add') {
        blankCourse()
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('menu-courses').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('courses').setAttribute('style', 'display:block')
        document.getElementById('courses-overview').setAttribute('style', 'display:none')
        document.getElementById('menu-courses-add').setAttribute('style', 'display:block')
        document.getElementById('courses-add').setAttribute('style', 'display:block')
        document.getElementById('menu-courses-update').setAttribute('style', 'display:none')
    }
    else if (page === 'Courses/Update') {
        blankCourse()
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('menu-courses').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('courses').setAttribute('style', 'display:block')
        document.getElementById('courses-overview').setAttribute('style', 'display:none')
        document.getElementById('menu-courses-add').setAttribute('style', 'display:none')
        document.getElementById('courses-add').setAttribute('style', 'display:block')
        document.getElementById('menu-courses-update').setAttribute('style', 'display:block')
    }
    else if (page === 'Results') {
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('menu-results').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('results').setAttribute('style', 'display:block')
    }
    else if (page === 'About') {
        document.getElementById('menu-main').setAttribute('style', 'display:none')
        document.getElementById('menu-back').setAttribute('style', 'display:block')
        document.getElementById('home').setAttribute('style', 'display:none')
        document.getElementById('about').setAttribute('style', 'display:block')
    }
    else {
        if (currentLocation === 'Entries/Add' || currentLocation === 'Entries/Update') {
            document.getElementById('menu-main').setAttribute('style', 'display:none')
            document.getElementById('menu-entries').setAttribute('style', 'display:block')
            document.getElementById('menu-entries-add').setAttribute('style', 'display:none')
            document.getElementById('menu-entries-update').setAttribute('style', 'display:none')
            document.getElementById('menu-back').setAttribute('style', 'display:block')
            document.getElementById('home').setAttribute('style', 'display:none')
            document.getElementById('entries').setAttribute('style', 'display:block')
            document.getElementById('entries-info').setAttribute('style', 'display:none')
            document.getElementById('entries-search').setAttribute('style', 'display:block')
            document.getElementById('entries-add').setAttribute('style', 'display:none')
            document.getElementById('entries-download-data').setAttribute('style', 'display:none')
        }
        else if (currentLocation === 'Courses/Add' || currentLocation === 'Courses/Update') {
            document.getElementById('menu-main').setAttribute('style', 'display:none')
            document.getElementById('menu-back').setAttribute('style', 'display:block')
            document.getElementById('menu-courses').setAttribute('style', 'display:block')
            document.getElementById('home').setAttribute('style', 'display:none')
            document.getElementById('courses').setAttribute('style', 'display:block')
            document.getElementById('courses-overview').setAttribute('style', 'display:block')
            document.getElementById('menu-courses-add').setAttribute('style', 'display:none')
            document.getElementById('courses-add').setAttribute('style', 'display:none')
            document.getElementById('menu-courses-update').setAttribute('style', 'display:none')
        }
        else {
            document.getElementById('menu').setAttribute('style', 'display:block')
            document.getElementById('menu-main').setAttribute('style', 'display:block')
            document.getElementById('menu-download').setAttribute('style', 'display:none')
            document.getElementById('menu-entries').setAttribute('style', 'display:none')
            document.getElementById('menu-entries-add').setAttribute('style', 'display:none')
            document.getElementById('menu-entries-update').setAttribute('style', 'display:none')
            document.getElementById('menu-courses').setAttribute('style', 'display:none')
            document.getElementById('menu-results').setAttribute('style', 'display:none')
            document.getElementById('menu-back').setAttribute('style', 'display:none')
            document.getElementById('welcome').setAttribute('style', 'display:none')
            document.getElementById('home').setAttribute('style', 'display:block')
            document.getElementById('download').setAttribute('style', 'display:none')
            document.getElementById('entries').setAttribute('style', 'display:none')
            document.getElementById('entries-info').setAttribute('style', 'display:none')
            document.getElementById('entries-search').setAttribute('style', 'display:none')
            document.getElementById('entries-add').setAttribute('style', 'display:none')
            document.getElementById('entries-download-data').setAttribute('style', 'display:none')
            document.getElementById('results').setAttribute('style', 'display:none')
            document.getElementById('courses').setAttribute('style', 'display:none')
            document.getElementById('courses-overview').setAttribute('style', 'display:none')
            document.getElementById('about').setAttribute('style', 'display:none')
            document.getElementById('courses-overview').setAttribute('style', 'display:none')
            document.getElementById('menu-courses-add').setAttribute('style', 'display:none')
            document.getElementById('courses-add').setAttribute('style', 'display:none')
            document.getElementById('menu-courses-update').setAttribute('style', 'display:none')
        }
    }
    currentLocation = page
}
