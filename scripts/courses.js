'use strict'

// The Vue instance for live view of courses
const coursesVue = new Vue({
    el: '#courses',
    data: {
        courses: { data: [] },
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

// Basic Course functions add, update, delete
function addCourse () {
    coursesInfo('blank')
    if (document.getElementById('courses-add-name').value === '') {
        coursesInfo('error', ' Error: No Name specified for Course ')
    }
    else {
        try {
            let lengthValue = Math.round(parseFloat(document.getElementById('courses-add-length').value) * 1000)
            let climbValue = parseInt(document.getElementById('courses-add-climb').value)
            let controls = document.getElementById('courses-add-controls').value.split(',').map((item) => parseInt(item))
            if (isNaN(lengthValue)) lengthValue = 0
            if (isNaN(climbValue)) climbValue = 0
            if (controls.length === 1 && !controls[0]) controls = []
            coursesDB.insert({
                name: document.getElementById('courses-add-name').value,
                climb: climbValue,
                length: lengthValue,
                controls: controls,
            })
            db.saveDatabase()
            blankCourse()
        }
        catch (error) {
            coursesInfo('error', ' Error: An course with this name already exists')
        }
    }
}

function updateCourse () {
    coursesInfo('blank')
    if (document.getElementById('courses-add-name').value === '') {
        coursesInfo('error', ' Error: No Name specified for Course ')
    }
    else {
        const courseToUpdate = coursesDB.findOne({ $loki: parseInt(document.getElementById('courses-add-id').value) })
        const originalControls = courseToUpdate.controls
        try {
            courseToUpdate.name = document.getElementById('courses-add-name').value
            courseToUpdate.climb = document.getElementById('courses-add-climb').value
            courseToUpdate.length = Math.round(parseFloat(document.getElementById('courses-add-length').value) * 1000)
            courseToUpdate.controls = document.getElementById('courses-add-controls').value.split(',').map((item) => parseInt(item))
            coursesDB.update(courseToUpdate)
        }
        catch (error) {
            coursesInfo('error', ' Error: An course with this name already exists ')
        }
        if (originalControls !== courseToUpdate.controls && competitorsDB.find({ course: document.getElementById('courses-add-name').value }).length > 1) {
            for (let competitor of competitorsDB.find({ course: document.getElementById('courses-add-name').value })) {
                const courseComplete = checkCourse(competitor.download.controls, courseToUpdate.controls)
                if (courseComplete.errors !== '') competitor.download.totalTime = courseComplete.errors
                else competitor.download.totalTime = competitor.download.finish - competitor.download.start
                competitorsDB.update(competitor)
            }
        }
        db.saveDatabase()
        blankCourse()
        navigatePage('Courses')
        document.getElementById('courses-add-id').value = ''
    }
}

function deleteCourse () {
    dialogs.openConfirmDialog('Nevis - Delete Course', 'Are you sure you want to Delete this Course?', 'Delete', 'Cancel').then((state) => {
        if (state) {
            coursesDB.removeWhere({ $loki: parseInt(document.getElementById('courses-add-id').value) })
            db.saveDatabase()
            blankCourse()
            navigatePage('Courses')
            coursesInfo('info', ' Course Deleted')
            document.getElementById('courses-add-id').value = ''
        }
    })
}

// Import course from different file types
const importCourses = function () {
    dialog.showOpenDialog({
        title: 'Nevis - Import Courses',
        filters: [
            { name: 'IOF XML 3.0', extensions: ['xml'] },
            { name: 'Nevis JSON', extensions: ['JSON'] },
            { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile'],
    }, function (paths) {
        if (paths) {
            fs.exists(paths[0], function (exists) {
                if (exists && paths[0].split('.')[1].toLowerCase() === 'xml') {
                    importXMLCourses(paths[0])
                }
                else if (exists && paths[0].split('.')[1].toLowerCase() === 'json') {
                    importJSONCourses(paths[0])
                }
            })
        }
    })
}

const importXMLCourses = function (path) {
    parseXML(fs.readFileSync(path, 'utf8'), function (error, result) {
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

const importJSONCourses = function (path) {
    let errorFound = false
    let courseData = ''
    try {
        courseData = fs.readFileSync(path, 'utf8')
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

// Navigate between add courses and update and refresh the data
function courseLink (id) {
    navigatePage('Courses/Update')
    let linkedCourse = coursesDB.findOne({ $loki: parseInt(id) })
    document.getElementById('courses-add-id').value = id
    document.getElementById('courses-add-name').value = linkedCourse.name
    document.getElementById('courses-add-climb').value = linkedCourse.climb
    document.getElementById('courses-add-length').value = linkedCourse.length / 1000
    document.getElementById('courses-add-controls').value = linkedCourse.controls
}

function blankCourse () {
    document.getElementById('courses-add-name').value = ''
    document.getElementById('courses-add-climb').value = ''
    document.getElementById('courses-add-length').value = ''
    document.getElementById('courses-add-controls').value = ''
}
