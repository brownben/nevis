import messages from '../scripts/messageStore'

beforeEach(() => {
  messages.messages = []
  messages.id = 0
})

test('Add Message', () => {
  messages.messages = []
  messages.addMessage('This is an Message')
  expect(messages.messages).toEqual([{ id: 0, type: 'info', text: 'This is an Message' }])
})

test('Add Messages', () => {
  messages.messages = []
  messages.addMessage('This is a Message')
  messages.addMessage('This is an Error', 'error')
  messages.addMessage('This is a Warning', 'warning')
  messages.addMessage('This is a 2nd Message', 'info')
  expect(messages.messages).toEqual([
    { id: 0, type: 'info', text: 'This is a Message' },
    { id: 1, type: 'error', text: 'This is an Error' },
    { id: 2, type: 'warning', text: 'This is a Warning' },
    { id: 3, type: 'info', text: 'This is a 2nd Message' },
  ])
})
test('Remove First Message', () => {
  messages.messages = [
    { id: 0, type: 'info', text: 'Message 0' },
    { id: 1, type: 'info', text: 'Message 1' },
    { id: 2, type: 'info', text: 'Message 2' },
  ]
  messages.removeMessage(0)
  expect(messages.messages).toEqual([
    { id: 1, type: 'info', text: 'Message 1' },
    { id: 2, type: 'info', text: 'Message 2' },
  ])
})

test('Remove Message', () => {
  messages.messages = [
    { id: 0, type: 'info', text: 'Message 0' },
    { id: 1, type: 'info', text: 'Message 1' },
    { id: 2, type: 'info', text: 'Message 2' },
  ]
  messages.removeMessage(1)
  expect(messages.messages).toEqual([
    { id: 0, type: 'info', text: 'Message 0' },
    { id: 2, type: 'info', text: 'Message 2' },
  ])
})

test('Remove Last Message', () => {
  messages.messages = [
    { id: 0, type: 'info', text: 'Message 0' },
    { id: 1, type: 'info', text: 'Message 1' },
    { id: 2, type: 'info', text: 'Message 2' },
  ]
  messages.removeMessage(2)
  expect(messages.messages).toEqual([
    { id: 0, type: 'info', text: 'Message 0' },
    { id: 1, type: 'info', text: 'Message 1' },
  ])
})

test('Remove All Messages', () => {
  messages.messages = [
    { id: 0, type: 'info', text: 'Message 0' },
    { id: 1, type: 'info', text: 'Message 1' },
    { id: 2, type: 'info', text: 'Message 2' },
  ]
  messages.removeMessage(0)
  messages.removeMessage(1)
  messages.removeMessage(2)
  expect(messages.messages).toEqual([])
})

test('Clear Messages', () => {
  messages.messages = [
    { id: 0, type: 'info', text: 'Message 0' },
    { id: 1, type: 'info', text: 'Message 1' },
    { id: 2, type: 'info', text: 'Message 2' },
  ]
  messages.clearMessages()
  expect(messages.messages).toEqual([])
})

test('Clear Empty Messages', () => {
  messages.messages = []
  messages.clearMessages()
  expect(messages.messages).toEqual([])
})
