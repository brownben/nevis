import { shallowMount } from '@vue/test-utils'
import About from '@/views/About'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(About, {
    stubs: ['router-link'],
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = shallowMount(About, {
    stubs: ['router-link'],
  })
  expect(wrapper.element).toMatchSnapshot()
})
