import { mount, shallowMount } from '@vue/test-utils'
import Courses from '@/views/Courses'
import * as CourseJSON from '@/views/tests/CourseXMLasJSON'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.isVueInstance()).toBeTruthy()
})

test('Renders Correctly - No Courses', () => {
  const wrapper = shallowMount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Renders Correctly - With Courses', () => {
  const wrapper = shallowMount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setData({
    courses: [
      {
        id: 0,
        name: 'Long',
        length: 2.35,
        climb: 150,
        controls: '101,102,103',
      },
      {
        id: 77,
        name: 'Short',
        length: 1.75,
        climb: 15,
        controls: '100,108,103',
      },
    ],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: false,
        query: jest.fn().mockResolvedValue(),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
})

test('Get Courses - Success', async () => {
  const wrapper = mount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(['hello']),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.courses).toEqual(['hello'])
})

test('Get Courses - Error', async () => {
  const wrapper = mount(Courses, {
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
  await wrapper.vm.getCourses()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Courses',
    'error'
  )
  expect(wrapper.vm.courses.length).toBe(0)
})

test('Process XML Import', () => {
  const wrapper = mount(Courses, {
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

  expect(wrapper.vm.processXMLImport(JSON.parse(CourseJSON.json1))).toEqual([
    ['A', 2960, 95, 'linear', 12, '31,32,33,31,34,35,31,100'],
    ['B', 2960, 95, 'linear', 12, '31,34,35,31,32,33,31,100'],
  ])
  expect(wrapper.vm.processXMLImport(JSON.parse(CourseJSON.json2))).toEqual([
    ['A', 2960, 95, 'linear', 12, ''],
  ])
})

test('Process XML Import', async () => {
  const wrapper = mount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({ affectedRows: 7 }),
      },
      $electron: {
        remote: {
          dialog: {
            showOpenDialog: jest
              .fn()
              .mockResolvedValue({ canceled: false, filePaths: ['hi'] }),
          },
        },
      },
      $fs: { readFile: jest.fn().mockResolvedValue('a') },
      $xml: { xml2js: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    processXMLImport: jest.fn().mockResolvedValue('b'),
    getCourses: jest.fn().mockResolvedValue(),
  })

  await wrapper.vm.importXML()

  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    '7 Courses Imported'
  )
  expect(wrapper.vm.$xml.xml2js).toHaveBeenCalledWith('a', {
    compact: true,
    trim: true,
    alwaysArray: true,
    nativeType: true,
    nativeTypeAttributes: true,
  })
  expect(wrapper.vm.$fs.readFile).toHaveBeenCalledWith('hi', {
    encoding: 'utf8',
  })
  expect(wrapper.vm.processXMLImport).toHaveBeenCalledTimes(1)
  expect(wrapper.vm.getCourses).toHaveBeenCalledTimes(1)
  expect(
    wrapper.vm.$database.query
  ).toHaveBeenCalledWith(
    'INSERT INTO courses (name, length, climb, type, event, controls) VALUES ?',
    ['b']
  )
})

test('Process XML Import - Cancelled', async () => {
  const wrapper = mount(Courses, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue({ affectedRows: 7 }),
      },
      $electron: {
        remote: {
          dialog: {
            showOpenDialog: jest
              .fn()
              .mockResolvedValue({ canceled: true, filePaths: ['hi'] }),
          },
        },
      },
      $fs: { readFile: jest.fn().mockResolvedValue('a') },
      $xml: { xml2js: jest.fn().mockResolvedValue() },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  wrapper.setMethods({
    processXMLImport: jest.fn().mockResolvedValue('b'),
    getCourses: jest.fn().mockResolvedValue(),
  })

  await wrapper.vm.importXML()

  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    'Problem Importing Courses',
    'error'
  )
  expect(wrapper.vm.$xml.xml2js).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.$fs.readFile).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.processXMLImport).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.getCourses).toHaveBeenCalledTimes(0)
})
