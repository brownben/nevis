import * as time from '@/scripts/time'

test('Calculate Time', () => {
  expect(time.calculateTime({ start: 0, finish: 0, other: '' })).toBe(0)
  expect(time.calculateTime({ start: 10, finish: 20, other: '' })).toBe(10)
  expect(time.calculateTime({ start: 2124, finish: 5445, other: '' })).toBe(
    3321
  )
  expect(time.calculateTime({ start: 20, finish: 5468524, other: '' })).toBe(
    5468504
  )
  expect(time.calculateTime({ start: 0, finish: 0, other: 'MS' })).toBe('MS')
  expect(time.calculateTime({ start: 10, finish: 20, other: 'MF' })).toBe('MF')
  expect(time.calculateTime({ start: 2124, finish: 5445, other: 'Test' })).toBe(
    'Test'
  )
  expect(
    time.calculateTime({ start: 20, finish: 5468524, other: 'MS W1 M2-3 MF' })
  ).toBe('MS W1 M2-3 MF')
})

test('Elapsed Time', () => {
  expect(time.elapsed(0)).toBe('00:00')
  expect(time.elapsed(1)).toBe('00:01')
  expect(time.elapsed(45)).toBe('00:45')
  expect(time.elapsed(60)).toBe('01:00')
  expect(time.elapsed(83)).toBe('01:23')
  expect(time.elapsed(1023)).toBe('17:03')
  expect(time.elapsed(3600)).toBe('60:00')
  expect(time.elapsed(5117)).toBe('85:17')
})

test('Actual Time', () => {
  expect(time.actual(0)).toBe('00:00:00')
  expect(time.actual(1)).toBe('00:00:01')
  expect(time.actual(45)).toBe('00:00:45')
  expect(time.actual(60)).toBe('00:01:00')
  expect(time.actual(83)).toBe('00:01:23')
  expect(time.actual(1023)).toBe('00:17:03')
  expect(time.actual(3600)).toBe('01:00:00')
  expect(time.actual(11520)).toBe('03:12:00')
  expect(time.actual(32130)).toBe('08:55:30')
  expect(time.actual(42443)).toBe('11:47:23')
})

test('Display Time', () => {
  expect(time.displayTime(0)).toBe('00:00')
  expect(time.displayTime(1)).toBe('00:01')
  expect(time.displayTime(45)).toBe('00:45')
  expect(time.displayTime(60)).toBe('01:00')
  expect(time.displayTime(83)).toBe('01:23')
  expect(time.displayTime(1023)).toBe('17:03')
  expect(time.displayTime(3600)).toBe('60:00')
  expect(time.displayTime(11520)).toBe('192:00')
  expect(time.displayTime(5117, '')).toBe('85:17')
  expect(time.displayTime(5117, 'MS')).toBe('MS')
  expect(time.displayTime(5117, 'W1')).toBe('W1')
  expect(time.displayTime(125, 'MS')).toBe('MS')
  expect(time.displayTime(141, 'MF')).toBe('MF')
  expect(time.displayTime(8556894, 'Test')).toBe('Test')
  expect(time.displayTime(0, 'MS W1 M2-3 MF')).toBe('MS W1 M2-3 MF')
})

test('Display Actual Time', () => {
  expect(time.displayActualTime(0)).toBe('00:00:00')
  expect(time.displayActualTime(1)).toBe('00:00:01')
  expect(time.displayActualTime(45)).toBe('00:00:45')
  expect(time.displayActualTime(60)).toBe('00:01:00')
  expect(time.displayActualTime(83)).toBe('00:01:23')
  expect(time.displayActualTime(1023)).toBe('00:17:03')
  expect(time.displayActualTime(3600)).toBe('01:00:00')
  expect(time.displayActualTime(11520)).toBe('03:12:00')
  expect(time.displayActualTime(32130)).toBe('08:55:30')
  expect(time.displayActualTime(42443, '')).toBe('11:47:23')
  expect(time.displayActualTime(0, 'MS')).toBe('MS')
  expect(time.displayActualTime(12355, 'MF')).toBe('MF')
  expect(time.displayActualTime(56445, 'Test')).toBe('Test')
  expect(time.displayActualTime(223, 'MS W1 M2-3 MF')).toBe('MS W1 M2-3 MF')
})

test('Time To Seconds', () => {
  expect(time.timeToSeconds('19:00:00')).toBe(68400)
  expect(time.timeToSeconds('19:41:00')).toBe(70860)
  expect(time.timeToSeconds('19:41:03')).toBe(70863)
  expect(time.timeToSeconds('19:0000')).toBe(undefined)
  expect(time.timeToSeconds('19:00')).toBe(undefined)
  expect(time.timeToSeconds('19')).toBe(undefined)
})

test('Display Time For Splits', () => {
  expect(time.displayTimeForSplits(1)).toBe('00:01')
  expect(time.displayTimeForSplits(45)).toBe('00:45')
  expect(time.displayTimeForSplits(60)).toBe('01:00')
  expect(time.displayTimeForSplits(83)).toBe('01:23')
  expect(time.displayTimeForSplits(1023)).toBe('17:03')
  expect(time.displayTimeForSplits(3600)).toBe('60:00')
  expect(time.displayTimeForSplits(11520)).toBe('192:00')
  expect(time.displayTimeForSplits('a')).toBe('--:--')
  expect(time.displayTimeForSplits(null)).toBe('--:--')
  expect(time.displayTimeForSplits(undefined)).toBe('--:--')
  expect(time.displayTimeForSplits({})).toBe('--:--')
  expect(time.displayTimeForSplits([])).toBe('--:--')
})

test('Display Actual Time For Splits', () => {
  expect(time.displayActualTimeForSplits(0)).toBe('00:00:00')
  expect(time.displayActualTimeForSplits(1)).toBe('00:00:01')
  expect(time.displayActualTimeForSplits(45)).toBe('00:00:45')
  expect(time.displayActualTimeForSplits(60)).toBe('00:01:00')
  expect(time.displayActualTimeForSplits(83)).toBe('00:01:23')
  expect(time.displayActualTimeForSplits(1023)).toBe('00:17:03')
  expect(time.displayActualTimeForSplits(3600)).toBe('01:00:00')
  expect(time.displayActualTimeForSplits(11520)).toBe('03:12:00')
  expect(time.displayActualTimeForSplits(32130)).toBe('08:55:30')
  expect(time.displayActualTimeForSplits('a')).toBe('--:--')
  expect(time.displayActualTimeForSplits(null)).toBe('--:--')
  expect(time.displayActualTimeForSplits(undefined)).toBe('--:--')
  expect(time.displayActualTimeForSplits({})).toBe('--:--')
  expect(time.displayActualTimeForSplits([])).toBe('--:--')
})
