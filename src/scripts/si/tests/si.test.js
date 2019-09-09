import si from '@/scripts/si/si'

import * as helpers from '@/scripts/si/helpers'
import * as card5 from '@/scripts/si/card5'
import * as card10 from '@/scripts/si/card10'

test('Parse Data', () => {
  const port = { flush: jest.fn(), write: jest.fn() }

  jest.spyOn(card5.instructionSets, 'getData')
  jest.spyOn(card10.instructionSets, 'getData0')
  card5.processData = jest.fn()
  card10.processData = jest.fn()

  helpers.validityCheck = jest.fn(() => false)
  si.parseData([], port)
  expect(port.flush).toHaveBeenCalled()

  helpers.validityCheck = jest.fn(() => true)
  card5.packetAnalyser.inserted = jest.fn(() => true)
  si.parseData([], port)
  expect(card5.instructionSets.getData).toHaveBeenCalled()

  card5.packetAnalyser.inserted = jest.fn(() => false)
  card10.packetAnalyser.inserted = jest.fn(() => true)
  si.parseData([], port)
  expect(card10.instructionSets.getData0).toHaveBeenCalled()

  card10.packetAnalyser.inserted = jest.fn(() => false)
  card5.packetAnalyser.data = jest.fn(() => true)
  si.parseData([], port)
  expect(card5.processData).toHaveBeenCalled()

  card5.packetAnalyser.data = jest.fn(() => false)
  card10.packetAnalyser.data = jest.fn(() => true)
  si.parseData([], port)
  expect(card10.processData).toHaveBeenCalled()

  card10.packetAnalyser.data = jest.fn(() => false)
  si.parseData([], port)
  expect(port.flush).toHaveBeenCalledTimes(1)
  expect(card5.instructionSets.getData).toHaveBeenCalledTimes(1)
  expect(card10.instructionSets.getData0).toHaveBeenCalledTimes(1)
  expect(card5.processData).toHaveBeenCalledTimes(1)
  expect(card10.processData).toHaveBeenCalledTimes(1)
})
