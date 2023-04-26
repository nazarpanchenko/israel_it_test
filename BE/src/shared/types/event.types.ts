import { Types } from 'mongoose';

type EventState = 'created' | 'ignored' | 'reported';

type EventSeverity = 'low' | 'medium' | 'high';

type ModifiedEventData = {
  _id: Types.ObjectId;
  name: string;
  severity: EventSeverity;
  state: EventState;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
} | null;

type EventData = {
  _id: Types.ObjectId;
  name: string;
  severity?: EventSeverity;
  state?: EventState;
  createdAt: Date;
  updatedAt: Date;
};

type EventWithTimestamp = {
  _id: Types.ObjectId;
  name: string;
  severity?: EventSeverity;
  state?: EventState;
  createdAt: Date;
  updatedAt: Date;
  timestamp: number;
};

type MockEventData = {
  _id?: Types.ObjectId;
  name: string;
  severity?: EventSeverity;
  state?: EventState;
  timestamp: number;
};

type EventsList = {
  rows: EventData[];
  totalCount: number;
};

type EventsCount = {
  updatedEvent: ModifiedEventData;
  ignoredCount: number;
  reportedCount: number;
};

type WebSocketMessage = {
  sender: Types.ObjectId;
  body: EventState;
};

export {
  EventState,
  EventSeverity,
  EventData,
  EventWithTimestamp,
  MockEventData,
  EventsList,
  ModifiedEventData,
  EventsCount,
  WebSocketMessage,
};
