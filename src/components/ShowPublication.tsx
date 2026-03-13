import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import * as React from "react";

export default function ShowPublication({
  data,
}: {
  data: {
    Publication: string;
  }[];
}) {
  const [publications, setPublications] = React.useState(data);
  const [onEdit, setOnEdit] = React.useState<{ [key: string]: boolean }>(() =>
    Object.fromEntries(data.map((pub) => [pub.Publication, false]))
  );

  const handleAdd = () => {
    if (publications.find((pub) => pub.Publication === "")) return;
    const newPub = { Publication: "" };
    setPublications([newPub, ...publications]);
    setOnEdit((prev) => ({ ...prev, [newPub.Publication]: true }));
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pubToEdit = e.currentTarget.name;
    setOnEdit((prev) => ({ ...prev, [pubToEdit]: true }));
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pubToSave = e.currentTarget.name;
    const inputElement = document.querySelector(
      `input[name="${pubToSave}"]`
    ) as HTMLInputElement | null;
    if (inputElement && inputElement.value) {
      const updated = publications.map((pub) =>
        pub.Publication === pubToSave
          ? { ...pub, Publication: inputElement.value }
          : pub
      );
      setPublications(updated);
      setOnEdit((prev) => ({
        ...prev,
        [pubToSave]: false,
        [inputElement.value]: false,
      }));
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pubToCancel = e.currentTarget.name;
    // If it's a new row (empty string), remove it
    if (pubToCancel === "") {
      setPublications((prev) => prev.filter((pub) => pub.Publication !== ""));
      setOnEdit((prev) => {
        const copy = { ...prev };
        delete copy[pubToCancel];
        return copy;
      });
    } else {
      setOnEdit((prev) => ({ ...prev, [pubToCancel]: false }));
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pubToDelete = e.currentTarget.name;
    setPublications((prev) =>
      prev.filter((pub) => pub.Publication !== pubToDelete)
    );
    setOnEdit((prev) => {
      const copy = { ...prev };
      delete copy[pubToDelete];
      return copy;
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="publication table">
        <TableBody>
          <TableRow>
            <TableCell>Publication</TableCell>
            <TableCell align="right">
              <Button onClick={handleAdd}>Add</Button>
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
          {publications.map((row) => (
            <TableRow
              key={row.Publication}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {onEdit[row.Publication] ? (
                  <input
                    className="border-b-2 focus:outline-none focus:border-blue-500"
                    placeholder="Publication"
                    name={row.Publication}
                    defaultValue={row.Publication}
                    style={{ display: "block", marginTop: "0.5rem" }}
                    required={true}
                  />
                ) : (
                  row.Publication
                )}
              </TableCell>
              {onEdit[row.Publication] ? (
                <>
                  <TableCell align="right">
                    <Button onClick={handleSave} name={row.Publication}>
                      Save
                    </Button>
                  </TableCell>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleCancel} name={row.Publication}>
                      Cancel
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleEdit} name={row.Publication}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleDelete} name={row.Publication}>
                      Delete
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
