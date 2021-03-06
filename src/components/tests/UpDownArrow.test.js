/*
  UpDownArrows Component Unit Tests
*/

import { mount } from '@vue/test-utils'
import UpDownArrows from '@/components/UpDownArrows'

test('Is a Vue Instance', () => {
  const wrapper = mount(UpDownArrows)
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - Passed with Props', () => {
  const wrapper = mount(UpDownArrows, {
    propsData: {
      active: true,
      ascending: false,
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Check Classes Update', () => {
  const wrapper = mount(UpDownArrows, {
    propsData: {
      active: true,
      ascending: true,
    },
  })
  expect(wrapper.props().active).toBeTruthy()
  expect(wrapper.props().ascending).toBeTruthy()
  expect(wrapper.findAll('svg').at(0).classes()).toEqual(['fill-current'])
  expect(wrapper.findAll('svg').at(1).classes()).toContain('active')
  wrapper.setProps({
    active: true,
    ascending: false,
  })
  expect(wrapper.findAll('svg').at(0).classes()).toContain('active')
  expect(wrapper.findAll('svg').at(1).classes()).toEqual(['fill-current'])
  wrapper.setProps({
    active: false,
    ascending: false,
  })
  expect(wrapper.findAll('svg').at(0).classes()).toEqual(['fill-current'])
  expect(wrapper.findAll('svg').at(1).classes()).toEqual(['fill-current'])
})

test('Renders Correctly - No Props', () => {
  const wrapper = mount(UpDownArrows)
  expect(wrapper.element).toMatchSnapshot()
})
