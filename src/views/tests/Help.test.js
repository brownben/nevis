import { shallowMount } from '@vue/test-utils'
import Help from '@/views/Help'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Help, {
    stubs: ['router-link'],
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = shallowMount(Help, {
    stubs: ['router-link'],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Go To SQL Download External', () => {
  const wrapper = shallowMount(Help, {
    mocks: {
      $electron: { shell: { openExternal: jest.fn() } },
    },
    stubs: ['router-link'],
  })
  const event = { preventDefault: jest.fn() }
  wrapper.vm.goToSQLDownloadExternal(event)

  expect(event.preventDefault).toBeCalled()
  expect(wrapper.vm.$electron.shell.openExternal).toBeCalled()
})
