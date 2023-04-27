export type EventSeverity = "low" | "medium" | "high";

export type EventState = "created" | "ignored" | "reported";

export type FetchedEventData = {
  _id: string;
  name: string;
  severity: EventSeverity;
  state?: EventState;
  timestamp: number;
};

export type TableCellData = {
  _id: string;
  name: string;
  severity?: EventSeverity;
  timestamp: number;
};

export type MuiTableCellData = {
  _id: string | number;
  name: string | number;
  severity: string | number;
  timestamp: string | number;
  action: string | number;
}[];

export type EventsList = {
  rows: FetchedEventData[];
  totalCount: number;
};

export type IgnoredEventsCount = {
  ignoredCount: FetchedEventData[];
};

export type ReportedEventsCount = {
  reportedCount: FetchedEventData[];
};
