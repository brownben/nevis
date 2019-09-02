export default (cardList, courseList) => {
  // Initialize Variables
  let cardCounter = -1
  let courseCounter = -1
  let errors = ''
  let wrong = []
  let links = []
  let correctVisited = courseList.length

  while (cardCounter < cardList.length && courseCounter < courseList.length) {
    let match = false
    cardCounter += 1
    courseCounter += 1

    if (cardList[cardCounter] && cardList[cardCounter] === courseList[courseCounter]) {
      match = true
      links.push(cardList[cardCounter])
    }

    else if (cardList[cardCounter + 1] && cardList[cardCounter + 1] === courseList[courseCounter]) {
      cardCounter += 1
      match = true
      links.push(cardList[cardCounter])
    }

    else if (cardList[cardCounter + 1] && cardList[cardCounter + 1] === courseList[courseCounter + 1]) {
      errors += ' W' + (courseCounter + 1)
      correctVisited -= 1
      match = true
      links.push(null)
    }

    else if (cardList[cardCounter] && cardList[cardCounter] === courseList[courseCounter + 1]) {
      courseCounter += 1
      errors += ' M' + courseCounter
      correctVisited -= 1
      match = true
      links.push(null)
    }

    if (!match) {
      let tempCardCounter = cardCounter
      while (!match && tempCardCounter < cardList.length) {
        tempCardCounter += 1
        if (cardList[tempCardCounter] && cardList[tempCardCounter] === courseList[courseCounter]) {
          cardCounter = tempCardCounter
          match = true
          links.push(cardList[cardCounter])
        }
      }
    }

    if (!match) {
      let tempCourseCounter = courseCounter
      while (!match && tempCourseCounter < courseList.length) {
        tempCourseCounter += 1
        if (cardList[cardCounter] && cardList[cardCounter] === courseList[tempCourseCounter]) {
          errors += ' M' + (courseCounter + 1) + '-' + tempCourseCounter
          courseCounter = tempCourseCounter
          correctVisited -= (tempCourseCounter - courseCounter) - 1
          match = true
          links.fill(null, links.length, links.length + tempCourseCounter - courseCounter)
        }
      }
    }

    if (!match) {
      let tempCardCounter = cardCounter
      let tempCourseCounter = courseCounter
      while (!match && tempCardCounter < cardList.length && tempCourseCounter < courseList.length && !match) {
        tempCardCounter += 1
        tempCourseCounter += 1
        if (cardList[tempCardCounter] && cardList[tempCardCounter] === courseList[tempCourseCounter]) {
          errors += ' W' + (courseCounter + 1) + '-' + tempCourseCounter
          cardCounter = tempCardCounter - 1
          courseCounter = tempCourseCounter - 1
          correctVisited -= (tempCourseCounter - courseCounter)
          match = true
          links.fill(null, links.length, links.length + tempCourseCounter - courseCounter)
        }
      }
    }

    if (!match && cardCounter < cardList.length && courseCounter < courseList.length) {
      wrong.push(courseCounter + 1)
      links.push(null)
    }
  }

  if (wrong.length > 1) errors += ' W' + Math.min(...wrong) + '-' + Math.max(...wrong)
  else if (wrong[0]) errors += ' W' + wrong[0]
  correctVisited -= wrong.length

  if (courseCounter < courseList.length) {
    courseCounter += 1
    if (courseList.length - courseCounter > 0) errors += ' M' + courseCounter + '-' + courseList.length
    else errors += ' M' + courseCounter
    correctVisited -= (courseList.length - courseCounter) + 1
  }

  let percentageCorrect = correctVisited / courseList.length
  if (courseList.length === 0) percentageCorrect = 1

  return {
    errors: errors.trim(),
    percentageCorrect: percentageCorrect,
    links: JSON.stringify(links),
  }
}
