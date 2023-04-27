import { AxiosResponse } from "axios";
import { $axios } from "../utils";
import { EventsList } from "../shared/types/events.types";

export const getEvents = async (): Promise<EventsList | void> => {
  try {
    const res: AxiosResponse<any, any> = await $axios.get(`/events`);
    const events: EventsList = res.data;
    return events;
  } catch (err: any) {
    console.log(err.message);
  }
};

export const ignoreEvent = async (id: string): Promise<void> => {
  try {
    await $axios.post(`/events/ignore`, {
      id,
    });
  } catch (err: any) {
    console.log(err.message);
  }
};

export const reportEvent = async (id: string): Promise<void> => {
  try {
    await $axios.post(`/events/report`, {
      id,
    });
  } catch (err: any) {
    console.log(err.message);
  }
};
