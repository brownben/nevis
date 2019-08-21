import { shallowMount } from '@vue/test-utils'
import About from '@/views/About'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(About, {
    stubs: ['router-link'],
    mocks: {
      $electron: { remote: { app: { getVersion: jest.fn(() => '5') } } },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = shallowMount(About, {
    stubs: ['router-link'],
    mocks: {
      $electron: { remote: { app: { getVersion: jest.fn(() => '5') } } },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})
