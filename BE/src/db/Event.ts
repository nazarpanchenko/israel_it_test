import { Model, Schema, model, Types } from 'mongoose';
import {
  EventData,
  EventsList,
  ModifiedEventData,
  EventsCount,
  EventState,
} from '../shared';

import { EVENT_STATE, EVENT_SEVERITY } from '../consts';
import { logger } from '../utils';

interface IEventModel extends Model<EventData> {
  getEventsList(): Promise<EventsList>;
  getEventsCount(state: EventState): Promise<number>;
  createEvent(event: EventData): Promise<void>;
  setEventStatus(id: Types.ObjectId, state: EventState): Promise<EventsCount>;
}

const schema = new Schema<EventData, IEventModel>(
  {
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
  },
  {
    timestamps: true,
  }
);

schema.statics.getEventsList = async function (): Promise<EventsList> {
  const [rows, totalCount]: [EventData[], number] = await Promise.all([
    EventModel.find().lean(),
    EventModel.count(),
  ]);
  const _rows = rows.map((el: EventData) => ({
    ...el,
    timestamp: new Date(el.createdAt).getSeconds(),
  }));

  return { rows: _rows, totalCount };
};

schema.statics.getEventsCount = async function (state: EventState): Promise<number> {
  const count = await EventModel.count({ state });
  return count;
};

schema.statics.createEvent = async function (_event: EventData): Promise<void> {
  const event = new EventModel(_event);
  await event.save();
};

schema.statics.setEventStatus = async function (
  _id: Types.ObjectId,
  state: EventState
): Promise<EventsCount> {
  const updatedEvent: ModifiedEventData | null = await EventModel.findByIdAndUpdate(
    _id,
    {
      state,
    },
    { new: true }
  );

  return {
    updatedEvent,
    ignoredCount: await EventModel.getEventsCount(EVENT_STATE.IGNORED),
    reportedCount: await EventModel.getEventsCount(EVENT_STATE.REPORTED),
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
