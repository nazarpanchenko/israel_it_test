export const API_PREFIX = '/api/v1';

export const FETCH_LIMIT = Object.freeze({
  MIN: 10,
  AVERAGE: 25,
  MAX: 50,
});

export const EVENT_SEVERITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

export const EVENT_STATE = Object.freeze({
  CREATED: 'created',
  IGNORED: 'ignored',
  REPORTED: 'reported',
});
