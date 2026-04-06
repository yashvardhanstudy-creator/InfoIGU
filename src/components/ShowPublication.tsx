import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { useTheme } from '@mui/material/styles';
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { Box, IconButton, TableFooter, TablePagination } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import * as constants from "./constants";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface Publication {
  id: string | number;
  title: string;
  publish_date: string;
  url: string;
}

export default function ShowPublication({ id, heading, headingId, editMode, isPrint }: { id: number; heading?: string; headingId?: string; editMode?: boolean; isPrint?: boolean; }) {
  const [loading, setLoading] = React.useState(!!id);
  const [publications, setPublications] = React.useState<Publication[]>([]);
  const [onEdit, setOnEdit] = React.useState<{ [key: string]: boolean }>({});
  const [showURLColumn, setShowURLColumn] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(isPrint ? -1 : 5);

  React.useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${constants.SERVER_URL}api/publications/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch publications data");
        }
        const fetchedData = await response.json();
        if (fetchedData && fetchedData.length > 0) {
          setPublications(fetchedData);
          setOnEdit(
            Object.fromEntries(
              fetchedData.map((pub: Publication) => [pub.id.toString(), false])
            )
          );
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPublications();
    }
  }, [id]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - publications.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAdd = () => {
    if (publications.find((pub) => pub.title === "")) return;
    const tempId = `temp_${Date.now()}`;
    const newPub: Publication = {
      id: tempId,
      title: "",
      publish_date: "",
      url: "",
    };
    setShowURLColumn(showURLColumn + 1);
    setPublications([newPub, ...publications]);
    setOnEdit((prev) => ({ ...prev, [tempId]: true }));
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowURLColumn(showURLColumn + 1);
    const pubToEdit = e.currentTarget.name;
    setOnEdit((prev) => ({ ...prev, [pubToEdit]: true }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const pubToSave = e.currentTarget.name;
    const titleVal = (document.querySelector(`input[name="title_${pubToSave}"]`) as HTMLInputElement)?.value || "";
    const dateVal = (document.querySelector(`input[name="publish_date_${pubToSave}"]`) as HTMLInputElement)?.value || "";
    const urlVal = (document.querySelector(`input[name="url_${pubToSave}"]`) as HTMLInputElement)?.value || "";
    setShowURLColumn(showURLColumn - 1);

    if (titleVal) {
      try {
        const isNew = pubToSave.startsWith("temp_");
        const endpointUrl = isNew
          ? `${constants.SERVER_URL}api/publications/${id}`
          : `${constants.SERVER_URL}api/publications/${id}/${pubToSave}`;
        const method = isNew ? "POST" : "PUT";

        const response = await fetch(endpointUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: titleVal,
            publish_date: dateVal,
            url: urlVal,
          }),
        });

        if (response.ok) {
          const newPub = await response.json();
          const updatedPubs = publications.map((pub) => {
            if (pub.id.toString() === pubToSave) {
              return newPub;
            }
            return pub;
          });
          setPublications(updatedPubs);
          setOnEdit((prev) => ({
            ...prev,
            [newPub.id.toString()]: false,
            [pubToSave]: false,
          }));
          return;
        }
      } catch (error) {
        console.error("Error saving publication:", error);
      }
    }
    setOnEdit((prev) => ({ ...prev, [pubToSave]: false }));
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowURLColumn(showURLColumn - 1);
    const pubToCancel = e.currentTarget.name;
    if (pubToCancel.startsWith("temp_")) {
      setPublications(publications.filter((p) => p.id.toString() !== pubToCancel));
    }
    setOnEdit((prev) => ({ ...prev, [pubToCancel]: false }));
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const pubToDelete = e.currentTarget.name;
    try {
      const response = await fetch(
        `${constants.SERVER_URL}api/publications/${id}/${pubToDelete}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setPublications((prev) => prev.filter((pub) => pub.id.toString() !== pubToDelete));
      }
    } catch (error) {
      console.error("Error deleting publication:", error);
    }
  };

  const renderInput = (name: string, placeholder: string, defaultValue: string, required = false) => (
    <input
      className="border-b-2 focus:outline-none focus:border-blue-500 w-full"
      placeholder={placeholder}
      name={name}
      defaultValue={defaultValue}
      style={{ display: "block", marginTop: "0.5rem" }}
      required={required}
    />
  );

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (publications.length === 0 && !editMode) {
    return null;
  }

  return (
    <div className="mb-6">
      {heading && <h3 className="text-xl mb-4" id={headingId}>{heading}</h3>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="publication table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Publish Date</TableCell>
              {showURLColumn > 0 ? <TableCell>URL</TableCell> : null}
              {editMode && (
                <TableCell align="right">
                  <Button onClick={handleAdd}>Add</Button>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? publications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : publications).map((row) => {
                const rowId = row.id.toString();
                const isEditing = onEdit[rowId];
                return (
                  <TableRow
                    key={rowId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {isEditing ? renderInput(`title_${rowId}`, "Title", row.title, true) : (
                        <Tooltip title={row.title} placement="top-start" arrow>
                          <div className="max-w-50 truncate">
                            {row.url ? (
                              <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline">
                                {row.title}
                              </a>
                            ) : (
                              row.title
                            )}
                          </div>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? renderInput(`publish_date_${rowId}`, "Publish Date", row.publish_date) : row.publish_date}
                    </TableCell>
                    {showURLColumn > 0 && (
                      <TableCell>
                        {isEditing ? renderInput(`url_${rowId}`, "URL", row.url) : null}
                      </TableCell>
                    )}
                    {editMode && (
                      <TableCell align="right">
                        {isEditing ? (
                          <div className="flex justify-end min-w-max">
                            <Button onClick={handleSave} name={rowId}>Save</Button>
                            <Button onClick={handleCancel} name={rowId}>Cancel</Button>
                          </div>
                        ) : (
                          <div className="flex justify-end min-w-max">
                            <Button onClick={handleEdit} name={rowId}>Edit</Button>
                            <Button onClick={handleDelete} name={rowId}>Delete</Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={(showURLColumn > 0 ? 3 : 2) + (editMode ? 1 : 0)} />
              </TableRow>
            )}
          </TableBody>
          {!isPrint && (
            <TableFooter className="print:hidden">
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={(showURLColumn > 0 ? 3 : 2) + (editMode ? 1 : 0)}
                  count={publications.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </div>
  );
}
