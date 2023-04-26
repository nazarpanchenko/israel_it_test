import { AxiosResponse } from "axios";

import { $axios } from "../utils";
import { EventsList } from "../shared/types/events.types";

export const getEvents = async (): Promise<EventsList> => {
  const res: AxiosResponse<any, any> = await $axios.get(`/events`);
  const events: EventsList = res.data;
  return events;
};
