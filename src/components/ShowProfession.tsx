import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import * as React from "react";
import * as constants from "./constants";


export default function ShowProfession({
  name, id, type, heading, headingId, editMode
}: {
  name: string,
  id: number,
  type: string;
  heading?: string;
  headingId?: string;
  editMode: boolean;
}) {
  const [loading, setLoading] = React.useState(!!name);
  const [professions, setProfessions] = React.useState<any[]>([]);
  const [onEdit, setOnEdit] = React.useState<{ [key: string]: boolean }>({});

  React.useEffect(() => {
    const fetchEducation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${constants.SERVER_URL}api/education/${id}/${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch education data');
        }
        const fetchedData = await response.json();
        if (fetchedData && fetchedData.length > 0) {
          setProfessions(fetchedData);
          setOnEdit(
            Object.fromEntries(fetchedData.map((prof: any) => [prof.id.toString(), false]))
          );
        } else {
          setProfessions([]);
          setOnEdit({});
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEducation();
    }
  }, [id, type]);

  const handleAdd = () => {
    if (professions.some((prof) => prof.id.toString().startsWith("temp_"))) return;
    const tempId = `temp_${Date.now()}`;
    const newProfession = {
      id: tempId,
      head: "",
      date_range: "",
      type: type
    };
    setProfessions([newProfession, ...professions]);
    setOnEdit((prev) => ({
      ...prev,
      [tempId]: true,
    }));
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const idToDelete = e.currentTarget.name;
    try {
      const response = await fetch(`${constants.SERVER_URL}api/education/${id}/${idToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProfessions(professions.filter((prof) => prof.id.toString() !== idToDelete));
      }
    } catch (error) {
      console.error("Error deleting profession:", error);
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idToEdit = e.currentTarget.name;
    setOnEdit((prev) => ({
      ...prev,
      [idToEdit]: true,
    }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const idToSave = e.currentTarget.name;
    const inputElementProf = document.querySelector(
      `input[name="head_${idToSave}"]`,
    ) as HTMLInputElement | null;
    const inputElementDateRange = document.querySelector(
      `input[name="date_range_${idToSave}"]`,
    ) as HTMLInputElement | null;

    const headValue = inputElementProf?.value || "";
    const dateRangeValue = inputElementDateRange?.value || "";

    if (headValue || dateRangeValue) {
      try {
        const isNew = idToSave.startsWith("temp_");
        const endpointUrl = isNew
          ? `${constants.SERVER_URL}api/education/${id}`
          : `${constants.SERVER_URL}api/education/${id}/${idToSave}`;
        const method = isNew ? "POST" : "PUT";

        const response = await fetch(endpointUrl, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            head: headValue,
            date_range: dateRangeValue,
            type: type
          }),
        });

        if (response.ok) {
          const newProfession = await response.json();
          setProfessions(professions.map((prof) =>
            prof.id.toString() === idToSave ? newProfession : prof
          ));
          setOnEdit((prev) => ({ ...prev, [newProfession.id.toString()]: false, [idToSave]: false }));
          return;
        }
      } catch (error) {
        console.error("Error saving profession:", error);
      }
    }
    setOnEdit((prev) => ({
      ...prev,
      [idToSave]: false,
    }));
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idToCancel = e.currentTarget.name;
    if (idToCancel.startsWith("temp_")) {
      setProfessions(professions.filter((p) => p.id.toString() !== idToCancel));
    }
    setOnEdit((prev) => ({
      ...prev,
      [idToCancel]: false,
    }));
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (professions.length === 0 && !editMode) {
    return null;
  }

  return (
    <div className="mb-6">
      {heading && <h3 className="text-xl mb-4" id={headingId}>{heading}</h3>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="profession table">
          <TableBody>
            <TableRow>
              <TableCell>{type === 'education' ? 'Education' : 'Profession'}</TableCell>
              <TableCell align="right">Date Range</TableCell>
              {editMode && (
                <>
                  <TableCell align="right">
                    <Button
                      onClick={handleAdd}
                    >
                      Add
                    </Button>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </>
              )}
            </TableRow>
            {professions.map((row) => {
              const rowId = row.id.toString();
              const isEditing = onEdit[rowId];
              return (
                <TableRow
                  key={rowId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {isEditing ? (
                      <input
                        className="border-b-2 focus:outline-none focus:border-blue-500 w-full"
                        placeholder={type === 'education' ? 'Education' : 'Profession'}
                        name={`head_${rowId}`}
                        defaultValue={row.head}
                        required={true}
                      />
                    ) : row.head}
                  </TableCell>
                  <TableCell align="right">
                    {isEditing ? (
                      <input
                        className="border-b-2 focus:outline-none focus:border-blue-500 w-full text-right"
                        placeholder="Date Range"
                        name={`date_range_${rowId}`}
                        defaultValue={row.date_range}
                      />
                    ) : row.date_range}
                  </TableCell>
                  {editMode && (
                    isEditing ? (
                      <>
                        <TableCell align="right">
                          <Button onClick={handleSave} name={rowId}>
                            Save
                          </Button>
                        </TableCell>
                        <TableCell align="right" width={"2px"}>
                          <Button onClick={handleCancel} name={rowId}>
                            Cancel
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell align="right" width={"2px"}>
                          <Button onClick={handleEdit} name={rowId}>
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell align="right" width={"2px"}>
                          <Button onClick={handleDelete} name={rowId}>
                            Delete
                          </Button>
                        </TableCell>
                      </>
                    )
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
