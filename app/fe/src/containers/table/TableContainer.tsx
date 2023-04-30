import {
  FC,
  MutableRefObject,
  useState,
  useEffect,
  useRef,
  Dispatch,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Grid,
  Stack,
  Box,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  IconButton,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectChangeEvent } from "@mui/material/Select";
import CachedIcon from "@mui/icons-material/Cached";

import {
  FetchLimit,
  EventState,
  IgnoredEventsCount,
  ReportedEventsCount,
  EventReduxState,
  EventReduxSelector,
  EventReduxAction,
} from "../../shared/types/events.types";

import { FETCH_LIMIT, EVENT_STATE } from "../../consts";
import { ignoreEvent, reportEvent } from "../../services";
import { getEventsAction, updateEventsCountAction } from "../../state/actions";

import { EnhancedTable } from "../../components";

const TableContainer: FC = () => {
  const dispatch = useDispatch() as Dispatch<EventReduxAction>;
  const eventsSelector = useSelector<EventReduxSelector>(
    (state: EventReduxSelector) => state.eventsReducer.events
  ) as EventReduxState;

  const ws: MutableRefObject<WebSocket | null> = useRef(null);

  const [rowsLimit, setRowsLimit] = useState<FetchLimit>(
    FETCH_LIMIT.AVERAGE as FetchLimit
  );

  const fetchEvents = async (): Promise<void> => {
    dispatch(getEventsAction(rowsLimit) as unknown as EventReduxAction);
  };

  const handleRowsLimitChange = (e: SelectChangeEvent): void => {
    setRowsLimit(e.target.value as unknown as FetchLimit);
  };

  const handleTableRefresh = async () => {
    fetchEvents();
  };

  const handleEventStatusChange = async (
    eventId: string,
    state: EventState
  ): Promise<void> => {
    if (state === EVENT_STATE.IGNORED) {
      await ignoreEvent(eventId);
    } else if (state === EVENT_STATE.REPORTED) {
      await reportEvent(eventId);
    }

    ws.current = new WebSocket(`${process.env.REACT_APP_WS_URI}`);

    ws.current.onopen = () => {
      console.log("Socket connection opened");

      (ws as unknown as MutableRefObject<WebSocket>).current.send(
        JSON.stringify({
          sender: eventId,
          body: state,
        })
      );

      (ws as unknown as MutableRefObject<WebSocket>).current.onmessage = async (
        e
      ) => {
        const wsRes: IgnoredEventsCount | ReportedEventsCount = JSON.parse(
          e.data
        );
        const { filteredEvents } = wsRes;

        (ws as unknown as MutableRefObject<WebSocket>).current.close();
        console.log("Socket connection closed");

        if (state === EVENT_STATE.IGNORED) {
          localStorage.setItem(
            "ignoredEventsCount",
            String((wsRes as unknown as IgnoredEventsCount).ignoredCount)
          );
        } else if (state === EVENT_STATE.REPORTED) {
          localStorage.setItem(
            "reportedEventsCount",
            String((wsRes as unknown as ReportedEventsCount).reportedCount)
          );
        }

        dispatch(
          updateEventsCountAction(filteredEvents, filteredEvents.length)
        );
      };
    };
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} mb={5}>
        <Typography align="center" variant="h1" fontSize="2.5rem" gutterBottom>
          Event Management
        </Typography>
      </Grid>
      <Grid item sm={12} md={3} mr={{ xs: 1, sm: 3 }} mb={{ sm: 5 }}>
        <Box color="blue" fontWeight={900}>
          Ignored Count: {localStorage.getItem("ignoredEventsCount") || "0"}
        </Box>
      </Grid>
      <Grid item md={3} sm={12} mb={{ xs: 1, sm: 5 }}>
        <Box color="red" fontWeight={900}>
          Reported Count: {localStorage.getItem("reportedEventsCount") || "0"}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box maxWidth={180} mb={5}>
          <Stack direction="row" justifyContent="space-between" spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="rows-limit-label">Rows Limit</InputLabel>
              <Select
                labelId="rows-limit-label"
                id="rows-limit"
                value={rowsLimit as unknown as string | undefined}
                defaultValue={
                  FETCH_LIMIT.AVERAGE as unknown as string | undefined
                }
                label="Rows limit"
                onChange={handleRowsLimitChange}
              >
                <MenuItem value={FETCH_LIMIT.MIN}>{FETCH_LIMIT.MIN}</MenuItem>
                <MenuItem value={FETCH_LIMIT.AVERAGE}>
                  {FETCH_LIMIT.AVERAGE}
                </MenuItem>
                <MenuItem value={FETCH_LIMIT.MAX}>{FETCH_LIMIT.MAX}</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={handleTableRefresh}>
              <CachedIcon fontSize="large" />
            </IconButton>
          </Stack>
        </Box>
      </Grid>

      <Grid item xs={12}>
        {eventsSelector.loading ? (
          <Stack direction="row" justifyContent="center" alignItems="center">
            <CircularProgress size="20vw" />
          </Stack>
        ) : (
          <EnhancedTable
            rows={eventsSelector.rows}
            handleEventStatusChange={handleEventStatusChange}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TableContainer;
