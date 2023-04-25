type EventSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

type EventState = 'created' | 'ignored' | 'reported';

type ModifiedEventData = {
  _id: object;
  name: string;
  timestamp: number;
  severity: string;
  state: string;
  __v: number;
} | null;

type EventData = {
  id: string;
  name: string;
  timestamp: number;
  severity: EventSeverity;
  state: EventState;
};

type EventsList = {
  data: EventData[];
  totalCount: number;
};

type IgnoredEventsCount = {
  updatedEvent: ModifiedEventData;
  ignoredCount: number;
};

type ReportedEventsCount = {
  updatedEvent: ModifiedEventData;
  reportedCount: number;
};

export {
  EventData,
  EventsList,
  ModifiedEventData,
  IgnoredEventsCount,
  ReportedEventsCount,
};
