import { FC, useState, useEffect, useRef } from "react";
import { Grid, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

import { EVENT_STATE, EVENT_SEVERITY } from "../../consts";
import {
  EventState,
  EventsList,
  FetchedEventData,
} from "../../shared/types/events.types";
import {
  getEvents,
  ignoreEvent,
  reportEvent,
} from "../../services/events.provider";

import { EnhancedTable } from "../../components";

const TableContainer: FC = () => {
  const ws: React.MutableRefObject<WebSocket | null> = useRef(null);

  const [tableData, setTableData] = useState<EventsList>({
    rows: [],
    totalCount: 0,
  });
  const [ignoredCount, setIgnoredCount] = useState<number>(0);
  const [reportedCount, setReportedCount] = useState<number>(0);

  const fetchEvents = async (): Promise<void> => {
    const res: EventsList | void = await getEvents();

    if (res) {
      const rows: FetchedEventData[] = res.rows.map(
        (el) =>
          ({
            _id: el._id.toString(),
            name: el.name,
            severity: el?.severity || EVENT_SEVERITY.MEDIUM,
            state: el?.state || EVENT_STATE.CREATED,
            timestamp: el.timestamp,
          } as FetchedEventData)
      );

      setTableData({
        rows,
        totalCount: res.totalCount,
      });
    }
  };

  const handleWsOpen = (): void => {
    ws.current = new WebSocket(`${process.env.REACT_APP_WS_URI}`);
    ws.current.onopen = () => {
      console.log("Socket connection opened");
    };
  };

  const handleWsClose = (): void => {
    if (ws.current) {
      ws.current.close();
      console.log("Socket connection closed");
    }
  };

  const handleEventStatusChange = async (
    eventId: string,
    state: EventState
  ) => {
    handleWsOpen();

    if (state === EVENT_STATE.IGNORED) {
      await ignoreEvent(eventId);
    } else {
      await reportEvent(eventId);
    }

    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          sender: eventId,
          body: state,
        })
      );

      ws.current.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        const filteredRows = tableData.rows.filter(
          (el: FetchedEventData) => el?.state === EVENT_STATE.CREATED
        );

        setTableData((prev) => ({
          ...prev,
          rows: [...filteredRows],
        }));

        if (state === EVENT_STATE.IGNORED) {
          setIgnoredCount(data.ignoredCount.length);
        } else {
          setReportedCount(data.reportedCount.length);
        }
      };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    handleWsClose();
  }, []);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={6} mb={6}>
        <Typography align="center" variant="h1" fontSize="2rem" gutterBottom>
          Event Management
        </Typography>
      </Grid>

      <Grid container justifyContent="center" mb={4}>
        <Grid item sm={12} md={3} mr={{ xs: 1, sm: 3 }} mb={{ sm: 4 }}>
          <Box color="blue" fontWeight={900}>
            Ignored Count: {ignoredCount}
          </Box>
        </Grid>
        <Grid item md={3} sm={12} mb={{ sm: 1 }}>
          <Box color="red" fontWeight={900}>
            Reported Count: {reportedCount}
          </Box>
        </Grid>
      </Grid>

      <EnhancedTable
        rows={tableData.rows}
        handleEventStatusChange={handleEventStatusChange}
      />
    </Grid>
  );
};

export default TableContainer;
