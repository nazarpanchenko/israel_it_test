import mongoose from 'mongoose';
import initDB from '../conf';
import { EventModel } from '..';
import { MockEventData } from '../../shared';
import { EVENT_SEVERITY } from '../../consts';

const mockData: MockEventData[] = [
  {
    name: 'Event 1',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 2',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 3',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 4',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 5',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 6',
    severity: EVENT_SEVERITY.LOW,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 7',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 8',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 9',
    severity: EVENT_SEVERITY.LOW,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 10',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 11',
    severity: EVENT_SEVERITY.LOW,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 12',
    severity: EVENT_SEVERITY.LOW,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 13',
    severity: EVENT_SEVERITY.LOW,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 14',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 15',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 16',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 17',
    severity: EVENT_SEVERITY.LOW,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 18',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 19',
    timestamp: Math.round(new Date().getTime() / 1000),
  },
  {
    name: 'Event 20',
    severity: EVENT_SEVERITY.HIGH,
    timestamp: Math.round(new Date().getTime() / 1000),
  },
];

(async function () {
  await initDB();
  await EventModel.insertMany(mockData);
  await mongoose.connection.close();
})();
