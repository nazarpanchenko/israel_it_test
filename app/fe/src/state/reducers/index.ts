import { combineReducers } from "redux";
import { eventsReducer } from "./events.reducer";

const reducers = combineReducers({
  eventsReducer,
});

export default reducers;
