import { Dispatch } from "react";

import {
  GET_EVENTS_FAILURE,
  GET_EVENTS_LOADING,
  GET_EVENTS_SUCCESS,
  UPDATE_EVENTS_COUNT,
} from "./actionTypes";
import {
  EventReduxAction,
  EventsList,
  FetchLimit,
  FetchedEventData,
} from "../../../shared/types/events.types";

import { getEvents } from "../../../services";
import { EVENT_SEVERITY, EVENT_STATE } from "../../../consts";

export const getEventsAction =
  (rowsLimit: FetchLimit) =>
  async (dispatch: Dispatch<any>): Promise<EventReduxAction | void> => {
    try {
      dispatch({
        type: GET_EVENTS_LOADING,
      });

      const eventsList: EventsList | void = await getEvents(rowsLimit);

      const rows: FetchedEventData[] = (
        eventsList as unknown as EventsList
      ).rows.map(
        (el) =>
          ({
            _id: el._id.toString(),
            name: el.name,
            severity: el?.severity || EVENT_SEVERITY.MEDIUM,
            state: el?.state || EVENT_STATE.CREATED,
            timestamp: el.timestamp,
          } as FetchedEventData)
      );

      dispatch({
        type: GET_EVENTS_SUCCESS,
        payload: {
          rows,
          totalCount: (eventsList as unknown as EventsList).totalCount,
        },
      });

      return {
        type: GET_EVENTS_SUCCESS,
        payload: {
          rows: (eventsList as EventsList).rows,
          totalCount: (eventsList as EventsList).totalCount,
        },
      };
    } catch (err: any) {
      console.log(err.message);
      dispatch({
        type: GET_EVENTS_FAILURE,
      });
    }
  };

export const updateEventsCountAction = (
  rows: FetchedEventData[],
  totalCount: number
): EventReduxAction => {
  return {
    type: UPDATE_EVENTS_COUNT,
    payload: {
      rows,
      totalCount,
    },
  };
};
