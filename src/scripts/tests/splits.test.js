import { calculateSplits } from '@/scripts/splits'

test('Calculate Splits', () => {
  expect(
    calculateSplits(
      [
        {
          id: 38,
          time: 50364,
          controlCode: 'S',
          competitor: 1,
          event: 1,
          type: null,
        },
        {
          id: 40,
          time: 50365,
          controlCode: '101',
          competitor: 1,
          event: 1,
          type: null,
        },
        {
          id: 41,
          time: 50366,
          controlCode: '102',
          competitor: 1,
          event: 1,
          type: null,
        },
        {
          id: 42,
          time: 50366,
          controlCode: '103',
          competitor: 1,
          event: 1,
          type: null,
        },

        {
          id: 39,
          time: 50367,
          controlCode: 'F',
          competitor: 1,
          event: 1,
          type: null,
        },
      ],
      [
        { time: 50365, controlCode: '101' },
        { time: 50366, controlCode: '102' },
        { time: 50366, controlCode: '103' },
      ],
      ['101', '102', '103']
    )
  ).toEqual([
    {
      number: 'S',
      controlCode: '',
      splitTime: null,
      elapsedTime: 0,
      punchTime: 50364,
    },
    {
      number: 1,
      controlCode: '101',
      splitTime: 0,
      elapsedTime: 1,
      punchTime: 50365,
    },
    {
      number: 2,
      controlCode: '102',
      splitTime: 0,
      elapsedTime: 2,
      punchTime: 50366,
    },
    {
      number: 3,
      controlCode: '103',
      splitTime: 0,
      elapsedTime: 2,
      punchTime: 50366,
    },
    {
      number: 'F',
      controlCode: '',
      splitTime: 1,
      elapsedTime: 3,
      punchTime: 50367,
    },
  ])
})

test('No Start or Finish', () => {
  expect(
    calculateSplits(
      [
        {
          id: 40,
          time: 50365,
          controlCode: '101',
          competitor: 1,
          event: 1,
          type: null,
        },
        {
          id: 41,
          time: 50366,
          controlCode: '102',
          competitor: 1,
          event: 1,
          type: null,
        },
        {
          id: 42,
          time: 50366,
          controlCode: '103',
          competitor: 1,
          event: 1,
          type: null,
        },
      ],
      [
        { time: 50365, controlCode: '101' },
        { time: 50366, controlCode: '102' },
        { time: 50366, controlCode: '103' },
      ],
      ['101', '102', '103']
    )
  ).toEqual([
    { number: 1, controlCode: '101', punchTime: 50365, type: 'noStart' },
    { number: 2, controlCode: '102', punchTime: 50366, type: 'noStart' },
    { number: 3, controlCode: '103', punchTime: 50366, type: 'noStart' },
  ])
})

test('Wrong Punch', () => {
  expect(
    calculateSplits(
      [
        {
          id: 83,
          time: 48495,
          controlCode: 'S',
          competitor: 6,
          event: 1,
          type: null,
        },
        {
          id: 85,
          time: 48504,
          controlCode: '101',
          competitor: 6,
          event: 1,
          type: null,
        },
        {
          id: 86,
          time: 48509,
          controlCode: '104',
          competitor: 6,
          event: 1,
          type: null,
        },
        {
          id: 87,
          time: 48520,
          controlCode: '108',
          competitor: 6,
          event: 1,
          type: null,
        },
        {
          id: 88,
          time: 48526,
          controlCode: '107',
          competitor: 6,
          event: 1,
          type: null,
        },
        {
          id: 89,
          time: 48542,
          controlCode: '103',
          competitor: 6,
          event: 1,
          type: null,
        },
        {
          id: 84,
          time: 48554,
          controlCode: 'F',
          competitor: 6,
          event: 1,
          type: null,
        },
      ],
      [
        { time: 48504, controlCode: '101' },
        null,
        { time: 48542, controlCode: '103' },
      ],
      ['101', '102', '103']
    )
  ).toEqual([
    {
      number: 'S',
      controlCode: '',
      splitTime: null,
      elapsedTime: 0,
      punchTime: 48495,
    },
    {
      number: 1,
      controlCode: '101',
      splitTime: 0,
      elapsedTime: 9,
      punchTime: 48504,
    },
    {
      number: 2,
      controlCode: '102',
      splitTime: null,
      elapsedTime: null,
      type: 'missing',
    },
    {
      number: '*',
      controlCode: '104',
      splitTime: null,
      elapsedTime: 14,
      punchTime: 48509,
      type: 'extra',
    },
    {
      number: '*',
      controlCode: '108',
      splitTime: null,
      elapsedTime: 25,
      punchTime: 48520,
      type: 'extra',
    },
    {
      number: '*',
      controlCode: '107',
      splitTime: null,
      elapsedTime: 31,
      punchTime: 48526,
      type: 'extra',
    },
    {
      number: 3,
      controlCode: '103',
      splitTime: 0,
      elapsedTime: 47,
      punchTime: 48542,
    },
    {
      number: 'F',
      controlCode: '',
      splitTime: 12,
      elapsedTime: 59,
      punchTime: 48554,
    },
  ])
})
