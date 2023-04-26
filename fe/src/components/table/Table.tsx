import { useState, useEffect, useRef } from "react";
import { EventsList, FetchedEventData } from "../../shared/types/events.types";
import { TABLE_HEADERS, EVENT_STATE, EVENT_SEVERITY } from "../../consts";
import { getEvents } from "../../services/events.provider";

import TableHead from "./TableHead";
import TableBody from "./TableBody";

import "./Table.css";

const Table = () => {
  const ws: any = useRef();

  const [tableData, setTableData] = useState<EventsList>({
    rows: [],
    totalCount: 0,
  });
  const [ignoredCount, setIgnoredCount] = useState<number>(0);
  const [reportedCount, setReportedCount] = useState<number>(0);

  const handleEventStatusChange = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    eventId: string
  ) => {
    const action =
      (e.target as HTMLInputElement).id === "event-ignore-btn"
        ? EVENT_STATE.IGNORED
        : EVENT_STATE.REPORTED;

    ws.current.send(
      JSON.stringify({
        sender: eventId,
        body: action,
      })
    );
  };

  useEffect(() => {
    ws.current = new WebSocket(`${process.env.REACT_APP_WS_URI}`);
    ws.current.onopen = () => {
      console.log("Socket connection opened");
    };
    ws.current.onmessage = (e: any) => {
      const data = JSON.parse(e.data);
      const filteredRows = tableData.rows.filter(
        (el: FetchedEventData) => el.state === EVENT_STATE.CREATED
      );

      setIgnoredCount(data.ignoredCount);
      setReportedCount(data.reportedCount);
      setTableData((prev) => ({
        ...prev,
        rows: filteredRows,
        totalCount: filteredRows.length,
      }));
    };

    return () => {
      ws.current.close();
      console.log("Connection closed");
    };
  }, [tableData.totalCount]);

  useEffect(() => {
    (async function () {
      const res: EventsList = await getEvents();
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
    })();
  }, []);

  return (
    <div className="table-wrapper">
      <h1>Events</h1>

      <div className="counters">
        <span>
          <em>Ignored Events Count: {ignoredCount}</em>
        </span>
        <span>
          <em>Reported Events Count: {reportedCount}</em>
        </span>
      </div>

      <table className="table">
        <TableHead headers={TABLE_HEADERS} />
        <TableBody
          rows={tableData.rows}
          handleEventStatusChange={handleEventStatusChange}
        />
      </table>
    </div>
  );
};

export default Table;
