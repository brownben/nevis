export default {
  generateSplits: function (download, matchedControls, course) {
    let splits = []
    const startTime = download.start
    let lastTime = download.start
    for (const control in course) {
      if (matchedControls[control]) {
        splits.push({
          number: parseInt(control) + 1,
          control: course[control],
          splitTime: matchedControls[control].time - lastTime,
          elapsedTime: matchedControls[control].time - startTime,
          punchTime: matchedControls[control].time,
        })
        lastTime = matchedControls[control].time
      }
      else {
        splits.push({
          number: parseInt(control) + 1,
          control: course[control],
          splitTime: null,
          elapsedTime: null,
        })
      }
    }

    for (const control of download.controls) {
      if (matchedControls.indexOf(control) < 0) {
        splits.push({
          number: '*',
          control: control.code,
          splitTime: null,
          elapsedTime: control.time - startTime,
          punchTime: control.time,
          type: 'extra',
        })
      }
    }

    const sortedSplits = splits.sort((a, b) => parseInt(a.punchTime) - parseInt(b.punchTime))
    sortedSplits.push({
      number: 'F',
      control: '',
      splitTime: download.finish - lastTime,
      elapsedTime: download.finish - startTime,
      punchTime: download.finish,
    })
    return sortedSplits
  },
}
