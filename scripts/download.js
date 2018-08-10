'use strict'

// The data for the current card downloading between blocks being read
let currentCard = null
// The serialport instance of the current connected port
let port
// The current section of data coming to the serialport before complete
let currentBuffer = Buffer.from([])

// Course Checking Algorithmn. Checks course is completed in correct order
const checkCourse = require('../scripts/courseCheck.js')

// Dropdown Menus to Select Port + Baud Rate + Printer
function downloadBaudMenuToggle () {
    if (document.getElementById('menu-download-baud-dropdown').getAttribute('class') === 'hidden') document.getElementById('menu-download-baud-dropdown').setAttribute('class', '')
    else document.getElementById('menu-download-baud-dropdown').setAttribute('class', 'hidden')
}

function downloadPortMenuToggle () {
    if (document.getElementById('menu-download-port-dropdown').getAttribute('class') === 'hidden') {
        let dropdownData = ''
        SerialPort.list(function (error, ports) {
            if (error === null) {
                if (ports.length < 1) {
                    document.getElementById('menu-download-port-dropdown').innerHTML = '<li onClick=\'downloadChangePort("No Ports Connected")\'>No Ports Connected</li>'
                    document.getElementById('menu-download-port-dropdown').setAttribute('class', '')
                }
                else {
                    for (port of ports) dropdownData = dropdownData + `<li onClick="downloadChangePort('${port.comName}')" >  ${port.comName} </li>`
                    document.getElementById('menu-download-port-dropdown').innerHTML = dropdownData
                    document.getElementById('menu-download-port-dropdown').setAttribute('class', '')
                }
            }
        })
    }
    else {
        document.getElementById('menu-download-port-dropdown').setAttribute('class', 'hidden')
    }
}

function downloadPrinterMenuToggle () {
    if (document.getElementById('menu-download-printer-dropdown').getAttribute('class') === 'hidden') {
        let printers = printer.getPrinters()
        printers = printers.filter(function (eachPrinter) {
            return eachPrinter.name.toUpperCase().includes('EPSON')
        })
        let dropdownData = ''
        if (printers.length < 1) {
            document.getElementById('menu-download-printer-dropdown').innerHTML = '<li onClick=\'downloadChangePrinter("No Printing")\'>No Printing</li>'
            document.getElementById('menu-download-printer-dropdown').setAttribute('class', '')
        }
        else {
            dropdownData += '<li onClick=\'downloadChangePrinter("No Printing")\'>No Printing</li>'
            for (let aPrinter of printers) {
                if (aPrinter.status[0] !== 'NOT-AVAILABLE') dropdownData = dropdownData + `<li onClick="downloadChangePrinter('${aPrinter.name}')" >  ${aPrinter.name} </li>`
            }
            document.getElementById('menu-download-printer-dropdown').innerHTML = dropdownData
            document.getElementById('menu-download-printer-dropdown').setAttribute('class', '')
        }
    }
    else {
        document.getElementById('menu-download-printer-dropdown').setAttribute('class', 'hidden')
    }
}

function downloadModeMenuToggle () {
    if (document.getElementById('menu-download-mode-dropdown').getAttribute('class') === 'hidden') document.getElementById('menu-download-mode-dropdown').setAttribute('class', '')
    else document.getElementById('menu-download-mode-dropdown').setAttribute('class', 'hidden')
}

function downloadChangeBaud (value) {
    document.getElementById('menu-download-baud-button-content').innerText = value
    downloadBaudMenuToggle()
}

function downloadChangePort (value) {
    if (value === 'No Ports Connected') document.getElementById('menu-download-port-button-content').innerText = ' - '
    else document.getElementById('menu-download-port-button-content').innerText = value
    downloadPortMenuToggle()
}

function downloadChangePrinter (value) {
    document.getElementById('menu-download-printer-button-content').innerText = value
    downloadPrinterMenuToggle()
}

function downloadChangeMode (value) {
    document.getElementById('menu-download-mode-button-content').innerText = value
    downloadModeMenuToggle()
}

// Format Time in seconds into Human Readable times
function readableTime (timeRaw) {
    let timeHours = (timeRaw - (timeRaw % 3600)) / 3600
    let timeMinutes = ((timeRaw % 3600) - (timeRaw % 60)) / 60
    let timeSeconds = timeRaw % 60
    if (timeSeconds <= 9 && timeSeconds >= 0) timeSeconds = '0' + timeSeconds
    if (timeMinutes <= 9 && timeMinutes >= 0) timeMinutes = '0' + timeMinutes
    if (timeHours <= 9 && timeHours >= 0) timeHours = '0' + timeHours
    return timeHours + ':' + timeMinutes + ':' + timeSeconds
}

function readableTimeElapsed (timeRaw) {
    if (isNaN(timeRaw)) {
        return timeRaw
    }
    else {
        let timeMinutes = (timeRaw - (timeRaw % 60)) / 60
        let timeSeconds = timeRaw % 60
        if (timeSeconds <= 9 && timeSeconds >= 0) timeSeconds = '0' + timeSeconds
        if (timeMinutes <= 9 && timeMinutes >= 0) timeMinutes = '0' + timeMinutes
        return timeMinutes + ':' + timeSeconds
    }
}

