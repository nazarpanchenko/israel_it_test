import { Types } from 'mongoose';
import {
  EventState,
  EventsList,
  IgnoredEventsCount,
  ReportedEventsCount,
} from '../shared';
import { EventModel } from '../db';

class EventProvider {
  async list(): Promise<EventsList> {
    const list: EventsList = await EventModel.getEventsList();
    return list;
  }

  async ignoreEvent(id: Types.ObjectId): Promise<void> {
    await EventModel.ignoreEvent(id);
  }

  async reportEvent(id: Types.ObjectId): Promise<void> {
    await EventModel.reportEvent(id);
  }

  async countEvents(
    state: EventState
  ): Promise<IgnoredEventsCount | ReportedEventsCount> {
    const eventsCount: any = await EventModel.countEvents(state);
    return eventsCount;
  }
}

const eventProvider = new EventProvider();
export default eventProvider;
