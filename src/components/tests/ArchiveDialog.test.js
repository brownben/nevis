import { mount } from '@vue/test-utils'
import ArchiveDialog from '@/components/ArchiveDialog'

test('Is a Vue Instance', () => {
  const wrapper = mount(ArchiveDialog, {
    stubs: ['router-link'],
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly', () => {
  const wrapper = mount(ArchiveDialog, {
    stubs: ['router-link'],
  })
  wrapper.setProps({
    listOfRecords: [
      { name: 'A', siid: '1', id: 0, gender: 'm', yearOfBirth: '2000' },
      { name: 'B', siid: '2', id: 33, gender: 'f', yearOfBirth: '2001' },
      { name: 'C', siid: '3', id: 21, gender: 'm', yearOfBirth: '1989' },
    ],
  })
  expect(wrapper.element).toMatchSnapshot()
  wrapper.setProps({
    listOfRecords: [
      { name: 'A', siid: '1', id: 0, gender: 'm', yearOfBirth: '2000' },
      { name: 'B', siid: '2', id: 33, gender: 'f', yearOfBirth: '2001' },
      { name: 'C', siid: '3', id: 21, gender: 'm', yearOfBirth: '1989' },
      { name: 'A', siid: '1', id: 2, gender: 'm', yearOfBirth: '2000' },
      { name: 'B', siid: '2', id: 3, gender: 'f', yearOfBirth: '2001' },
      { name: 'C', siid: '3', id: 4, gender: 'm', yearOfBirth: '1989' },
    ],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Emits Value on Close', () => {
  const wrapper = mount(ArchiveDialog, {
    stubs: ['router-link'],
  })
  wrapper.vm.confirmAction('Hello')
  wrapper.vm.confirmAction(123)
  expect(wrapper.emitted().close.length).toBe(2)
  expect(wrapper.emitted().close[0]).toEqual(['Hello'])
  expect(wrapper.emitted().close[1]).toEqual([123])
})

