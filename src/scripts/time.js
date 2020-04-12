const twoDigits = (number) => {
  if (number.toString().length < 2) return `0${number.toString()}`
  else return number
}

export const elapsed = (totalTimeInSeconds) => {
  const timeInMinutes = Math.floor(totalTimeInSeconds / 60)
  const timeInSeconds = Math.abs(totalTimeInSeconds % 60)
  return `${twoDigits(timeInMinutes)}:${twoDigits(timeInSeconds)}`
}

export const actual = (totalTimeInSeconds) => {
  const timeInHours = Math.floor(totalTimeInSeconds / 3600)
  const timeInMinutes = Math.floor((totalTimeInSeconds % 3600) / 60)
  const timeInSeconds = (totalTimeInSeconds % 3600) % 60
  return `${twoDigits(timeInHours)}:${twoDigits(timeInMinutes)}:${twoDigits(
    timeInSeconds
  )}`
}

export const calculateTime = (download) => {
  if (download.other !== '') return download.other
  return download.finish - download.start
}

export const displayTime = (result, errors) => {
  if (errors) return errors
  else return elapsed(result)
}

export const displayActualTime = (result, errors) => {
  if (errors) return errors
  else return actual(result)
}

export const displayTimeForSplits = (time) => {
  if (typeof time === 'number') return elapsed(time)
  else return '--:--'
}

export const displayActualTimeForSplits = (time) => {
  if (typeof time === 'number') return actual(time)
  else return '--:--'
}

export const timeToSeconds = (string) => {
  const parts = string.split(':')
  if (parts.length === 3) {
    let time = 0
    time += 3600 * parseInt(parts[0])
    time += 60 * parseInt(parts[1])
    time += parseInt(parts[2])
    return Math.round(time)
  }
}
