import { Model, Schema, model, Types } from 'mongoose';
import {
  FetchLimit,
  EventData,
  EventState,
  EventsList,
  IgnoredEventsCount,
  ReportedEventsCount,
} from '../shared';

import { EVENT_STATE, EVENT_SEVERITY } from '../consts';
import { logger } from '../utils';

interface IEventModel extends Model<EventData> {
  getEventsList(limit: FetchLimit): Promise<EventsList>;
  ignoreEvent(id: Types.ObjectId): Promise<void>;
  reportEvent(id: Types.ObjectId): Promise<void>;
  countEvents(state: EventState): Promise<IgnoredEventsCount | ReportedEventsCount>;
}

const schema = new Schema<EventData, IEventModel>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  severity: {
    type: String,
    enum: Object.values(EVENT_SEVERITY),
    default: EVENT_SEVERITY.MEDIUM,
  },
  state: {
    type: String,
    enum: Object.values(EVENT_STATE),
    default: EVENT_STATE.CREATED,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

schema.statics.getEventsList = async function (limit: FetchLimit): Promise<EventsList> {
  const [rows, totalCount]: [EventData[], number] = await Promise.all([
    EventModel.find({ state: EVENT_STATE.CREATED }).limit(limit).lean(),
    EventModel.count({ state: EVENT_STATE.CREATED }),
  ]);

  return { rows, totalCount };
};

schema.statics.ignoreEvent = async function (id: Types.ObjectId): Promise<void> {
  await EventModel.findByIdAndUpdate(id, {
    state: EVENT_STATE.IGNORED,
  });
};

schema.statics.reportEvent = async function (id: Types.ObjectId): Promise<void> {
  await EventModel.findByIdAndUpdate(id, {
    state: EVENT_STATE.REPORTED,
  });
};

schema.statics.countEvents = async function (
  state: EventState
): Promise<IgnoredEventsCount | ReportedEventsCount> {
  const filteredEvents = await EventModel.find({ state: EVENT_STATE.CREATED });
  const eventsCount: unknown = { filteredEvents };

  if (state === EVENT_STATE.IGNORED) {
    (eventsCount as IgnoredEventsCount).ignoredCount = await EventModel.count({ state });
  } else if (state === EVENT_STATE.REPORTED) {
    (eventsCount as ReportedEventsCount).reportedCount = await EventModel.count({
      state,
    });
  }

  return eventsCount as IgnoredEventsCount | ReportedEventsCount;
};

const EventModel = model<EventData, IEventModel>('Event', schema);
EventModel.createCollection()
  .then(() => {
    EventModel.createCollection();
  })
  .then(() => {
    logger.info('Event schema is successfully intialized');
  });

export default EventModel;
