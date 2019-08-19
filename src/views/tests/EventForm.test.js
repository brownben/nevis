import { mount, shallowMount } from '@vue/test-utils'
import EventForm from '@/views/EventForm'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - Create', () => {
  const wrapper = shallowMount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - Update', () => {
  const wrapper = shallowMount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ name: 'Test', id: 12, date: '' }]) },
      $route: { params: { id: 12 }, path: '/events/edit/12' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Event Details - Success', async () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ id: 0, name: 'Test', date: '1/2/3' }]) },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getEventDetails()
  expect(wrapper.vm.eventData).toEqual({ id: 0, name: 'Test', date: '1/2/3' })
})

test('Get Event Details - Error', async () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getEventDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Event Data', 'error')
  expect(wrapper.vm.eventData.name).toBe('')
})

test('Create Event - Success', async () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({ insertId: 12 }) },
      $route: { path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ eventData: { name: 'Test', date: '' } })
  await wrapper.vm.createEvent()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12')
})

test('Create Event - Error', async () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.createEvent()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Creating Event', 'error')
})

test('Update Event - Success', async () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ name: 'Test', id: 12, date: '' }]) },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.updateEvent()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12')
})

test('Update Event - Error', async () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.updateEvent()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Updating Event', 'error')
})

test('Delete Event - Success', async () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ name: 'Test', id: 12, date: '' }]) },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.deleteEvent()
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events')
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Event "Test" Deleted')
})

test('Delete Event - Error', async () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.deleteEvent()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Deleting Event', 'error')
})

test('On Confirm', () => {
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ deleteEvent: jest.fn() })
  wrapper.vm.onConfirm(false)
  expect(wrapper.vm.deleteEvent).toHaveBeenCalledTimes(0)
  wrapper.vm.onConfirm(true)
  expect(wrapper.vm.deleteEvent).toHaveBeenCalledTimes(1)
})
