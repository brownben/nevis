var checkCourse = function (cardList, courseList) {
    let cardListCounter = -1
    let courseListCounter = -1
    let errors = ''
    let controlLinks = []
    let correctVisited = courseList.length
    while (cardListCounter < cardList.length && courseListCounter < courseList.length) {
        let match = false
        cardListCounter += 1
        courseListCounter += 1
        if (cardList[cardListCounter].code === courseList[courseListCounter]) {
            controlLinks.push(cardList[cardCounter].time)
            match = true
        }
        else {
            let tempCardListCounter = cardListCounter
            while (tempCardListCounter < cardList.length) {
                tempCardListCounter += 1
                if (cardList[tempCardListCounter].code === courseList[courseListCounter]) {
                    controlLinks.push(cardList[cardCounter].time)
                    match = true
                    cardListCounter = tempCardListCounter
                }
            }
        }
        if (!match) {
            let tempCardListCounter = cardListCounter
            let tempCourseListCounter = courseListCounter
            while (tempCardListCounter < cardList.length && tempCourseListCounter < courseList.length && !match) {
                tempCardListCounter += 1
                tempCourseListCounter += 1
                if (cardList[tempCardListCounter].code === courseList[tempCourseListCounter]) {
                    for (let numberOfWrong = 0; numberOfWrong < tempCourseListCounter - courseListCounter; numberOfWrong += 1) {
                        errors += ' W' + (courseListCounter + numberOfWrong + 1)
                        correctVisited -= 1
                    }
                    match = true
                    controlLinks.push('----')
                    cardListCounter = tempCardListCounter
                    courseListCounter = tempCourseListCounter
                }
            }
        }
        if (!match) {
            let tempCourseListCounter = courseListCounter
            while (tempCourseListCounter < courseList.length) {
                tempCourseListCounter += 1
                if (cardList[cardListCounter].code === courseList[tempCourseListCounter]) {
                    if (tempCourseListCounter - courseListCounter > 1) {
                        errors += ' M' + (courseListCounter + 1) + '-' + tempCourseListCounter
                        correctVisited -= tempCourseListCounter - courseListCounter
                    }
                    else {
                        errors += ' M' + tempCourseListCounter
                        correctVisited -= 1
                    }
                    match = true
                    controlLinks.push('----')
                    courseListCounter = tempCourseListCounter
                }
            }
        }
        if (!match && cardListCounter < cardList.length && courseListCounter < courseList.length) {
            errors += ' W' + (courseListCounter + 1)
            controlLinks.push('----')
            correctVisited -= 1
        }
    }
    if (courseListCounter < courseList.length) {
        correctVisited -= courseList.length - courseListCounter
        errors += ' M' + courseListCounter + '-' + courseList.length
    }
    let percentageCorrect = correctVisited / courseList.length
    return {
        links: controlLinks,
        errors: errors.trim(),
        percentageCorrect: percentageCorrect,
    }
}

module.exports = checkCourse
