'use strict'

let checkCourse = function (cardList, courseList, downloadData) {
    let cardListCounter = -1
    let courseListCounter = -1
    let errors = ''
    let controlLinks = []
    let correctVisited = courseList.length
    while (cardListCounter < cardList.length && courseListCounter < courseList.length) {
        let match = false
        cardListCounter += 1
        courseListCounter += 1
        if (cardList[cardListCounter] && cardList[cardListCounter].code === courseList[courseListCounter]) {
            controlLinks.push({
                counter: courseListCounter,
                time: cardList[cardListCounter].time,
            })
            match = true
        }
        else {
            let tempCardListCounter = cardListCounter
            while (tempCardListCounter < cardList.length) {
                tempCardListCounter += 1
                if (cardList[tempCardListCounter] && cardList[tempCardListCounter].code === courseList[courseListCounter]) {
                    cardListCounter = tempCardListCounter
                    controlLinks.push({
                        counter: courseListCounter,
                        time: cardList[cardListCounter].time,
                    })
                    match = true
                }
            }
        }
        if (!match) {
            let tempCardListCounter = cardListCounter
            let tempCourseListCounter = courseListCounter
            while (tempCardListCounter < cardList.length && tempCourseListCounter < courseList.length && !match) {
                tempCardListCounter += 1
                tempCourseListCounter += 1
                if (cardList[tempCardListCounter] && cardList[tempCardListCounter].code === courseList[tempCourseListCounter]) {
                    errors += ' W' + (courseListCounter + 1)
                    correctVisited -= 1
                    match = true
                }
            }
        }
        if (!match) {
            let tempCourseListCounter = courseListCounter
            while (tempCourseListCounter < courseList.length) {
                tempCourseListCounter += 1
                if (cardList[cardListCounter] && cardList[cardListCounter].code === courseList[tempCourseListCounter]) {
                    if (tempCourseListCounter - courseListCounter > 1) {
                        errors += ' M' + (courseListCounter + 1) + '-' + tempCourseListCounter
                        correctVisited -= tempCourseListCounter - courseListCounter
                    }
                    else {
                        errors += ' M' + tempCourseListCounter
                        correctVisited -= 1
                    }
                    match = true
                    courseListCounter = tempCourseListCounter
                    controlLinks.push({
                        counter: courseListCounter,
                        time: cardList[cardListCounter].time,
                    })
                }
            }
        }
        if (!match && cardListCounter < cardList.length && courseListCounter < courseList.length) {
            errors += ' W' + (courseListCounter + 1)
            correctVisited -= 1
        }
    }
    if (courseListCounter < courseList.length) {
        courseListCounter += 1
        correctVisited -= courseList.length - courseListCounter
        if (courseList.length - courseListCounter > 1) errors += ' M' + courseListCounter + '-' + courseList.length
        else errors += ' M' + courseListCounter
    }
    let percentageCorrect = correctVisited / courseList.length
    if (downloadData.start === null) errors = 'MS' + errors
    if (downloadData.finish === null) errors += 'DNF'
    return {
        links: controlLinks,
        errors: errors.trim(),
        percentageCorrect: percentageCorrect,
    }
}

module.exports = checkCourse
