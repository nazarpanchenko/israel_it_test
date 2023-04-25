import { EventModel } from '../db';
import {
  EventData,
  EventsList,
  IgnoredEventsCount,
  ReportedEventsCount,
} from '../shared/types';

class EventProvider {
  async list(): Promise<EventsList> {
    const list: EventsList = await EventModel.getEvents();
    return list;
  }

  async createEvent(event: EventData): Promise<void> {
    await EventModel.createEvent(event);
  }

  async ignoreEvent(id: string): Promise<IgnoredEventsCount> {
    const eventsCount: IgnoredEventsCount = await EventModel.ignoreEvent(id);
    return eventsCount;
  }

  async reportEvent(id: string): Promise<ReportedEventsCount> {
    const eventsCount: ReportedEventsCount = await EventModel.reportEvent(id);
    return eventsCount;
  }
}

const eventProvider = new EventProvider();
export default eventProvider;