// On button connect define port and connection
function connectPort () {
    if (document.getElementById('menu-download-connect-button').innerText === 'Connect') {
        const portName = document.getElementById('menu-download-port-button-content').innerText
        const portBaud = parseInt(document.getElementById('menu-download-baud-button-content').innerText)
        if (portName !== '-' && portName !== 'Select a Port') {
            currentBuffer = Buffer.from([])
            port = new SerialPort(portName, {
                baudRate: portBaud,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
            })
            port.on('open', function () { document.getElementById('menu-download-connect-button').innerText = 'Disconnect' })
            port.on('data', function (data) {
                const packet = packetData(data)
                if (packet) {
                    processRecievedData(packet, port)
                }
            })
            port.on('error', function () { port.close() })
            port.on('close', function () { document.getElementById('menu-download-connect-button').innerText = 'Connect' })
        }
    }
    else {
        port.close()
        document.getElementById('menu-download-connect-button').innerText = 'Connect'
    }
}

// Parse the incoming stream into the blocks of data from station
function packetData (incomingData) {
    currentBuffer = Buffer.concat([currentBuffer, incomingData])
    const correctDelimiters = currentBuffer[currentBuffer.length - 1] === parseInt(0x03) && currentBuffer[0] === parseInt(0x02)
    const correctLength = (currentBuffer.length === 12 || currentBuffer.length === 136 || currentBuffer.length === 137)
    if (correctDelimiters && correctLength) {
        let toReturn = currentBuffer
        currentBuffer = Buffer.from([])
        return toReturn
    }
    else {
        return null
    }
}

// Enter the data into the database once processed
function processRecievedData (packet, port) {
    let unknown = false
    const inserted = SI.inserted(packet)
    if (inserted) {
        currentCard = inserted
        port.write(currentCard.readData)
    }
    else if (currentCard) {
        if (currentCard.dataRecieved(packet)) {
            const processedData = currentCard.processData(packet, port)
            let competitor = {}
            let courseComplete = {
                links: [],
                errors: '',
                percentageComplete: 1,
            }
            if (processedData) {
                competitor = competitorsDB.findOne({ siid: processedData.siid.toString() })
                if (competitor) {
                    competitor.download = processedData
                    const competitorCourse = coursesDB.findOne({ 'name': competitor.course })
                    if (competitorCourse.controls !== []) {
                        courseComplete = checkCourse(competitor.download.controls, competitorCourse.controls, competitor.download)
                    }
                    if (courseComplete.errors !== '') competitor.download.totalTime = courseComplete.errors
                    competitorsDB.update(competitor)
                }
                else {
                    unknown = true
                    competitor = {
                        name: 'Unknown',
                        course: 'Unknown',
                        siid: processedData.siid.toString(),
                        membershipNumber: '',
                        ageClass: '',
                        club: '',
                        download: processedData,
                        nonCompetitive: false,
                        safetyCheck: null,
                    }
                    if (cards.findOne({ siid: competitor.siid })) {
                        const result = cards.findOne({ siid: competitor.siid })
                        if (!result.name.includes('Hire')) {
                            competitor.name = result.name
                            competitor.membershipNumber = result.membershipNumber
                            competitor.ageClass = calculateAgeClass(result.sex, result.yearOfBirth)
                            competitor.club = result.club
                        }
                    }
                    else if (processedData.name) {
                        competitor.name = processedData.name
                    }
                    let matchedCourse = matchCourse(competitor.download)
                    if (matchedCourse) {
                        competitor.course = matchedCourse.name
                        if (matchedCourse.checked.errors !== '') competitor.download.totalTime = matchedCourse.checked.errors
                        courseComplete = matchedCourse.checked
                    }
                    competitorsDB.insert(competitor)
                }
                document.getElementById('download-latest-download').innerHTML = `
                    <h2>${competitor.name}<h2>
                    <p><b>Course: </b>${competitor.course}</p>
                    <h1>Time: ${readableTimeElapsed(competitor.download.totalTime)}</h1>
                `
                let splits = formatSplits(courseComplete, competitor.download.start, competitor)
                let finish = [competitor.download.finish - splits[1], competitor.download.finish - competitor.download.start]
                printSplits(competitor, splits[0], finish, unknown)
                db.saveDatabase()
                currentCard = null
                document.getElementById('download-latest-download').setAttribute('style', '')
            }
        }
    }
}

// Find Best Matching Course to Download
function matchCourse (downloadData) {
    let cardList = downloadData.controls
    let courses = coursesDB.find()
    let mostCorrect = {
        checked: {
            percentageCorrect: 0,
        },
    }
    for (let course of courses) {
        course.checked = checkCourse(cardList, course.controls, downloadData)
        if (course.checked.percentageCorrect > mostCorrect.checked.percentageCorrect) {
            mostCorrect = course
            mostCorrect.checked.percentageCorrect = course.checked.percentageCorrect
        }
    }
    if (mostCorrect.checked.percentageCorrect > 0.6) return mostCorrect
    else return null
}

