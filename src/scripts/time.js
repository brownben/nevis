export default {
  elapsed: totalTimeInSeconds => {
    const timeInMinutes = Math.floor(totalTimeInSeconds / 60)
    const timeInSeconds = totalTimeInSeconds % 60
    return timeInMinutes + ':' + timeInSeconds
  },
  actual: totalTimeInSeconds => {
    const timeInHours = Math.floor(totalTimeInSeconds / 3600)
    const timeInMinutes = Math.floor((totalTimeInSeconds % 3600) / 60)
    const timeInSeconds = (totalTimeInSeconds % 3600) % 60
    return timeInHours + ':' + timeInMinutes + ':' + timeInSeconds
  },
  calculateTime: function (download) {
    if (download.other !== '') return download.other
    const time = download.finish - download.start
    return time
  },
}
