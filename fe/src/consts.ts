export const TABLE_HEADERS = [
  "ID",
  "NAME",
  "SEVERITY",
  "STATE",
  "TIMESTAMP",
  "ACTION",
];

export const EVENT_STATE = Object.freeze({
  CREATED: "created",
  IGNORED: "ignored",
  REPORTED: "reported",
});

export const EVENT_SEVERITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});
