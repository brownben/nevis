import { mount, shallowMount } from '@vue/test-utils'
import Home from '@/views/Home'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Home, {
    stubs: ['router-link'],
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = shallowMount(Home, {
    stubs: ['router-link'],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Connect to Database - Success', async () => {
  const wrapper = mount(Home, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connect: jest.fn().mockResolvedValue(), connected: false },
      $mysql: { createConnection: jest.fn() },
      $messages: { addMessage: jest.fn() },
      $router: { push: jest.fn() },
    },
  })
  await wrapper.vm.connect()
  expect(wrapper.vm.$mysql.createConnection).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$database.connect).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.$database.connected).toBeTruthy()
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events')
})

test('Connect to Database - Error', async () => {
  const wrapper = mount(Home, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connect: jest.fn().mockRejectedValue('Error'), connected: false },
      $mysql: { createConnection: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.connect()
  expect(wrapper.vm.$mysql.createConnection).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$database.connect).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Connecting To The Database', 'error')
  expect(wrapper.vm.$database.connected).toBeFalsy()
})
