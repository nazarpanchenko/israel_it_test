import { Model, Schema, model } from 'mongoose';
import {
  EventData,
  EventsList,
  ModifiedEventData,
  IgnoredEventsCount,
  ReportedEventsCount,
} from '../shared/types';
import { EVENT_SEVERITY, EVENT_STATE } from '../consts';
import { logger } from '../utils';

interface IEventModel extends Model<EventData> {
  getEvents(): Promise<EventsList>;
  createEvent(event: EventData): Promise<void>;
  ignoreEvent(id: string): Promise<IgnoredEventsCount>;
  reportEvent(id: string): Promise<ReportedEventsCount>;
}

const schema = new Schema<EventData, IEventModel>({
  name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 2,
  },
  severity: {
    type: String,
    enum: Object.values(EVENT_SEVERITY),
    default: EVENT_SEVERITY[2],
  },
  state: {
    type: String,
    enum: Object.values(EVENT_STATE),
    default: EVENT_STATE.CREATED,
  },
});

schema.statics.getEvents = async function (): Promise<EventsList> {
  const [data, totalCount]: [EventData[], number] = await Promise.all([
    EventModel.find(),
    EventModel.count(),
  ]);
  return { data, totalCount };
};

schema.statics.createEvent = async function (_event: EventData): Promise<void> {
  const event = new EventModel(_event);
  await event.save();
};

schema.statics.ignoreEvent = async function (_id: string): Promise<IgnoredEventsCount> {
  const updatedEvent: ModifiedEventData | null = await EventModel.findByIdAndUpdate(
    _id,
    {
      state: EVENT_STATE.IGNORED,
    },
    { new: true }
  );
  return {
    updatedEvent,
    ignoredCount: await EventModel.count({ state: EVENT_STATE.IGNORED }),
  };
};

schema.statics.reportEvent = async function (_id: string): Promise<ReportedEventsCount> {
  const updatedEvent: ModifiedEventData | null = await EventModel.findByIdAndUpdate(
    _id,
    { state: EVENT_STATE.REPORTED },
    { new: true }
  );
  return {
    updatedEvent,
    reportedCount: await EventModel.count({ state: EVENT_STATE.REPORTED }),
  };
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