// Format data into splits for printing
function formatSplits (courseComplete, start, competitor) {
    let splits = []
    let lastTime = start
    let linksCounter = 0
    for (let courseCounter = 0; courseCounter < coursesDB.findOne({ 'name': competitor.course }).controls.length; courseCounter += 1) {
        if (courseComplete.links[linksCounter] && courseCounter === courseComplete.links[linksCounter].counter) {
            if (lastTime !== '-') {
                splits.push([
                    courseComplete.links[linksCounter].time - lastTime,
                    courseComplete.links[linksCounter].time - competitor.download.start,
                ])
            }
            else {
                splits.push([
                    '--:--',
                    courseComplete.links[linksCounter].time - competitor.download.start,
                ])
            }
            lastTime = courseComplete.links[linksCounter].time
            linksCounter += 1
        }
        else {
            splits.push(['--:--', '--:--'])
            lastTime = '-'
        }
    }
    return [splits, lastTime]
}

// Print Splits
function printSplits (data, splits, finish, unknown) {
    if (document.getElementById('menu-download-printer-button-content').innerText !== 'No Printing') {
        thermalPrinter.init({
            type: 'epson',
            interface: 'printer:' + document.getElementById('menu-download-printer-button-content').innerText,
        })
        thermalPrinter.isPrinterConnected(function (isConnected) {
            if (isConnected) {
                if (unknown && document.getElementById('menu-download-mode-button-content').innerText === 'Check Details') {
                    thermalPrinter.setTypeFontA()
                    thermalPrinter.alignLeft()
                    thermalPrinter.setTextQuadArea()
                    thermalPrinter.println('Sorry')
                    thermalPrinter.newLine()
                    thermalPrinter.setTextNormal()
                    thermalPrinter.println('There has been a problem and your details need checked. Please check your details   and hand this slip in with any corrections')
                    thermalPrinter.newLine()
                    thermalPrinter.println('Name:      ' + data.name)
                    thermalPrinter.println('SI Card:   ' + data.siid)
                    thermalPrinter.println('Course:    ' + data.course)
                    thermalPrinter.println('Age Class: ' + data.ageClass)
                    thermalPrinter.println('Club:      ' + data.club)
                    thermalPrinter.newLine()
                    thermalPrinter.println('__________________________________________')
                    thermalPrinter.newLine()
                    thermalPrinter.println('__________________________________________')
                    thermalPrinter.cut()
                }
                thermalPrinter.setTypeFontA()
                thermalPrinter.alignLeft()
                thermalPrinter.println(eventInfo.findOne().name + ' - ' + eventInfo.findOne().date)
                thermalPrinter.newLine()
                thermalPrinter.setTextQuadArea()
                thermalPrinter.setTypeFontB()
                thermalPrinter.println(data.name)
                thermalPrinter.setTextNormal()
                thermalPrinter.setTypeFontA()
                thermalPrinter.newLine()
                thermalPrinter.println('SI Card: ' + data.siid)
                thermalPrinter.println('Course: ' + data.course)
                thermalPrinter.newLine()
                thermalPrinter.setTextQuadArea()
                thermalPrinter.setTypeFontB()
                thermalPrinter.println('Time: ' + readableTimeElapsed(data.download.totalTime))
                thermalPrinter.setTextNormal()
                thermalPrinter.setTypeFontA()
                thermalPrinter.newLine()
                thermalPrinter.bold(true)
                thermalPrinter.setTypeFontB()
                thermalPrinter.println('Control                             Leg          Elapsed')
                thermalPrinter.setTypeFontA()
                thermalPrinter.bold(false)
                thermalPrinter.println('S                          00:00     00:00')
                let counter = 1
                for (let split of splits) {
                    thermalPrinter.println(counter)
                    if (counter < 10) thermalPrinter.print('                         ')
                    else thermalPrinter.print('                        ')
                    if (readableTimeElapsed(split[0]).length === 5) thermalPrinter.print(' ')
                    thermalPrinter.print(readableTimeElapsed(split[0]))
                    if (readableTimeElapsed(split[1]).length === 5) thermalPrinter.print('     ')
                    else thermalPrinter.print('    ')
                    thermalPrinter.print(readableTimeElapsed(split[1]))
                    counter += 1
                }
                thermalPrinter.println('F                          ' + readableTimeElapsed(finish[0]) + '     ' + readableTimeElapsed(finish[1]))
                thermalPrinter.newLine()
                thermalPrinter.alignRight()
                thermalPrinter.bold(true)
                thermalPrinter.println('Results created by Nevis')
                thermalPrinter.bold(false)
                thermalPrinter.cut()
                thermalPrinter.execute()
            }
        })
    }
}
