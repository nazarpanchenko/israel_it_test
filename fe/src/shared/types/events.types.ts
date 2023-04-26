type EventState = 'created' | 'ignored' | 'reported';

type EventSeverity = 'low' | 'medium' | 'high';

export type ModifiedEventData = {
  _id: string;
  name: string;
  severity: EventSeverity;
  state: EventState;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
} | null;

export type FetchedEventData = {
  _id: string;
  name: string;
  severity: EventSeverity;
  state?: EventState;
  createdAt?: Date;
  updatedAt?: Date;
  timestamp: number;
};

export type TableCellData = {
  _id: string;
  name: string;
  severity?: EventSeverity;
  state?: EventState;
  timestamp: number;
};

export type EventsList = {
  rows: FetchedEventData[];
  totalCount: number;
};

export type EventsCount = {
  updatedEvent: ModifiedEventData;
  ignoredCount: number;
  reportedCount: number;
};
