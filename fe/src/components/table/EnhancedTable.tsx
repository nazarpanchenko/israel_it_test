import { FC, useState, useMemo } from "react";
import { alpha } from "@mui/material/styles";

import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import ReportIcon from "@mui/icons-material/Report";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { visuallyHidden } from "@mui/utils";

import {
  TableCellData,
  MuiTableCellData,
  EventSeverity,
} from "../../shared/types/events.types";
import { EVENT_STATE, TABLE_PAGINATION_LIMIT } from "../../consts";

interface Data {
  _id: string;
  name: string;
  severity: EventSeverity;
  timestamp: number;
  action: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "_id",
    numeric: false,
    label: "ID",
    sortable: true,
  },
  {
    id: "name",
    numeric: false,
    label: "Name",
    sortable: true,
  },
  {
    id: "severity",
    numeric: false,
    label: "Severity",
    sortable: true,
  },
  {
    id: "timestamp",
    numeric: true,
    label: "Timestamp (Sec)",
    sortable: true,
  },
  {
    id: "action",
    numeric: true,
    label: "Action",
    sortable: false,
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </>
            ) : (
              <>{headCell.label}</>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar() {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...{
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Events
      </Typography>
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

interface IEnhancedTableProps {
  rows: TableCellData[];
  handleEventStatusChange: Function;
}

const EnhancedTable: FC<IEnhancedTableProps> = (props: IEnhancedTableProps) => {
  const { rows, handleEventStatusChange } = props;

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("_id");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    TABLE_PAGINATION_LIMIT.MIN
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(
      parseInt(event.target.value, TABLE_PAGINATION_LIMIT.AVERAGE)
    );
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows as MuiTableCellData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row: any) => {
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    tabIndex={-1}
                    key={row._id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="left">{row._id}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.severity}</TableCell>
                    <TableCell align="right">{row.timestamp}</TableCell>
                    <TableCell align="right">
                      <Stack
                        justifyContent="flex-end"
                        spacing={{ xs: 2 }}
                        direction="row"
                        useFlexGap
                        flexWrap="wrap"
                      >
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleEventStatusChange(
                              row._id,
                              EVENT_STATE.IGNORED
                            )
                          }
                        >
                          <Stack
                            alignItems="center"
                            spacing={{ xs: 1 }}
                            direction="row"
                            useFlexGap
                            flexWrap="wrap"
                          >
                            <ReportIcon color="error" />
                            <Box color="info">Ignore</Box>
                          </Stack>
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleEventStatusChange(
                              row._id,
                              EVENT_STATE.REPORTED
                            )
                          }
                        >
                          <Stack
                            spacing={{ xs: 1 }}
                            direction="row"
                            useFlexGap
                            flexWrap="wrap"
                          >
                            <DoNotDisturbIcon color="info" />
                            <Box color="error">Report</Box>
                          </Stack>
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[...Object.values(TABLE_PAGINATION_LIMIT)]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
};

export default EnhancedTable;
