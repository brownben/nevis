import { mount, shallowMount } from '@vue/test-utils'
import EventForm from '@/views/EventForm'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue('error') },
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
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue('error') },
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
  const mockRouterPush = jest.fn()
  shallowMount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: mockRouterPush },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(mockRouterPush).toHaveBeenCalledTimes(1)
  expect(mockRouterPush).toHaveBeenLastCalledWith('/')
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

test('Get Courses - Error', async () => {
  const mockAddMessage = jest.fn()
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue('error') },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: mockAddMessage },
    },
  })
  await wrapper.vm.getEventDetails()
  expect(mockAddMessage).toHaveBeenLastCalledWith('error', 'error')
  expect(wrapper.vm.eventData.name).toBe('')
})

test('Create Event - Success', async () => {
  const mockRouterPush = jest.fn()
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({ insertId: 12 }) },
      $route: { path: '' },
      $router: { push: mockRouterPush },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ eventData: { name: 'Test', date: '' } })
  await wrapper.vm.createEvent()
  expect(mockRouterPush).toHaveBeenLastCalledWith('/events/12')
})

test('Create Event - Error', async () => {
  const mockAddMessage = jest.fn()
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue('error') },
      $route: { path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: mockAddMessage },
    },
  })
  await wrapper.vm.createEvent()
  expect(mockAddMessage).toHaveBeenLastCalledWith('error', 'error')
})

test('Update Event - Success', async () => {
  const mockRouterPush = jest.fn()
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ name: 'Test', id: 12, date: '' }]) },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: mockRouterPush },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.updateEvent()
  expect(mockRouterPush).toHaveBeenLastCalledWith('/events/12')
})

test('Update Event - Error', async () => {
  const mockAddMessage = jest.fn()
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue('error') },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: mockAddMessage },
    },
  })
  await wrapper.vm.updateEvent()
  expect(mockAddMessage).toHaveBeenLastCalledWith('error', 'error')
})

test('Delete Event - Success', async () => {
  const mockRouterPush = jest.fn()
  const mockAddMessage = jest.fn()
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ name: 'Test', id: 12, date: '' }]) },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: mockRouterPush },
      $messages: { addMessage: mockAddMessage },
    },
  })
  await wrapper.vm.deleteEvent()
  expect(mockRouterPush).toHaveBeenCalledTimes(1)
  expect(mockRouterPush).toHaveBeenLastCalledWith('/events')
  expect(mockAddMessage).toHaveBeenCalledTimes(1)
  expect(mockAddMessage).toHaveBeenLastCalledWith('Event "Test" Deleted')
})

test('Delete Event - Error', async () => {
  const mockAddMessage = jest.fn()
  const wrapper = mount(EventForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue('error') },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: mockAddMessage },
    },
  })
  await wrapper.vm.deleteEvent()
  expect(mockAddMessage).toHaveBeenLastCalledWith('error', 'error')
})
