import mongoose from 'mongoose';
import initDB from '../conf';
import { EventModel } from '..';
import { MockEventData } from '../../shared';
import { EVENT_SEVERITY } from '../../consts';

const mockData: MockEventData[] = [
  {
    name: 'Event 1',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 2',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 3',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 4',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 5',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 6',
    severity: EVENT_SEVERITY.LOW,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 7',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 8',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 9',
    severity: EVENT_SEVERITY.LOW,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 10',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 11',
    severity: EVENT_SEVERITY.LOW,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 12',
    severity: EVENT_SEVERITY.LOW,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 13',
    severity: EVENT_SEVERITY.LOW,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 14',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 15',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 16',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 17',
    severity: EVENT_SEVERITY.LOW,
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 18',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 19',
    timestamp: new Date().getSeconds(),
  },
  {
    name: 'Event 20',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: new Date().getSeconds(),
  },
];

(async function () {
  await initDB();
  await EventModel.insertMany(mockData);
  await mongoose.connection.close();
})();
