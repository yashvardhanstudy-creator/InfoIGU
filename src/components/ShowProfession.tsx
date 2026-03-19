import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import * as React from "react";
import { professionData } from './constants';


export default function ShowProfession({
  name, id
}: {
  name: string,
  id: number;
}) {
  const [loading, setLoading] = React.useState(!!name);
  console.log(name);
  const [professions, setProfessions] = React.useState(professionData);
  const [onEdit, setOnEdit] = React.useState(() => {
    if (professions.length > 0) {
      return Object.fromEntries(
        professions.map((prof) => [prof.head, false]),
      );
    }
    return {};
  });

  React.useEffect(() => {
    const fetchEducation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/education/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch education data');
        }
        const fetchedData = await response.json();
        console.log(fetchedData);
        setProfessions(fetchedData);
        if (fetchedData && fetchedData.length > 0) {
          setProfessions(fetchedData);
          setOnEdit(
            Object.fromEntries(fetchedData.map((prof: any) => [prof.head, false]))
          );
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchEducation();
    }
  }, [name]);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const professionToDelete = e.currentTarget.name;
    try {
      const response = await fetch(`http://localhost:5000/api/education/${id}/${professionToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedProfessions = professions.filter(
          (prof) => prof.head !== professionToDelete,
        );
        setProfessions(updatedProfessions);
      }
    } catch (error) {
      console.error("Error deleting profession:", error);
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const professionToEdit = e.currentTarget.name;
    setOnEdit((prev) => ({
      ...prev,
      [professionToEdit]: true,
    }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      try {
        const response = await fetch(`http://localhost:5000/api/education/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            head: inputElementProf.value,
            date_range: inputElementDateRange.value,
          }),
        });

        if (response.ok) {
          const newProfession = await response.json();
          const updatedProfessions = professions.map((prof) => {
            if (prof.head === professionToSave) {
              return { ...prof, id: newProfession.id, head: newProfession.head, date_range: newProfession.date_range };
            }
            return prof;
          });
          setProfessions(updatedProfessions);
        }
      } catch (error) {
        console.error("Error saving profession:", error);
      }
    }
    setOnEdit((prev) => ({
      ...prev,
      [professionToSave]: false,
    }));
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const professionToCancel = e.currentTarget.name;
    setOnEdit((prev) => ({
      ...prev,
      [professionToCancel]: false,
    }));
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

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
                  if (professions.find((prof) => prof.head === ""))
                    return;
                  const newProfession = {
                    id: professions.length + 1,
                    head: "",
                    date_range: "",
                  };
                  setProfessions([newProfession, ...professions]);
                  setOnEdit((prev) => ({
                    ...prev,
                    [newProfession.head]: true,
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
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.head}
                {onEdit[row.head] && (
                  <input
                    className="border-b-2 focus:outline-none focus:border-blue-500"
                    placeholder="profession"
                    name={row.head}
                    style={{ display: "block", marginTop: "0.5rem" }}
                    required={true}
                  />
                )}
              </TableCell>
              <TableCell align="right">
                {row.date_range}
                {onEdit[row.head] && (
                  <input
                    className="border-b-2 place-self-end placeholder:place-self-end-safe focus:outline-none focus:border-blue-500"
                    placeholder="date range"
                    name={row.head + "date"}
                    style={{ display: "block", marginTop: "0.5rem" }}
                    required={true}
                  />
                )}
              </TableCell>
              {onEdit[row.head] && (
                <>
                  <TableCell align="right">
                    <Button onClick={handleSave} name={row.head}>
                      Save
                    </Button>
                  </TableCell>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleCancel} name={row.head}>
                      Cancel
                    </Button>
                  </TableCell>
                </>
              )}
              {!onEdit[row.head] && (
                <>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleEdit} name={row.head}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="right" width={"2px"}>
                    <Button onClick={handleDelete} name={row.head}>
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
