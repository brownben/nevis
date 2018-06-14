'use strict'

// The Vue instance for live view of courses
const coursesVue = new Vue({
    el: '#courses',
    data: {
        courses: [],
    },
})

// Logic for the info dialog
const coursesInfo = function (type, message) {
    if (type === 'blank') {
        document.getElementById('courses-info').innerHTML = ''
        hideCoursesInfo()
    }
    else {
        document.getElementById('courses-info').innerHTML = document.getElementById('courses-info').innerHTML + '<p class=\'' + type + '\'>' + message + '</p>'
        document.getElementById('courses-info').setAttribute('style', 'display:block')
        if (type === 'error') document.getElementById('courses-info').setAttribute('class', 'card error')
        else if (type === 'warning') document.getElementById('courses-info').setAttribute('class', 'card warning')
        else document.getElementById('courses-info').setAttribute('class', 'card info')
    }
}

const hideCoursesInfo = function () {
    document.getElementById('courses-info').setAttribute('style', 'display:none')
}

// Import course from different file types
const importXMLCourses = function () {
    dialog.showOpenDialog({
        title: 'Nevis - Import Courses',
        filters: [
            { name: 'IOF XML 3.0', extensions: ['xml'] },
            { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile'],
    }, function (paths) {
        if (paths) {
            fs.exists(paths[0], function (exists) {
                if (exists) {
                    parseXML(fs.readFileSync(paths[0], 'utf8'), function (error, result) {
                        try {
                            for (let courseData of result.CourseData.RaceCourseData[0].Course) {
                                let course = {
                                    name: courseData.Name[0],
                                    controls: [],
                                    length: 0,
                                    climb: 0,
                                }
                                if (courseData.Length[0]) course.length = courseData.Length[0]
                                if (courseData.Climb[0]) course.climb = courseData.Climb[0]
                                for (let control of courseData.CourseControl) {
                                    if (control.Control[0] !== 'S' && control.Control[0] !== 'F') course.controls.push(parseInt(control.Control[0]))
                                }
                                try {
                                    coursesDB.insert(course)
                                }
                                catch (error) {
                                    coursesInfo('error', 'Error: A course already exists with the name - ' + course.name)
                                }
                            }
                            db.saveDatabase()
                            coursesInfo('info', result.CourseData.RaceCourseData[0].Course.length + ' Courses Imported from XML')
                        }
                        catch (error) {
                            coursesInfo('blank')
                            coursesInfo('error', 'Error: File format is invalid')
                        }
                    })
                }
            })
        }
    })
}

const importJSONCourses = function () {
    dialog.showOpenDialog({
        title: 'Nevis - Import Courses',
        filters: [
            { name: 'Nevis JSON', extensions: ['JSON'] },
            { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile'],
    }, function (paths) {
        if (paths) {
            fs.exists(paths[0], function (exists) {
                if (exists) {
                    let errorFound = false
                    let courseData = ''
                    try {
                        courseData = fs.readFileSync(paths[0], 'utf8')
                    }
                    catch (error) {
                        coursesInfo('error', 'Error: File format is invalid')
                        errorFound = true
                    }
                    if (!errorFound) {
                        try {
                            coursesDB.insert(JSON.parse(courseData))
                            db.saveDatabase()
                            coursesInfo('info', 'Course Imported from JSON')
                        }
                        catch (error) {
                            coursesInfo('error', 'Error: A course already exists with the same name')
                        }
                    }
                }
            })
        }
    })
}

// Remove all courses
const deleteAllCourses = function () {
    dialogs.openConfirmDialog('Nevis - Delete All Courses', 'Are you sure you want to Delete All Courses?', 'Delete All', 'Cancel').then((state) => {
        if (state) {
            coursesDB.chain().find().remove()
            db.saveDatabase()
            coursesInfo('blank')
            coursesInfo('info', 'All Courses Deleted')
            coursesVue.courses = coursesDB.data
            homeVue.courses = coursesDB.data
        }
    })
}
