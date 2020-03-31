import { mount, shallowMount } from '@vue/test-utils'
import CourseForm from '@/views/CourseForm'

import courseMatching from '@/scripts/courseMatching/courseMatching'
jest.mock('@/scripts/courseMatching/courseMatching')

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - Create', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - Update', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest
          .fn()
          .mockResolvedValue({ id: 0, name: 'Test', length: 1000, climb: 2 }),
      },
      $route: { params: { eventId: 12 }, path: '/events/edit/12' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setData({ course: { id: 0, name: 'Test', length: 1000, climb: 2 } })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: false,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Course Details - Success', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest
          .fn()
          .mockResolvedValue([{ id: 0, name: 'Test', length: 1000, climb: 2 }]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourseDetails()
  expect(wrapper.vm.course).toEqual({
    id: 0,
    name: 'Test',
    length: 1,
    climb: 2,
  })
})

test('Get Course Details - No Length', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([{ id: 0, name: 'Test', climb: 2 }]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourseDetails()
  expect(wrapper.vm.course).toEqual({ id: 0, name: 'Test', climb: 2 })
})

test('Get Course Details - No Data', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourseDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Course Data',
    'error'
  )
  expect(wrapper.vm.course.name).toBe('')
})

test('Get Course Details - Error', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourseDetails()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Course Data',
    'error'
  )
  expect(wrapper.vm.course.name).toBe('')
})

test('Create Course - Success', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
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
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.createCourse()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Creating Course',
    'error'
  )
})

test('Update Course - Success', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest
          .fn()
          .mockResolvedValue([{ id: 0, name: 'Test', length: 1000, climb: 2 }]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.updateCourse()
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12/courses')
})

test('Update Course - Error', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.updateCourse()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Updating Course',
    'error'
  )
})

test('Delete Course - Success', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([{ name: 'Test', id: 6 }]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setData({ course: { id: 0, name: 'Test', length: 1000, climb: 2 } })
  await wrapper.vm.deleteCourse()
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/events/12/courses')
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(2)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Course "Test" Deleted'
  )
})

test('Delete Course - Error', async () => {
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.deleteCourse()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Deleting Course',
    'error'
  )
})

test('Check for Duplicates', async () => {
  const mockDatabaseQuery = jest
    .fn()
    .mockResolvedValue([{ name: 'Test', id: 6 }])
  const wrapper = mount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: { connection: {}, connected: true, query: mockDatabaseQuery },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
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
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
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
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Course "Test" Already Exists',
    'error'
  )

  wrapper.setData({ course: { controls: 'ab, cd' } })
  wrapper.vm.checkForDuplicateCourse.mockResolvedValue(false)
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(3)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Please Separate Each Code With a Comma e.g. 101, 102, 103'
  )

  wrapper.setData({ course: { controls: '12,23,' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(5)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Please Separate Each Code With a Comma e.g. 101, 102, 103'
  )

  wrapper.setData({ course: { controls: '12,23', length: 'hello' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(6)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Please enter a number for Course Length',
    'error'
  )

  wrapper.setData({ course: { length: '3.5', climb: 'hello' } })
  await wrapper.vm.submit()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledTimes(7)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Please enter a number for Course Climb',
    'error'
  )

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
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({ deleteCourse: jest.fn() })
  wrapper.vm.onConfirm(false)
  expect(wrapper.vm.deleteCourse).toHaveBeenCalledTimes(0)
  wrapper.vm.onConfirm(true)
  expect(wrapper.vm.deleteCourse).toHaveBeenCalledTimes(1)
})

test('Calculate Time', () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockRejectedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
      $serialPort: {
        list: jest.fn().mockRejectedValue(),
        open: jest.fn(),
        close: jest.fn(),
      },
    },
  })

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [
      { controlCode: 'S', time: 10 },
      { controlCode: 'F', time: 19 },
    ]).time
  ).toBe(9)

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [
      { controlCode: 'S', time: 10 },
      { controlCode: 'F', time: 130 },
    ]).time
  ).toBe(120)

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [
      { controlCode: 'S', time: 10 },
      { controlCode: 'F', time: 139 },
    ]).errors
  ).toBe('')

  expect(
    wrapper.vm.calculateTime({ errors: 'M1' }, [
      { controlCode: 'S', time: 10 },
      { controlCode: 'F', time: 19 },
    ]).errors
  ).toBe('M1')

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [{ controlCode: 'F', time: 19 }])
      .errors
  ).toBe('MS')

  expect(
    wrapper.vm.calculateTime({ errors: 'M1' }, [{ controlCode: 'F', time: 19 }])
      .errors
  ).toBe('MS M1')

  expect(
    wrapper.vm.calculateTime({ errors: '' }, [{ controlCode: 'S', time: 10 }])
      .errors
  ).toBe('Rtd')

  expect(
    wrapper.vm.calculateTime({ errors: 'M1' }, [{ controlCode: 'S', time: 10 }])
      .errors
  ).toBe('Rtd')
})

test('Recalculate Results', async () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
    methods: {
      calculateTime: jest.fn(() => ({ time: 7, errors: 'M4' })),
    },
  })

  wrapper.setData({ course: { controls: '101,102,103' } })
  courseMatching.linear = jest.fn(() => ({ errors: 'M4', links: [] }))
  await wrapper.vm.recalculateResult({ id: 6, name: 'Bob', course: 'world' }, [
    { controlCode: 'S' },
    { controlCode: 'F' },
    { controlCode: '101' },
    { controlCode: '102' },
    { controlCode: '103' },
  ])
  expect(courseMatching.linear).toHaveBeenCalledWith(
    ['101', '102', '103'],
    ['101', '102', '103']
  )
  expect(wrapper.vm.$database.query).toHaveBeenCalledWith(
    'REPLACE INTO results SET ?',
    {
      time: 7,
      links: JSON.stringify([]),
      errors: 'M4',
      competitor: 6,
      event: 12,
    }
  )
})

test('Recalculate Course Results', async () => {
  const wrapper = shallowMount(CourseForm, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest
          .fn()
          .mockResolvedValue([
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
          ]),
      },
      $route: { params: { eventId: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
    methods: {
      recalculateResult: jest.fn().mockResolvedValue(),
    },
  })
  jest.spyOn(wrapper.vm, 'recalculateResult')
  wrapper.setData({ course: { controls: '' }, originalControls: '' })
  expect(wrapper.vm.$database.query).toHaveBeenCalledTimes(0)

  wrapper.setData({
    course: { id: 5, name: 'Long', controls: '101,102,103' },
    originalControls: '',
  })
  await wrapper.vm.recalculateCourseResults()
  expect(
    wrapper.vm.$database.query
  ).toHaveBeenCalledWith(
    'SELECT * FROM competitors WHERE event=? AND course=? AND downloaded=true',
    [12, 5]
  )
  expect(
    wrapper.vm.$database.query
  ).toHaveBeenCalledWith('SELECT * FROM punches WHERE competitor=?', [
    expect.any(Number),
  ])
  expect(wrapper.vm.recalculateResult).toHaveBeenCalledTimes(5)
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Results for Course "Long" Recalculated'
  )

  wrapper.vm.recalculateResult = jest.fn().mockRejectedValue()
  await wrapper.vm.recalculateCourseResults()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Recalulating Course Results',
    'error'
  )
})
