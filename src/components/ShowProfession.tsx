import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import * as React from "react";
import TableHead from "@mui/material/TableHead";

export default function ShowProfession({
  data,
}: {
  data: {
    profession: string;
    dateRange: string;
  }[];
}) {
  const [professions, setProfessions] = React.useState(data);
  const [changed, setChanged] = React.useState(false);
  const [onEdit, setOnEdit] = React.useState(() => {
    if (professions.length > 0) {
      return Object.fromEntries(
        professions.map((prof) => [prof.profession, false]),
      );
    }
    return {};
  });
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    // For demonstration, we'll just remove the first profession from the list
    if (professions.length > 0) {
      const professionToDelete = e.currentTarget.name;
      const updatedProfessions = professions.filter(
        (prof) => prof.profession !== professionToDelete,
      );
      setProfessions(updatedProfessions);
      setChanged(true);
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const professionToEdit = e.currentTarget.name;
    setOnEdit((prev) => ({
      ...prev,
      [professionToEdit]: true,
    }));
    setChanged(true);
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const professionToSave = e.currentTarget.name;
    const inputElementProf = document.querySelector(
      `input[name="${professionToSave}"]`,
    ) as HTMLInputElement | null;
    const inputElementDateRange = document.querySelector(
      `input[name="${professionToSave}date"]`,
    ) as HTMLInputElement | null;
    if (
      inputElementProf &&
      inputElementDateRange &&
      (inputElementProf.value || inputElementDateRange.value)
    ) {
      const updatedProfessions = professions.map((prof) => {
        if (prof.profession === professionToSave) {
          return {
            ...prof,
            profession: inputElementProf.value,
            dateRange: inputElementDateRange.value,
          };
        }
        return prof;
      });
      setProfessions(updatedProfessions);
    }
    setOnEdit((prev) => ({
      ...prev,
      [professionToSave]: false,
    }));
    // In a real application, you would also want to save the changes to a server or database here
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const professionToCancel = e.currentTarget.name;
    setOnEdit((prev) => ({
      ...prev,
      [professionToCancel]: false,
    }));
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="profession table">
        <TableBody>
          <TableRow>
            <TableCell>Profession</TableCell>
            <TableCell align="right">Date Range</TableCell>
            <TableCell align="right">
              <Button
                onClick={() => {
                  if (professions.find((prof) => prof.profession === ""))
                    return;
                  const newProfession = {
                    profession: "",
                    dateRange: "",
                  };
                  setProfessions([newProfession, ...professions]);
                  setOnEdit((prev) => ({
                    ...prev,
                    [newProfession.profession]: true,
                  }));
                }}
              >
                Add
              </Button>
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
          {professions.map((row) => (
            <TableRow
              key={row.profession}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.profession}
                {onEdit[row.profession] && (
                  <input
                    className="border-b-2 focus:outline-none focus:border-blue-500"
                    placeholder="profession"
                    name={row.profession}
                    style={{ display: "block", marginTop: "0.5rem" }}
                    required={true}
                  />
                )}
              </TableCell>
              <TableCell align="right">
                {row.dateRange}
                {onEdit[row.profession] && (
                  <input
                    className="border-b-2 place-self-end placeholder:place-self-end-safe focus:outline-none focus:border-blue-500"
                    placeholder="date range"
                    name={row.profession + "date"}
                    style={{ display: "block", marginTop: "0.5rem" }}
                    required={true}
                  />
                )}
              </TableCell>
              {onEdit[row.profession] && (
                <>
                  <TableCell align="right">
                    <Button onClick={handleSave} name={row.profession}>
                      Save
                    </Button>
                  </TableCell>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleCancel} name={row.profession}>
                      Cancel
                    </Button>
                  </TableCell>
                </>
              )}
              {!onEdit[row.profession] && (
                <>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleEdit} name={row.profession}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleDelete} name={row.profession}>
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
