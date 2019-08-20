import { mount, shallowMount } from '@vue/test-utils'
import CourseForm from '@/views/CourseForm'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - Create', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - Update', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue({ id: 0, name: 'Test', length: 1000, climb: 2 }) },
      $route: { params: { eventId: 12 }, path: '/events/edit/12' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ course: { id: 0, name: 'Test', length: 1000, climb: 2 } })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: false, query: jest.fn().mockResolvedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Course Details - Success', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ id: 0, name: 'Test', length: 1000, climb: 2 }]) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCourseDetails()
  expect(wrapper.vm.course).toEqual({ id: 0, name: 'Test', length: 1, climb: 2 })
})

test('Get Course Details - No Length', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ id: 0, name: 'Test', climb: 2 }]) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCourseDetails()
  expect(wrapper.vm.course).toEqual({ id: 0, name: 'Test', climb: 2 })
})

test('Get Course Details - No Data', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCourseDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Course Data', 'error')
  expect(wrapper.vm.course.name).toBe('')
})

test('Get Course Details - Error', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.getCourseDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Fetching Course Data', 'error')
  expect(wrapper.vm.course.name).toBe('')
})

test('Create Course - Success', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ course: { name: 'Test', date: '' } })
  await wrapper.vm.createCourse()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12/courses')
})

test('Create Course - Error', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.createCourse()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Creating Course', 'error')
})

test('Update Course - Success', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ id: 0, name: 'Test', length: 1000, climb: 2 }]) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.updateCourse()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12/courses')
})

test('Update Course - Error', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.updateCourse()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Updating Course', 'error')
})

test('Delete Course - Success', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue([{ name: 'Test', id: 6 }]) },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setData({ course: { id: 0, name: 'Test', length: 1000, climb: 2 } })
  await wrapper.vm.deleteCourse()
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12/courses')
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(2)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Course "Test" Deleted')
})

test('Delete Course - Error', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  await wrapper.vm.deleteCourse()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Problem Deleting Course', 'error')
})

test('Check for Duplicates', async () => {
  const mockDatabaseQuery = jest.fn().mockResolvedValue([{ name: 'Test', id: 6 }])
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: mockDatabaseQuery },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  mockDatabaseQuery.mockResolvedValue([])
  expect(await wrapper.vm.checkForDuplicateCourse()).toBeFalsy()

  wrapper.setData({ course: { id: null } })
  mockDatabaseQuery.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }])
  expect(await wrapper.vm.checkForDuplicateCourse()).toBeTruthy()

  wrapper.setData({ course: { id: 12 } })
  mockDatabaseQuery.mockResolvedValue([{ id: 12 }])
  expect(await wrapper.vm.checkForDuplicateCourse()).toBeFalsy()

  mockDatabaseQuery.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }])
  expect(await wrapper.vm.checkForDuplicateCourse()).toBeTruthy()
})

test('Submit', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockResolvedValue() },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({
    checkForDuplicateCourse: jest.fn(),
    updateCourse: jest.fn(),
    createCourse: jest.fn(),
  })

  wrapper.setData({ course: { name: 'Test' } })
  wrapper.vm.checkForDuplicateCourse.mockResolvedValue(true)
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Course "Test" Already Exists', 'error')

  wrapper.setData({ course: { controls: 'ab, cd' } })
  wrapper.vm.checkForDuplicateCourse.mockResolvedValue(false)
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(3)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Please Separate Each Code With a Comma e.g. 101, 102, 103')

  wrapper.setData({ course: { controls: '12,23,' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(5)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Please Separate Each Code With a Comma e.g. 101, 102, 103')

  wrapper.setData({ course: { controls: '12,23', length: 'hello' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(6)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Please enter a number for Course Length', 'error')

  wrapper.setData({ course: { length: '3.5', climb: 'hello' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(7)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith('Please enter a number for Course Climb', 'error')

  wrapper.setData({ course: { id: 1, climb: '2' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(7)
  expect(wrapper.vm.createCourse).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.updateCourse).toHaveBeenCalledTimes(1)

  wrapper.setData({ course: { id: undefined } })
  await wrapper.vm.submit()
  expect(wrapper.vm.createCourse).toHaveBeenCalledTimes(1)
})

test('On Confirm', () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: jest.fn().mockRejectedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn() },
    },
  })
  wrapper.setMethods({ deleteCourse: jest.fn() })
  wrapper.vm.onConfirm(false)
  expect(wrapper.vm.deleteCourse).toHaveBeenCalledTimes(0)
  wrapper.vm.onConfirm(true)
  expect(wrapper.vm.deleteCourse).toHaveBeenCalledTimes(1)
})
