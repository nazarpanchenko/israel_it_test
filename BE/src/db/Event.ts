import { Model, Schema, model, Types } from 'mongoose';
import {
  EventData,
  EventState,
  EventsList,
  IgnoredEventsCount,
  ReportedEventsCount,
} from '../shared';

import { EVENT_STATE, EVENT_SEVERITY } from '../consts';
import { logger } from '../utils';

interface IEventModel extends Model<EventData> {
  getEventsList(): Promise<EventsList>;
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

schema.statics.getEventsList = async function (): Promise<EventsList> {
  const [rows, totalCount]: [EventData[], number] = await Promise.all([
    EventModel.find().lean(),
    EventModel.count(),
  ]);

  return { rows, totalCount };
};

schema.statics.ignoreEvent = async function (_id: Types.ObjectId): Promise<void> {
  await EventModel.findByIdAndUpdate(
    _id,
    {
      state: EVENT_STATE.IGNORED,
    },
    { new: true }
  );
};

schema.statics.reportEvent = async function (_id: Types.ObjectId): Promise<void> {
  await EventModel.findByIdAndUpdate(
    _id,
    {
      state: EVENT_STATE.REPORTED,
    },
    { new: true }
  );
};

schema.statics.countEvents = async function (
  state: EventState
): Promise<IgnoredEventsCount | ReportedEventsCount> {
  if (state === EVENT_STATE.IGNORED) {
    return {
      ignoredCount: await EventModel.find({ state }),
    };
  } else {
    return {
      reportedCount: await EventModel.find({ state }),
    };
  }
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
