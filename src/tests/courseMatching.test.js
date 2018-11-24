import linear from '../scripts/courseMatching/linear'

const toObject = array => array.map(item => ({ code: item }))

test('Linear - Empty Course', () => {
  expect(linear(toObject([]), []).errors).toBe('')
  expect(linear(toObject([]), []).percentageCorrect).toBe(1)
})

test('Linear - Correct Course', () => {
  expect(linear(toObject([1, 1, 1]), [1, 1, 1]).errors).toBe('')
  expect(linear(toObject([1, 2, 3]), [1, 2, 3]).errors).toBe('')
  expect(linear(toObject([3, 2, 1]), [3, 2, 1]).errors).toBe('')
  expect(linear(toObject([4, 3, 5, 2, 1, 9, 2]), [4, 3, 5, 2, 1, 9, 2]).errors).toBe('')
  expect(linear(toObject([1, 2, 3, 4, 5, 2, 6, 7]), [1, 2, 3, 4, 5, 2, 6, 7]).errors).toBe('')
  expect(linear(toObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).errors).toBe('')
})

test('Linear - Extra Controls', () => {
  expect(linear(toObject([1, 1, 2, 3]), [1, 2, 3]).errors).toBe('')
  expect(linear(toObject([1, 2, 2, 3]), [1, 2, 3]).errors).toBe('')
  expect(linear(toObject([1, 2, 3, 3]), [1, 2, 3]).errors).toBe('')
  expect(linear(toObject([4, 1, 2, 3]), [1, 2, 3]).errors).toBe('')
  expect(linear(toObject([1, 4, 2, 3]), [1, 2, 3]).errors).toBe('')
  expect(linear(toObject([1, 2, 4, 3]), [1, 2, 3]).errors).toBe('')
  expect(linear(toObject([1, 2, 3, 4]), [1, 2, 3]).errors).toBe('')
  expect(linear(toObject([1, 1, 1, 1]), [1, 1, 1]).errors).toBe('')
  expect(linear(toObject([1, 2, 2, 1, 1]), [1, 2, 1]).errors).toBe('')
  expect(linear(toObject([1, 2, 2, 2, 2, 1, 1]), [1, 2, 1]).errors).toBe('')
  expect(linear(toObject([1, 2, 2, 2, 2, 1, 1]), [1, 2, 1]).errors).toBe('')
  expect(linear(toObject([2, 1, 2, 1, 2, 1, 2]), [1, 1, 1]).errors).toBe('')
})

test('Linear - Wrong Controls', () => {
  expect(linear(toObject([4, 2, 3]), [1, 2, 3]).errors).toBe('W1')
  expect(linear(toObject([1, 4, 3]), [1, 2, 3]).errors).toBe('W2')
  expect(linear(toObject([1, 2, 4]), [1, 2, 3]).errors).toBe('W3')
  expect(linear(toObject([1, 2, 7, 4, 5]), [1, 2, 3, 4, 5]).errors).toBe('W3')
  expect(linear(toObject([6, 7, 3, 4, 5]), [1, 2, 3, 4, 5]).errors).toBe('W1-2')
  expect(linear(toObject([1, 2, 6, 7, 5]), [1, 2, 3, 4, 5]).errors).toBe('W3-4')
  expect(linear(toObject([1, 2, 3, 6, 7]), [1, 2, 3, 4, 5]).errors).toBe('W4-5')
  expect(linear(toObject([6, 2, 3, 4, 7]), [1, 2, 3, 4, 5]).errors).toBe('W1 W5')
  expect(linear(toObject([1, 6, 3, 6, 5]), [1, 2, 3, 4, 5]).errors).toBe('W2 W4')
  expect(linear(toObject([6, 7, 8, 9, 0]), [1, 2, 3, 4, 5]).errors).toBe('W1-5')
  expect(linear(toObject([1, 2, 9, 4, 5, 3, 7, 8]), [1, 2, 3, 4, 5, 3, 7, 8]).errors).toBe('W3')
})

