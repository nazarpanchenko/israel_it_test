import { Types } from 'mongoose';

type FetchLimit = 10 | 25 | 50;

type EventState = 'created' | 'ignored' | 'reported';

type EventSeverity = 'low' | 'medium' | 'high';

type EventData = {
  _id: Types.ObjectId;
  name: string;
  severity?: EventSeverity;
  state?: EventState;
  timestamp: number;
};

type EventWithTimestamp = {
  _id: Types.ObjectId;
  name: string;
  severity?: EventSeverity;
  state?: EventState;
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

type IgnoredEventsCount = {
  filteredEvents: EventWithTimestamp[];
  ignoredCount: number;
};

type ReportedEventsCount = {
  filteredEvents: EventWithTimestamp[];
  reportedCount: number;
};

export {
  FetchLimit,
  EventState,
  EventSeverity,
  EventData,
  EventWithTimestamp,
  MockEventData,
  EventsList,
  IgnoredEventsCount,
  ReportedEventsCount,
};
