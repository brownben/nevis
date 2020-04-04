const twoDigits = (number) => {
  if (number.toString().length < 2) return `0${number.toString()}`
  else return number
}

export default {
  elapsed: (totalTimeInSeconds) => {
    const timeInMinutes = Math.floor(totalTimeInSeconds / 60)
    const timeInSeconds = Math.abs(totalTimeInSeconds % 60)
    return `${twoDigits(timeInMinutes)}:${twoDigits(timeInSeconds)}`
  },

  actual: (totalTimeInSeconds) => {
    const timeInHours = Math.floor(totalTimeInSeconds / 3600)
    const timeInMinutes = Math.floor((totalTimeInSeconds % 3600) / 60)
    const timeInSeconds = (totalTimeInSeconds % 3600) % 60
    return `${twoDigits(timeInHours)}:${twoDigits(timeInMinutes)}:${twoDigits(
      timeInSeconds
    )}`
  },

  calculateTime: (download) => {
    if (download.other !== '') return download.other
    return download.finish - download.start
  },

  displayTime: function (result, errors) {
    if (errors) return errors
    else return this.elapsed(result)
  },

  displayActualTime: function (result, errors) {
    if (errors) return errors
    else return this.actual(result)
  },

  timeToSeconds: function (string) {
    const parts = string.split(':')
    if (parts.length === 3) {
      let time = 0
      time += 3600 * parseInt(parts[0])
      time += 60 * parseInt(parts[1])
      time += parseInt(parts[2])
      return Math.round(time)
    }
  },
}
