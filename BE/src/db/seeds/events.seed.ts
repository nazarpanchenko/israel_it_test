import initDB from '../conf';
import { EventModel } from '..';
import { closeDBConnection } from '../conf';
import { MockEventData } from '../../shared';
import { EVENT_SEVERITY } from '../../consts';

(async () => {
  await initDB();

  let mockData: MockEventData[] = [];

  for (let i = 1; i <= 40; i++) {
    mockData.push({
      name: `Event #${i}`,
      severity: EVENT_SEVERITY.LOW,
      timestamp: Math.round(new Date().getTime() / 1000),
    });
  }

  for (let i = 41; i <= 70; i++) {
    mockData.push({
      name: `Event #${i}`,
      severity: EVENT_SEVERITY.MEDIUM,
      timestamp: Math.round(new Date().getTime() / 1000),
    });
  }

  for (let i = 71; i <= 100; i++) {
    mockData.push({
      name: `Event #${i}`,
      severity: EVENT_SEVERITY.HIGH,
      timestamp: Math.round(new Date().getTime() / 1000),
    });
  }

  await EventModel.insertMany(mockData);
  await closeDBConnection();
})();
