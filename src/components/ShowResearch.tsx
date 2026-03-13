import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { visuallyHidden } from "@mui/utils";

interface Data {
  id: number;
  topic: string;
  start_date: Date;
  field: string;
  financial_outlay: number;
  funding_agency: string;
  other_officers: string;
}

function createData(
  id: number,
  topic: string,
  start_date: Date,
  field: string,
  financial_outlay: number,
  funding_agency: string,
  other_officers: string,
): Data {
  return {
    id,
    topic,
    start_date,
    field,
    financial_outlay,
    funding_agency,
    other_officers,
  };
}

const initialRows = [
  createData(
    1,
    "A semi-analytical method for hyperbolic conservation law: Application to Riemann problem.",
    new Date('2003-12-21'),
    "Applied Mathematics",
    130000,
    "SERB-CORE, New Delhi, India",
    "",
  ),
  createData(
    2,
    "Analytical and Numerical Study of Nanofluid Flow over a Stretching Sheet in a Porous Medium.",
    new Date(2003, 12, 21),
    "Applied Mathematics",
    240000,
    "NBHM, Mumbai, India",
    "",
  ),
  createData(
    3,
    "Similarity Solutions of Shock waves in Chaplygin gas and Invariant Solutions of Some Non-Linear Evolution Equations.",
    new Date('2003-12-21'),
    "Applied Mathematics",
    210000,
    "CSIR, New Delhi, India",
    "",
  ),
  createData(
    4,
    "Solutions of some non-linear evolution equations using Homotopy analysis method",
    new Date('2003-12-21'),
    "Applied Mathematics",
    30000,
    "UCOST Dehradun, India",
    "",
  ),
];

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparatorWithDate(a, b, orderBy)
    : (a, b) => -descendingComparatorWithDate(a, b, orderBy);
}

function descendingComparatorWithDate<T>(a: T, b: T, orderBy: keyof T) {
  const aValue = a[orderBy];
  const bValue = b[orderBy];

  if (aValue instanceof Date && bValue instanceof Date) {
    return bValue.getTime() - aValue.getTime();
  }
  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data | "actions";
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "topic",
    numeric: false,
    disablePadding: true,
    label: "TOPIC",
  },
  {
    id: "start_date",
    numeric: false,
    disablePadding: false,
    label: "START DATE",
  },
  {
    id: "field",
    numeric: false,
    disablePadding: false,
    label: "FIELD",
  },
  {
    id: "financial_outlay",
    numeric: false,
    disablePadding: false,
    label: "FINANCIAL OUTLAY",
  },
  {
    id: "funding_agency",
    numeric: false,
    disablePadding: false,
    label: "FUNDING AGENCY",
  },
  {
    id: "other_officers",
    numeric: false,
    disablePadding: false,
    label: "OTHER OFFICERS",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "ACTIONS",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  order: Order;
  orderBy: string;
  onAdd: () => void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, onAdd } = props;
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
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id as keyof Data)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Button onClick={onAdd}>Add</Button>

            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}



export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("topic");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<Data[]>(initialRows);
  const [editId, setEditId] = React.useState<number | null>(null);
  const [editRow, setEditRow] = React.useState<Partial<Data>>({});
  const [adding, setAdding] = React.useState(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row: Data) => {
    setEditId(row.id);
    setEditRow({ ...row });
  };

  const handleEditChange = (field: keyof Data, value: any) => {
    setEditRow((prev) => ({
      ...prev,
      [field]: field === "start_date" ? new Date(value) : value,
    }));
  };

  const handleEditSave = () => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === editId ? { ...row, ...editRow, start_date: new Date(editRow.start_date as Date) } : row
      )
    );
    setEditId(null);
    setEditRow({});
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditRow({});
  };

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleAdd = () => {
    setAdding(true);
    setEditRow({
      id: Math.max(0, ...rows.map(r => r.id)) + 1,
      topic: "",
      start_date: new Date(),
      field: "",
      financial_outlay: 0,
      funding_agency: "",
      other_officers: "",
    });
  };

  const handleAddSave = () => {
    setRows((prev) => [
      { ...(editRow as Data), start_date: new Date(editRow.start_date as Date) },
      ...prev,
    ]);
    setAdding(false);
    setEditRow({});
  };

  const handleAddCancel = () => {
    setAdding(false);
    setEditRow({});
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact'
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, padding: "0 1rem" }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onAdd={handleAdd}
            />
            <TableBody>
              {adding && (
                <TableRow>
                  <TableCell padding="none">
                    <TextField
                      variant='filled'
                      value={editRow.topic}
                      onChange={e => handleEditChange("topic", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant='filled'
                      type="date"
                      value={
                        editRow.start_date
                          ? new Date(editRow.start_date as Date)
                            .toISOString()
                            .substring(0, 10)
                          : ""
                      }
                      onChange={e => handleEditChange("start_date", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant='filled'
                      value={editRow.field}
                      onChange={e => handleEditChange("field", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant='filled'
                      type="number"
                      value={editRow.financial_outlay}
                      onChange={e => handleEditChange("financial_outlay", Number(e.target.value))}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant='filled'
                      value={editRow.funding_agency}
                      onChange={e => handleEditChange("funding_agency", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant='filled'
                      value={editRow.other_officers}
                      onChange={e => handleEditChange("other_officers", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={handleAddSave} >Save</Button>
                    <Button onClick={handleAddCancel} >Cancel</Button>
                  </TableCell>
                </TableRow>
              )}
              {visibleRows.map((row) => {
                const isEditing = editId === row.id;
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    {isEditing ? (
                      <>
                        <TableCell padding="none">
                          <TextField
                            variant='filled'
                            value={editRow.topic}
                            onChange={e => handleEditChange("topic", e.target.value)}
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant='filled'
                            type="date"
                            value={
                              editRow.start_date
                                ? new Date(editRow.start_date as Date)
                                  .toISOString()
                                  .substring(0, 10)
                                : ""
                            }
                            onChange={e => handleEditChange("start_date", e.target.value)}
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant='filled'
                            value={editRow.field}
                            onChange={e => handleEditChange("field", e.target.value)}
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant='filled'
                            type="number"
                            value={editRow.financial_outlay}
                            onChange={e => handleEditChange("financial_outlay", Number(e.target.value))}
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant='filled'
                            value={editRow.funding_agency}
                            onChange={e => handleEditChange("funding_agency", e.target.value)}
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant='filled'
                            value={editRow.other_officers}
                            onChange={e => handleEditChange("other_officers", e.target.value)}
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <Button onClick={handleEditSave}>Save</Button>
                          <Button onClick={handleEditCancel}>Cancel</Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell component="th" scope="row" padding="none">
                          {row.topic}
                        </TableCell>
                        <TableCell align="left">
                          {row.start_date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </TableCell>
                        <TableCell align="left">{row.field}</TableCell>
                        <TableCell align="left">{currencyFormatter.format(row.financial_outlay)}</TableCell>
                        <TableCell align="left">{row.funding_agency}</TableCell>
                        <TableCell align="left">{row.other_officers}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleEdit(row)}>Edit</Button>
                          <Button onClick={() => handleDelete(row.id)}>Delete</Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                    marginBottom: "1rem",
                  }}
                >
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