test('Linear - Missing Controls', () => {
  expect(linear(toObject([]), [1, 2, 3]).errors).toBe('M1-3')
  expect(linear(toObject([2, 3]), [1, 2, 3]).errors).toBe('M1')
  expect(linear(toObject([1, 3]), [1, 2, 3]).errors).toBe('M2')
  expect(linear(toObject([1, 2]), [1, 2, 3]).errors).toBe('M3')
  expect(linear(toObject([1, 2, 4]), [1, 2, 3, 4]).errors).toBe('M3')
  expect(linear(toObject([3, 4, 5]), [1, 2, 3, 4, 5]).errors).toBe('M1-2')
  expect(linear(toObject([1, 2, 5]), [1, 2, 3, 4, 5]).errors).toBe('M3-4')
  expect(linear(toObject([2, 5]), [1, 2, 3, 4, 5]).errors).toBe('M1 M3-4')
})

test('Linear - Extra + Missing Controls', () => {
  expect(linear(toObject([2, 3, 4, 4, 5]), [1, 2, 3, 4, 5]).errors).toBe('M1')
  expect(linear(toObject([1, 3, 4, 5, 6, 7]), [1, 2, 3, 4, 5]).errors).toBe('M2')
  expect(linear(toObject([1, 3, 5, 6, 4, 1]), [1, 2, 3, 4, 5]).errors).toBe('M2 M4')
})

test('Linear - Extra + Wrong Controls', () => {
  expect(linear(toObject([7, 2, 3, 4, 4, 4, 5]), [1, 2, 3, 4, 5]).errors).toBe('W1')
  expect(linear(toObject([1, 7, 3, 4, 5, 6, 7]), [1, 2, 3, 4, 5]).errors).toBe('W2')
  expect(linear(toObject([1, 1, 3, 1, 2, 7]), [1, 2, 3, 4, 5]).errors).toBe('W2 W4-5')
})

test('Linear - Wrong + Missing Controls', () => {
  expect(linear(toObject([7, 2, 3, 5]), [1, 2, 3, 4, 5]).errors).toBe('W1 M4')
  expect(linear(toObject([1, 2, 4, 6]), [1, 2, 3, 4, 5]).errors).toBe('M3 W5')
})

test('Linear - Wrong + Missing + Extra Controls', () => {
  expect(linear(toObject([1, 3, 6, 6, 5, 1]), [1, 2, 3, 4, 5]).errors).toBe('M2 W4')
  expect(linear(toObject([3, 4, 6, 7, 8, 9, 8]), [1, 2, 3, 4, 5]).errors).toBe('M1-2 W5')
})

test('Linear - Percentage Correct', () => {
  expect(linear(toObject([]), [1, 2, 3]).percentageCorrect).toBe(0)
  expect(linear(toObject([5, 6, 7]), [1, 2, 3]).percentageCorrect).toBe(0)
  expect(linear(toObject([1, 5, 6, 7]), [1, 2, 3, 4]).percentageCorrect).toBe(0.25)
  expect(linear(toObject([1, 2]), [1, 2, 3, 4]).percentageCorrect).toBe(0.5)
  expect(linear(toObject([8, 2, 3, 9]), [1, 2, 3, 4]).percentageCorrect).toBe(0.5)
  expect(linear(toObject([1, 2, 8, 9]), [1, 2, 3, 4]).percentageCorrect).toBe(0.5)
  expect(linear(toObject([1, 2, 3, 5]), [1, 2, 3, 4]).percentageCorrect).toBe(0.75)
  expect(linear(toObject([1, 2, 3]), [1, 2, 3, 4]).percentageCorrect).toBe(0.75)
  expect(linear(toObject([1, 2, 3, 4]), [1, 2, 3, 4]).percentageCorrect).toBe(1)
  expect(linear(toObject([1, 5, 4, 3, 2, 1, 2, 3, 4, 2]), [1, 2, 3, 4]).percentageCorrect).toBe(1)
})
