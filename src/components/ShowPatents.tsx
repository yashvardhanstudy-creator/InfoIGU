import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";

interface Patent {
    id: string | number;
    title: string;
    inventors: string;
    status: string;
    patent_number: string;
    application_number: string;
    url: string;
}

export default function ShowPatents({ id }: { id: number }) {
    const [loading, setLoading] = React.useState(!!id);
    const [patents, setPatents] = React.useState<Patent[]>([]);
    const [onEdit, setOnEdit] = React.useState<{ [key: string]: boolean }>({});
    const [showURLColumn, setShowURLColumn] = React.useState(0);
    // To keep track of status changes during edit
    const [editStatuses, setEditStatuses] = React.useState<{ [key: string]: string }>({});

    React.useEffect(() => {
        const fetchPatents = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/patents/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch patents data");
                }
                const fetchedData = await response.json();
                console.log(fetchedData);
                if (fetchedData && fetchedData.length > 0) {
                    setPatents(fetchedData);
                    setOnEdit(
                        Object.fromEntries(
                            fetchedData.map((pat: Patent) => [pat.id.toString(), false])
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
            fetchPatents();
        }
    }, [id]);

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const patentIdToDelete = e.currentTarget.name;
        try {
            const response = await fetch(
                `http://localhost:5000/api/patents/${id}/${patentIdToDelete}`,
                {
                    method: "DELETE",
                }
            );
            if (response.ok) {
                const updatedPatents = patents.filter(
                    (pat) => pat.id.toString() !== patentIdToDelete
                );
                setPatents(updatedPatents);
            }
        } catch (error) {
            console.error("Error deleting patent:", error);
        }
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>, currentStatus: string) => {
        setShowURLColumn(showURLColumn + 1);
        const patToEdit = e.currentTarget.name;
        setOnEdit((prev) => ({
            ...prev,
            [patToEdit]: true,
        }));
        setEditStatuses((prev) => ({
            ...prev,
            [patToEdit]: currentStatus?.toLowerCase() || "filed",
        }));
    };

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const patToSave = e.currentTarget.name;
        const titleVal = (document.querySelector(`input[name="title_${patToSave}"]`) as HTMLInputElement)?.value || "";
        const inventorsVal = (document.querySelector(`input[name="inventors_${patToSave}"]`) as HTMLInputElement)?.value || "";
        const statusVal = (document.querySelector(`select[name="status_${patToSave}"]`) as HTMLSelectElement)?.value || "filed";
        const appNumVal = (document.querySelector(`input[name="appnum_${patToSave}"]`) as HTMLInputElement)?.value || "";
        const patNumVal = (document.querySelector(`input[name="patnum_${patToSave}"]`) as HTMLInputElement)?.value || "";
        const urlVal = (document.querySelector(`input[name="url_${patToSave}"]`) as HTMLInputElement)?.value || "";
        setShowURLColumn(showURLColumn - 1);

        if (titleVal) {
            try {
                if (!patToSave.startsWith("temp_")) {
                    await fetch(`http://localhost:5000/api/patents/${id}/${patToSave}`, {
                        method: "DELETE",
                    });
                }

                const response = await fetch(`http://localhost:5000/api/patents/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: titleVal,
                        inventors: inventorsVal,
                        status: statusVal,
                        application_number: appNumVal,
                        patent_number: patNumVal,
                        url: urlVal,
                    }),
                });

                if (response.ok) {
                    const newPatent = await response.json();
                    const updatedPatents = patents.map((pat) => {
                        if (pat.id.toString() === patToSave) {
                            return newPatent;
                        }
                        return pat;
                    });
                    setPatents(updatedPatents);
                    setOnEdit((prev) => ({
                        ...prev,
                        [newPatent.id.toString()]: false,
                        [patToSave]: false,
                    }));
                    return;
                }
            } catch (error) {
                console.error("Error saving patent:", error);
            }
        }
        setOnEdit((prev) => ({ ...prev, [patToSave]: false }));
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowURLColumn(showURLColumn - 1);
        const patToCancel = e.currentTarget.name;
        if (patToCancel.startsWith("temp_")) {
            setPatents(patents.filter((p) => p.id.toString() !== patToCancel));
        }
        setOnEdit((prev) => ({ ...prev, [patToCancel]: false }));
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

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="patents table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Inventors</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>App / Patent Number</TableCell>
                        {showURLColumn > 0 ? <TableCell>URL</TableCell> : null}
                        <TableCell align="right">
                            <Button
                                onClick={() => {
                                    if (patents.find((p) => p.title === "")) return;
                                    const tempId = `temp_${Date.now()}`;
                                    const newPatent: Patent = {
                                        id: tempId,
                                        title: "",
                                        inventors: "",
                                        status: "filed",
                                        patent_number: "",
                                        application_number: "",
                                        url: "",
                                    };
                                    setShowURLColumn(showURLColumn + 1);
                                    setPatents([newPatent, ...patents]);
                                    setOnEdit((prev) => ({ ...prev, [tempId]: true }));
                                    setEditStatuses((prev) => ({ ...prev, [tempId]: "filed" }));
                                }}
                            >
                                Add
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patents.map((row) => {
                        const rowId = row.id.toString();
                        const isEditing = onEdit[rowId];
                        const currentStatus = isEditing ? editStatuses[rowId] : row.status?.toLowerCase();

                        const showApplicationNumber = currentStatus === 'filed' || currentStatus === 'filled' || currentStatus === 'published';
                        const showPatentNumber = currentStatus === 'granted' || currentStatus === 'expired';

                        return (
                            <TableRow key={rowId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
                                    {isEditing ? renderInput(`inventors_${rowId}`, "Inventors", row.inventors) : row.inventors}
                                </TableCell>
                                <TableCell>
                                    {isEditing ? (
                                        <select
                                            name={`status_${rowId}`}
                                            value={currentStatus}
                                            onChange={(e) => setEditStatuses(prev => ({ ...prev, [rowId]: e.target.value }))}
                                            className="border-b-2 focus:outline-none focus:border-blue-500 w-full mt-2 bg-transparent"
                                        >
                                            <option value="Filed">Filed</option>
                                            <option value="Published">Published</option>
                                            <option value="Granted">Granted</option>
                                            <option value="Expired">Expired</option>
                                        </select>
                                    ) : (
                                        <span className="capitalize">{row.status}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {isEditing ? (
                                        <>
                                            {renderInput(`appnum_${rowId}`, "Application Number", row.application_number)}
                                            {renderInput(`patnum_${rowId}`, "Patent Number", row.patent_number)}
                                        </>
                                    ) : (
                                        <>
                                            {showApplicationNumber && (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 font-semibold uppercase">Application Number</span>
                                                    <span>{row.application_number || "N/A"}</span>
                                                </div>
                                            )}
                                            {showPatentNumber && (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 font-semibold uppercase">Patent Number</span>
                                                    <span>{row.patent_number || "N/A"}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </TableCell>
                                {showURLColumn > 0 && (
                                    <TableCell>
                                        {isEditing ? renderInput(`url_${rowId}`, "URL", row.url) : null}
                                    </TableCell>
                                )}
                                <TableCell align="right">
                                    {isEditing ? (
                                        <div className="flex justify-end min-w-max">
                                            <Button onClick={handleSave} name={rowId}>Save</Button>
                                            <Button onClick={handleCancel} name={rowId}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end min-w-max">
                                            <Button onClick={(e) => handleEdit(e, row.status)} name={rowId}>Edit</Button>
                                            <Button onClick={handleDelete} name={rowId}>Delete</Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}