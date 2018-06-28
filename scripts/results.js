'use strict'

// The Vue instance for the live view of results
const resultsVue = new Vue({
    el: '#results-overview',

    data: {
        courses: [],
        competitors: [],
    },
    computed: {
        results: function () {
            if (this.courses !== '' && this.courses !== null && this.courses.length > 0 && this.competitors !== '' && this.competitors !== null) {
                let resultsData = []
                for (let course of this.courses) {
                    let competitorsOnCourse = getCompetitorsFinishedOnCourseFromDB(this.competitors, course)
                    if (competitorsOnCourse.length > 0) {
                        let positionCounter = 1
                        for (let competitor of competitorsOnCourse) {
                            if (competitor.class === null) competitor.class = ''
                            if (competitor.nonCompetitive === true) {
                                competitor.position = 'n/c'
                            }
                            else if (isNaN(competitor.download.totalTime)) {
                                competitor.position = ''
                            }
                            else {
                                competitor.position = positionCounter
                                positionCounter = positionCounter + 1
                            }
                        }
                    }
                    if (competitorsOnCourse.length !== 0) resultsData[course.name] = competitorsOnCourse
                }
                return resultsData
            }
            else {
                return {}
            }
        },
    },
    methods: {
        readableTimeElapsedWithErrors: function (timeRaw) {
            if (!isNaN(timeRaw)) {
                let timeMinutes = (timeRaw - (timeRaw % 60)) / 60
                let timeSeconds = timeRaw % 60
                if (timeSeconds <= 9 && timeSeconds >= 0) timeSeconds = '0' + timeSeconds
                if (timeMinutes <= 9 && timeMinutes >= 0) timeMinutes = '0' + timeMinutes
                return timeMinutes + ':' + timeSeconds
            }
            else {
                return timeRaw
            }
        },
    },
})

// Logic for the info dialog
function resultsInfo (type, message) {
    if (type === 'blank') {
        document.getElementById('results-info').innerHTML = ''
        hideResultsInfo()
    }
    else {
        document.getElementById('results-info').innerHTML = document.getElementById('courses-info').innerHTML + '<p class=\'' + type + '\'>' + message + '</p>'
        document.getElementById('results-info').setAttribute('style', 'display:block')
        if (type === 'error') document.getElementById('results-info').setAttribute('class', 'card error')
        else if (type === 'warning') document.getElementById('results-info').setAttribute('class', 'card warning')
        document.getElementById('results-info').setAttribute('class', 'card info')
    }
}

function hideResultsInfo () {
    document.getElementById('results-info').setAttribute('style', 'display:none')
}

// Add Main body of HTML to head for full HTML Documents
function combineHTMLResults (eventName, mainHTML) {
    return `
    <!DOCTYPE html><html><head>
        <title> ${eventInfo.findOne().name} - Results</title>
        <meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1,minimum-scale=1'>
        <style>
        @font-face{font-family:'Roboto';font-style:normal;font-weight:300;src:local('Roboto Light'),local('Roboto-Light'),url("https://fonts.gstatic.com/s/Roboto/v18/KFOlCnqEu92Fr1MmSU5fBBc4.woff2") format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Roboto';font-style:normal;font-weight:400;src:local('Roboto'),local('Roboto-Regular'),url("https://fonts.gstatic.com/s/Roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2") format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}*{box-sizing:border-box}html,body{height:100%;width:100%;margin:0;padding:0}header{color:#fff;background-color:#2196f3;}header h1{text-align:center;font-family:Roboto,'Segoe UI',Oxygen,Ubuntu,'Open Sans',sans-serif;font-weight:300;font-size:2rem;margin:0;padding:.2rem}main{min-height:calc(100% - 4.55rem);padding:1rem 5% 1rem 5%;}main h2{font-family:Roboto,'Segoe UI',Oxygen,Ubuntu,'Open Sans',sans-serif;font-weight:300;font-size:2rem;margin:0;padding:0}main p{font-family:Roboto,'Segoe UI',Oxygen,Ubuntu,'Open Sans',sans-serif;font-weight:300;font-size:1rem;margin:0;padding:.5rem 0}main table{width:100%;border-collapse:collapse;}main table tr{transition:.5s;}main table tr:nth-child(even){background-color:#e3f2fd}main table tr:hover{background-color:#bbdefb}main table td,main table th{text-align:center;font-family:Roboto,'Segoe UI',Oxygen,Ubuntu,'Open Sans',sans-serif;font-weight:300;font-size:1rem;padding:.4rem}main table th{font-weight:400}footer{color:#fff;background-color:#1976d2;}footer p{text-align:center;font-family:Roboto,'Segoe UI',Oxygen,Ubuntu,'Open Sans',sans-serif;font-weight:300;font-size:1rem;margin:0;padding:.3rem}@media (max-width:600px){.club{font-size:0;height:0;width:0;padding:0;margin:0;border:0}}@media (max-width:400px){.class{font-size:0;height:0;width:0;padding:0;margin:0;border:0}}
        </style>
    </head>
    <body>
        ${mainBodyHTMLResults(eventName, mainHTML)}
    </body>
    </html>`
}

