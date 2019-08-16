import { mount, shallowMount } from '@vue/test-utils'
import EventOverview from '@/views/EventOverview'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 } },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = shallowMount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 } },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ event: { id: 12, name: 'Test Event', date: '11/22/33' } })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const mockRouterPush = jest.fn()
  shallowMount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 } },
      $router: { push: mockRouterPush },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(mockRouterPush).toHaveBeenCalledTimes(1)
  expect(mockRouterPush).toHaveBeenLastCalledWith('/')
})

test('Get Event Details - Success', async () => {
  const wrapper = mount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue(['hello']) },
      $route: { params: { id: 12 } },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getEventDetails()
  expect(wrapper.vm.event).toBe('hello')
})

test('Get Event Details - Error', async () => {
  const mockAddMessage = jest.fn()
  const wrapper = mount(EventOverview, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockRejectedValue('error') },
      $route: { params: { id: 12 } },
      $router: { push: jest.fn() },
      $messages: { addMessage: mockAddMessage },
    },
  })
  await wrapper.vm.getEventDetails()
  expect(mockAddMessage).toHaveBeenCalledTimes(1)
  expect(mockAddMessage).toHaveBeenLastCalledWith('error', 'error')
  expect(wrapper.vm.event).toEqual({})
})
