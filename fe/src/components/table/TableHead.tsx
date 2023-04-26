import { FC } from "react";

interface ITableHeadProps {
  headers: string[];
}

const TableHead: FC<ITableHeadProps> = ({ headers }) => (
  <thead>
    <tr>
      {headers.map((el: string) => (
        <td key={el}>
          <strong>{el}</strong>
        </td>
      ))}
    </tr>
  </thead>
);

export default TableHead;
