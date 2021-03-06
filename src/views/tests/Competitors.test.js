import { mount, shallowMount } from '@vue/test-utils'
import Competitors from '@/views/Competitors'

import * as EntriesXMLasJSON from '@/views/tests/EntriesXMLasJSON'

test('Is a Vue Instance', () => {
  const wrapper = shallowMount(Competitors, {
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

test('Renders Correctly - No Competitors', () => {
  const wrapper = shallowMount(Competitors, {
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

test('Renders Correctly - With Competitors', () => {
  const wrapper = shallowMount(Competitors, {
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
    competitors: [
      { id: 0, name: 'Bob', course: 1, siid: '154585' },
      { id: 77, name: 'Shaun', course: 2, siid: '12345' },
    ],
  })
  expect(wrapper.element).toMatchSnapshot()
})

test('Not Connected to the Database', () => {
  const wrapper = shallowMount(Competitors, {
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

test('Get Competitors - Success', async () => {
  const wrapper = mount(Competitors, {
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
  await wrapper.vm.getCompetitors()
  expect(wrapper.vm.competitors).toEqual(['hello'])
})

test('Get Competitors - Error', async () => {
  const wrapper = mount(Competitors, {
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
  await wrapper.vm.getCompetitors()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Entries',
    'error'
  )
  expect(wrapper.vm.competitors.length).toBe(0)
})

test('Get All Competitors - Success', async () => {
  const wrapper = mount(Competitors, {
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
  await wrapper.vm.getAllCompetitors()
  expect(wrapper.vm.allCompetitors).toEqual(['hello'])
})

test('Get Competitors - Error', async () => {
  const wrapper = mount(Competitors, {
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
  await wrapper.vm.getAllCompetitors()
  expect(wrapper.vm.$messages.addMessage).toHaveBeenLastCalledWith(
    'Problem Fetching Entries',
    'error'
  )
  expect(wrapper.vm.allCompetitors.length).toBe(0)
})

test('Get Courses - Success', async () => {
  const wrapper = mount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue([
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
        ]),
      },
      $route: { params: { id: 12 }, path: '' },
      $router: { push: jest.fn() },
      $messages: { addMessage: jest.fn(), clearMessages: jest.fn() },
    },
  })
  await wrapper.vm.getCourses()
  expect(wrapper.vm.listOfCourseNames).toEqual(['', 'Long', 'Short'])
})

test('Get Courses - Error', async () => {
  const wrapper = mount(Competitors, {
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
  expect(wrapper.vm.listOfCourseNames).toEqual([])
})

test('Watchers', () => {
  const wrapper = mount(Competitors, {
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
  wrapper.setMethods({
    getCompetitors: jest.fn(),
  })
  wrapper.setData({ filterName: 'A' })
  expect(wrapper.vm.getCompetitors).toHaveBeenCalledTimes(1)
  wrapper.setData({ filterName: 'B' })
  expect(wrapper.vm.getCompetitors).toHaveBeenCalledTimes(2)
  wrapper.setData({ filterCourse: 'A' })
  expect(wrapper.vm.getCompetitors).toHaveBeenCalledTimes(3)
  wrapper.setData({ filterSIID: 'A' })
  expect(wrapper.vm.getCompetitors).toHaveBeenCalledTimes(4)
})

test('Change Sort By', () => {
  const wrapper = mount(Competitors, {
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
  wrapper.setMethods({
    getCompetitors: jest.fn(),
  })
  wrapper.vm.changeSortBy('name')
  expect(wrapper.vm.sortBy).toBe('name')
  expect(wrapper.vm.sortDirection).toBe('DESC')
  expect(wrapper.vm.getCompetitors).toHaveBeenCalledTimes(1)
  wrapper.vm.changeSortBy('name')
  expect(wrapper.vm.sortBy).toBe('name')
  expect(wrapper.vm.sortDirection).toBe('ASC')
  expect(wrapper.vm.getCompetitors).toHaveBeenCalledTimes(2)
  wrapper.vm.changeSortBy('siid')
  expect(wrapper.vm.sortBy).toBe('siid')
  expect(wrapper.vm.sortDirection).toBe('ASC')
  expect(wrapper.vm.getCompetitors).toHaveBeenCalledTimes(3)
  wrapper.vm.changeSortBy('siid')
  expect(wrapper.vm.sortBy).toBe('siid')
  expect(wrapper.vm.sortDirection).toBe('DESC')
  expect(wrapper.vm.getCompetitors).toHaveBeenCalledTimes(4)
})

test('Process XML Import', () => {
  const wrapper = mount(Competitors, {
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

  expect(
    wrapper.vm.processXMLImport(JSON.parse(EntriesXMLasJSON.json1))
  ).toEqual([
    ['George Wood', 794021, 'OC Back and Forth', '', 1, 'Men Elite', 12],
    ['Edgar Martin', undefined, 'Bushmen OC', '', 2, 'Men Elite', 12],
    ['Toni Lawson', 973078, undefined, '', 3, 'Open', 12],
  ])
  expect(
    wrapper.vm.processXMLImport(JSON.parse(EntriesXMLasJSON.json2))
  ).toEqual([
    ['George Wood', 794021, 'OC Back and Forth', '', 1, 'Men Elite', 12],
  ])
  expect(wrapper.vm.processXMLImport({})).toEqual(undefined)
})

test('Assign Courses', async () => {
  const wrapper = mount(Competitors, {
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
  wrapper.vm.$database.query
    .mockResolvedValueOnce([
      {
        id: 49,
        name: 'Open',
        length: null,
        climb: null,
        type: 'linear',
        controls: null,
        event: 20,
      },
    ])
    .mockResolvedValue({ insertId: 48 })

  expect(
    await wrapper.vm.assignCourses([
      ['George Wood', 794021, 'OC Back and Forth', 'M45', 1, 'Men Elite', '20'],
      ['Edgar Martin', null, 'Bushmen OC', '', 2, 'Men Elite', '20'],
      ['Toni Lawson', 973078, null, '', 3, 'Open', '20'],
    ])
  ).toEqual([
    ['George Wood', 794021, 'OC Back and Forth', 'M45', 1, 48, '20'],
    ['Edgar Martin', null, 'Bushmen OC', '', 2, 48, '20'],
    ['Toni Lawson', 973078, null, '', 3, 49, '20'],
  ])
})

test('Process XML Import', async () => {
  const wrapper = mount(Competitors, {
    stubs: ['router-link'],
    mocks: {
      $database: {
        connection: {},
        connected: true,
        query: jest.fn().mockResolvedValue(),
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
    processXMLImport: jest.fn().mockResolvedValue('c'),
    refresh: jest.fn().mockResolvedValue(),
    assignCourses: jest.fn().mockResolvedValue('b'),
  })
  wrapper.vm.$database.query = jest.fn().mockResolvedValue({ affectedRows: 7 })

  await wrapper.vm.importXML()

  expect(
    wrapper.vm.$database.query
  ).toHaveBeenCalledWith(
    `INSERT INTO competitors (name,siid,club,ageClass,membershipNumber,course, event) VALUES ?`,
    ['b']
  )

  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    '7 Entries Imported'
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
  expect(wrapper.vm.assignCourses).toHaveBeenCalled()
  expect(wrapper.vm.processXMLImport).toHaveBeenCalled()
  expect(wrapper.vm.refresh).toHaveBeenCalled()
})

test('Process XML Import - Cancelled', async () => {
  const wrapper = mount(Competitors, {
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
    refresh: jest.fn().mockResolvedValue(),
    assignCourses: jest.fn().mockResolvedValue('b'),
  })

  await wrapper.vm.importXML()

  expect(wrapper.vm.$messages.addMessage).toHaveBeenCalledWith(
    'Problem Importing Entries',
    'error'
  )
  expect(wrapper.vm.$xml.xml2js).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.$fs.readFile).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.processXMLImport).toHaveBeenCalledTimes(0)
  expect(wrapper.vm.refresh).toHaveBeenCalledTimes(0)
})