function mainBodyHTMLResults (eventName, mainHTML) {
    return `
    <header>
        <h1>${eventName} - Results </h1>
    </header>
    <main>
        ${mainHTML}
        </table>
        </div>
    </main>
    <footer>
        <p> Created: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')} - Results from Nevis</p>
    </footer>
    `
}

function multipleMainBodyHTMLResults (eventName, mainHTML) {
    return `
        ${mainHTML}
        </table>
        </div>
    </main>
    <style>
    div:not(:last-child) {
        page-break-after: always;
    }
    </style>
    <footer>
        <p> Created: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')} - Results from Nevis</p>
    </footer>
    `
}

// The database saerch to get competitors who have finished on a course
function getCompetitorsFinishedOnCourseFromDB (competitors, course) {
    return competitorsDB.chain()
        .find({
            '$and': [
                { 'course': course.name },
                { 'download': { '$ne': null } },
            ],
        })
        .sort(function compare (a, b) {
            if (typeof (b.download.totalTime) === 'number' && a.download.totalTime < b.download.totalTime) return -1
            else if (isNaN(a.download.totalTime) && isNaN(b.download.totalTime)) return a.download.totalTime.length > b.download.totalTime.length
            else if (isNaN(a.download.totalTime)) return 1
            else return 0
        })
        .data()
}

// Place the results from a course into a table
function generateResultTable (competitors, currentHTML) {
    let positionCounter = 1
    for (let competitor of competitors) {
        if (competitor.class === null) competitor.class = ''
        if (competitor.nonCompetitive === true) {
            competitor.position = 'n/c'
        }
        else if (isNaN(competitor.download.totalTime)) {
            competitor.position = ''
        }
        else {
            competitor.position = positionCounter
            positionCounter = positionCounter + 1
        }
        currentHTML += `
            <tr>
                <td>${competitor.position}</td>
                <td>${competitor.name}</td>
                <td class='class'>${competitor.ageClass}</td>
                <td class='club'>${competitor.club}</td>
                <td>${readableTimeElapsed(competitor.download.totalTime)}</td>
            </tr>
        `
    }
    return currentHTML
}

