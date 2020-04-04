import * as helpers from '@/scripts/si/helpers'
import { beep as beepStation } from '@/scripts/si/instructionSets'

export { card5 as instructionSets } from '@/scripts/si/instructionSets'
export { card5 as packetAnalyser } from '@/scripts/si/packetAnalysers'

export const processData = (data, port) => {
  const punches = []
  const siid = helpers.calculateSIID(0x00, data[11], data[9], data[10])

  if (!helpers.checkUndefined(data.slice(24, 26)))
    punches.push(processPunch(data, 23, 'S'))
  punches.push(...getPunches(data))
  if (!helpers.checkUndefined(data.slice(26, 28)))
    punches.push(processPunch(data, 25, 'F'))

  beepStation(port)
  return { siid, punches: fixPunchTimes(punches) }
}

export const getPunches = (
  data,
  position = 38,
  positionInBlock = 0,
  controls = []
) => {
  if (helpers.checkEmptyPunch(data.slice(position, position + 3)))
    return controls
  else {
    controls.push(processPunch(data, position))

    if (position === 130) return getPunchesExtra(data, 37, controls)
    else if (positionInBlock < 4)
      return getPunches(data, position + 3, positionInBlock + 1, controls)
    else return getPunches(data, position + 4, 0, controls)
  }
}

export const getPunchesExtra = (data, position, controls) => {
  if (position === 133 || parseInt(data[position]) === 0) return controls
  else {
    controls.push({ controlCode: parseInt(data[position]) })
    return getPunchesExtra(data, position + 16, controls)
  }
}

export const processPunch = (data, position, code) => ({
  controlCode: code || parseInt(data[position]),
  time: helpers.combineBytes(data.slice(position + 1, position + 3)),
})

export const fixPunchTimes = (controls) => {
  let lastPunchTime = 0
  for (const control of controls) {
    if (control.time < lastPunchTime)
      control.time += helpers.SECONDS_IN_12_HOURS
    lastPunchTime = control.time
  }
  return controls
}
