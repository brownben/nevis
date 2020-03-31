import messages from '@/scripts/messageStore'

beforeEach(() => {
  jest.useFakeTimers()
  messages.messages = []
  messages.id = 0
})

test('Add Message', () => {
  messages.addMessage('This is an Message')
  expect(messages.messages).toEqual([
    { id: 0, text: 'This is an Message', type: 'info' },
  ])
})

test('Add Message and Check it is Remove after 30s', () => {
  messages.addMessage('This is an Message')
  jest.advanceTimersByTime(30000)
  expect(messages.messages).toEqual([])
  expect(setTimeout).toHaveBeenCalledTimes(1)
  expect(setTimeout).toHaveBeenLastCalledWith(
    expect.any(Function),
    30000,
    expect.any(Number)
  )
})

test('Add Messages', () => {
  messages.addMessage('This is a Message')
  messages.addMessage('This is an Error')
  messages.addMessage('This is a Warning')
  messages.addMessage('This is a 2nd Message')
  expect(messages.messages).toEqual([
    { id: 0, text: 'This is a Message', type: 'info' },
    { id: 1, text: 'This is an Error', type: 'info' },
    { id: 2, text: 'This is a Warning', type: 'info' },
    { id: 3, text: 'This is a 2nd Message', type: 'info' },
  ])
})

test('Add Messages and Check all are Removed after 30s', () => {
  messages.addMessage('This is a Message')
  messages.addMessage('This is a 2nd Message')
  jest.advanceTimersByTime(30000)
  expect(messages.messages).toEqual([])
  expect(setTimeout).toHaveBeenCalledTimes(2)
  expect(setTimeout).toHaveBeenLastCalledWith(
    expect.any(Function),
    30000,
    expect.any(Number)
  )
})

test('Add Error and Warning Messages and Check not are Removed after 30s', () => {
  messages.addMessage('This is an Error', 'error')
  messages.addMessage('This is a Warning', 'warning')
  jest.advanceTimersByTime(30000)
  expect(messages.messages).toEqual([
    { id: 0, text: 'This is an Error', type: 'error' },
    { id: 1, text: 'This is a Warning', type: 'warning' },
  ])
  expect(setTimeout).toHaveBeenCalledTimes(0)
})

test('Remove First Message', () => {
  messages.messages = [
    { id: 0, text: 'Message 0', type: 'info' },
    { id: 1, text: 'Message 1', type: 'info' },
    { id: 2, text: 'Message 2', type: 'info' },
  ]
  messages.removeMessage(0)
  expect(messages.messages).toEqual([
    { id: 1, text: 'Message 1', type: 'info' },
    { id: 2, text: 'Message 2', type: 'info' },
  ])
})

test('Remove Message', () => {
  messages.messages = [
    { id: 0, text: 'Message 0', type: 'info' },
    { id: 1, text: 'Message 1', type: 'info' },
    { id: 2, text: 'Message 2', type: 'info' },
  ]
  messages.removeMessage(1)
  expect(messages.messages).toEqual([
    { id: 0, text: 'Message 0', type: 'info' },
    { id: 2, text: 'Message 2', type: 'info' },
  ])
})

test('Remove Last Message', () => {
  messages.messages = [
    { id: 0, text: 'Message 0', type: 'info' },
    { id: 1, text: 'Message 1', type: 'info' },
    { id: 2, text: 'Message 2', type: 'info' },
  ]
  messages.removeMessage(2)
  expect(messages.messages).toEqual([
    { id: 0, text: 'Message 0', type: 'info' },
    { id: 1, text: 'Message 1', type: 'info' },
  ])
})

test('Remove All Messages', () => {
  messages.messages = [
    { id: 0, text: 'Message 0', type: 'info' },
    { id: 1, text: 'Message 1', type: 'info' },
    { id: 2, text: 'Message 2', type: 'info' },
  ]
  messages.removeMessage(0)
  messages.removeMessage(1)
  messages.removeMessage(2)
  expect(messages.messages).toEqual([])
})

test('Clear Messages', () => {
  messages.messages = [
    { id: 0, text: 'Message 0', type: 'info' },
    { id: 1, text: 'Message 1', type: 'info' },
    { id: 2, text: 'Message 2', type: 'info' },
  ]
  messages.clearMessages()
  expect(messages.messages).toEqual([])
})

test('Clear Empty Messages', () => {
  messages.clearMessages()
  expect(messages.messages).toEqual([])
})