// Create files for the results
function generateHTMLResults () {
    dialog.showSaveDialog({
        title: 'Nevis - Save HTML Results',
        icon: './assets/assets/nevis.ico',
        filters: [
            { name: 'HTML', extensions: ['html'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    }, function (file) {
        resultsInfo('blank')
        if (file) {
            let htmlResults = ''
            for (let course of coursesDB.data) {
                let competitorsOnCourse = getCompetitorsFinishedOnCourseFromDB(competitorsDB, course)
                if (competitorsOnCourse.length > 0) {
                    if (htmlResults !== '') htmlResults += '</table></div>'
                    htmlResults += `<div id='course'><h2 class="course-name" id="${course.name}">${course.name}</h2> <p class="course-details">Length: ${course.length / 1000}km     Climb: ${course.climb}m</p><table><tr><th>Pos.</th><th>Name</th><th class='class'>Class</th><th class='club'>Club</th><th>Time</th></tr>`
                    htmlResults = generateResultTable(competitorsOnCourse, htmlResults)
                }
            }
            fs.writeFileSync(file, combineHTMLResults(eventInfo.findOne().name, htmlResults), 'utf8')
            resultsInfo('info', 'HTML Results Created')
            shell.openExternal('file://' + file)
        }
        else resultsInfo('error', 'Error: Problem Creating Results')
    })
}

function generateXMLResults () {
    dialog.showSaveDialog({
        title: 'Nevis - Save XML Results',
        icon: './assets/assets/nevis.ico',
        filters: [
            { name: 'XML', extensions: ['xml'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    }, function (file) {
        resultsInfo('blank')
        if (file) {
            let xmlResults = ''
            fs.readFile('./views/results.ejs', 'utf8', function (error, data) {
                if (error) {
                    resultsInfo('error', 'Error: Problem Creating Results')
                }
                else {
                    fs.writeFileSync(file, ejs(data, {
                        eventName: eventInfo.findOne().name,
                        eventDate: eventInfo.findOne().date,
                        courses: coursesDB.data,
                        competitors: competitorsDB.data,
                    }), 'utf8')
                    resultsInfo('info', 'XML Results Created')
                }
            })
        }
        else resultsInfo('error', 'Error: Problem Creating Results')
    })
}

function generatePDFResults () {
    dialogs.openConfirmDialog('Nevis - PDF Results', 'How do you want the PDF styled?', 'Single Page', 'Separate Pages').then((singlePage) => {
        dialog.showSaveDialog({
            title: 'Nevis - Save PDF Results',
            icon: './assets/assets/nevis.ico',
            filters: [
                { name: 'PDF', extensions: ['pdf'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        }, function (file) {
            resultsInfo('blank')
            const eventName = eventInfo.findOne().name
            if (file) {
                let htmlResults = ''
                for (let course of coursesDB.data) {
                    if (getCompetitorsFinishedOnCourseFromDB(competitorsDB, course).length > 0) {
                        if (singlePage) {
                            if (htmlResults !== '') htmlResults += `</table></div>`
                            htmlResults += `
                                    <div id='course'>
                                        <h2 class="course-name" id="${course.name}">${course.name}</h2>
                                        <p class="course-details">Length: ${course.length / 1000}km     Climb: ${course.climb}m</p>
                                        <table><tr><th>Pos.</th><th>Name</th><th class='class'>Class</th><th class='club'>Club</th><th>Time</th></tr>`
                        }
                        else {
                            if (htmlResults !== '') {
                                htmlResults += `
                                    </table></div></main>
                                    <footer>
                                        <p> Created: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')} - Results from Nevis</p>
                                    </footer>`
                            }
                            htmlResults = htmlResults + `
                                <style>
                                    div:not(:last-child) {
                                        page-break-after: always;
                                    }
                                </style>
                                    <header>
                                        <h1>${eventName} - Results </h1>
                                    </header>
                                    <main>
                                        <div id='course'>
                                            <h2 class="course-name" id="${course.name}">${course.name}</h2>
                                            <p class="course-details">Length: ${course.length / 1000}km     Climb: ${course.climb}m</p>
                                            <table><tr><th>Pos.</th><th>Name</th><th class='class'>Class</th><th class='club'>Club</th><th>Time</th></tr>`
                        }
                        let competitorsOnCourse = getCompetitorsFinishedOnCourseFromDB(competitorsDB, course)
                        htmlResults = generateResultTable(competitorsOnCourse, htmlResults)
                    }
                }
                if (singlePage) htmlResults = mainBodyHTMLResults(eventName, htmlResults)
                else htmlResults = multipleMainBodyHTMLResults(eventName, htmlResults)
                dialogs.createPDF(file, htmlResults)
                    .then(() => {
                        resultsInfo('info', 'PDF Results Created')
                        shell.openExternal('file://' + file)
                    })
                    .catch((error) => resultsInfo('error', 'Error: Problem Creating PDF'))
            }
            else resultsInfo('error', 'Error: Problem Creating Results')
        })
    })
}
