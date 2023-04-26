import { Types } from 'mongoose';
import { EventModel } from '../db';
import { EventData, EventsList, EventsCount, EventState } from '../shared';
import { EVENT_STATE } from '../consts';

class EventProvider {
  async list(): Promise<EventsList> {
    const list: EventsList = await EventModel.getEventsList();
    return list;
  }

  async createEvent(event: EventData): Promise<void> {
    await EventModel.createEvent(event);
  }

  async setEventStatus(
    id: Types.ObjectId,
    state: EventState = EVENT_STATE.CREATED
  ): Promise<EventsCount> {
    const eventsCount: EventsCount = await EventModel.setEventStatus(id, state);
    return eventsCount;
  }
}

const eventProvider = new EventProvider();
export default eventProvider;
