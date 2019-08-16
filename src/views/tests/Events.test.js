import { mount, shallowMount } from '@vue/test-utils'
import Events from '@/views/Events'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Events, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - No Events', () => {
  const wrapper = shallowMount(Events, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - Events', () => {
  const wrapper = shallowMount(Events, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ events: [{ id: 1, name: 'Test', date: '1/2/3' }, { id: 2, name: 'Testing', date: '36/22/11' }, { id: 3, name: 'Event', date: '5/6/9' }] })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const mockRouterPush = jest.fn()
  shallowMount(Events, {
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

test('Get Events - Success', async () => {
  const wrapper = mount(Events, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue(['hello']) },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getEvents()
  expect(wrapper.vm.events).toEqual(['hello'])
})

test('Get Events - Error', async () => {
  const mockAddMessage = jest.fn()
  const wrapper = mount(Events, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue('error') },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: mockAddMessage },
    },
  })
  await wrapper.vm.getEvents()
  expect(mockAddMessage).toHaveBeenLastCalledWith('error', 'error')
  expect(wrapper.vm.events.length).toBe(0)
})
