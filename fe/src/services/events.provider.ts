import { $axios } from "../utils";
import { FetchLimit, EventsList } from "../shared/types/events.types";

export const getEvents = async (
  limit: FetchLimit
): Promise<EventsList | void> => {
  try {
    const events: EventsList = await $axios.get(`/events`, {
      params: { limit },
    });
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
