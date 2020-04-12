const splitPunches = (punches) => {
  const startTime =
    punches.filter((punch) => punch.controlCode === 'S')?.[0]?.time ?? null

  const finishTime =
    punches.filter((punch) => punch.controlCode === 'F')?.[0]?.time ?? null

  const controlPunches = punches
    .map((punch) => ({ time: punch.time, controlCode: punch.controlCode }))
    .filter((punch) => punch.controlCode !== 'S' && punch.controlCode !== 'F')

  return { startTime, finishTime, controlPunches }
}

export const calculateSplits = (punches, matchedControls, course) => {
  const { startTime, finishTime, controlPunches } = splitPunches(punches)

  let lastTime = startTime

  const matchedPunches = matchedControls.map((control) => {
    const indexOfControl = matchedControls.indexOf(control)
    if (control && control.time && startTime) {
      lastTime = control.time
      return {
        number: indexOfControl + 1,
        controlCode: control.controlCode,
        splitTime: control.time - lastTime,
        elapsedTime: control.time - startTime,
        punchTime: control.time,
      }
    } else if (startTime)
      return {
        number: indexOfControl + 1,
        controlCode: course[indexOfControl],
        splitTime: null,
        elapsedTime: null,
        type: 'missing',
      }
    else
      return {
        number: indexOfControl + 1,
        controlCode: course[indexOfControl],
        punchTime: control.time,
        type: 'noStart',
      }
  })

  const matcchedControlsString = JSON.stringify(matchedControls)
  const extraPunches = controlPunches
    .filter(
      (control) => !matcchedControlsString.includes(JSON.stringify(control))
    )
    .map((control) => ({
      number: '*',
      controlCode: control.controlCode,
      splitTime: null,
      elapsedTime: control.time - startTime,
      punchTime: control.time,
      type: 'extra',
    }))

  const splits = [...matchedPunches, ...extraPunches]

  const sortedSplits = splits.sort(
    (a, b) => parseInt(a.punchTime) - parseInt(b.punchTime)
  )

  if (startTime)
    sortedSplits.unshift({
      number: 'S',
      controlCode: '',
      splitTime: null,
      elapsedTime: 0,
      punchTime: startTime,
    })

  if (finishTime)
    sortedSplits.push({
      number: 'F',
      controlCode: '',
      splitTime: finishTime - lastTime,
      elapsedTime: finishTime - startTime,
      punchTime: finishTime,
    })

  return sortedSplits
}
