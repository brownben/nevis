import { shallowMount } from '@vue/test-utils'
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
