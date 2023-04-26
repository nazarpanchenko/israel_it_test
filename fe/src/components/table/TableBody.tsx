import { FC } from "react";
import { TableCellData } from "../../shared/types/events.types";

interface ITableBodyProps {
  rows: TableCellData[];
  handleEventStatusChange: Function;
}

const TableBody: FC<ITableBodyProps> = ({ rows, handleEventStatusChange }) => (
  <tbody>
    {rows.map((data: TableCellData) => (
      <tr key={data.name}>
        <td>{data._id}</td>
        <td>{data.name}</td>
        <td>{data.severity}</td>
        <td>{data.state}</td>
        <td>{data.timestamp}</td>
        <td>
          <button
            type="button"
            id="event-ignore-btn"
            onClick={(e: any) =>
              handleEventStatusChange(e, data._id.toString())
            }
          >
            Ignore
          </button>
          <button
            type="button"
            id="event-report-btn"
            onClick={(e: any) =>
              handleEventStatusChange(e, data._id.toString())
            }
          >
            Report
          </button>
        </td>
      </tr>
    ))}
  </tbody>
);

export default TableBody;
