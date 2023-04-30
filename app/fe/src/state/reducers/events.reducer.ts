import {
  GET_EVENTS_LOADING,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_FAILURE,
  UPDATE_EVENTS_COUNT,
} from "../actions";
import {
  EventReduxAction,
  EventsList,
  EventReduxReducer,
} from "../../shared/types/events.types";

const intialState: EventReduxReducer = {
  events: {
    loading: false,
    rows: [],
    totalCount: 0,
  },
};

export const eventsReducer = (
  state = intialState,
  action: EventReduxAction
): EventReduxReducer => {
  switch (action.type) {
    case GET_EVENTS_LOADING:
      return {
        ...state,
        events: {
          ...state.events,
          loading: true,
        },
      };

    case GET_EVENTS_SUCCESS:
    case UPDATE_EVENTS_COUNT:
      return {
        ...state,
        events: {
          ...state.events,
          loading: false,
          rows: (action.payload as unknown as EventsList).rows,
          totalCount: (action.payload as unknown as EventsList).totalCount,
        },
      };

    case GET_EVENTS_FAILURE:
      return {
        ...state,
        events: {
          ...state.events,
          loading: false,
        },
      };

    default:
      return state;
  }
};
