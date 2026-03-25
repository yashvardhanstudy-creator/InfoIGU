import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import * as React from "react";
import Tooltip from "@mui/material/Tooltip";




export interface ColumnConfig {
    key: string;
    label: string;
    required?: boolean;
}

interface ShowGenericProps {
    id: number;
    endpoint: string;
    columns: ColumnConfig[];
    heading?: string;
    headingId?: string;
    editMode?: boolean;
}

export default function ShowGeneric({ id, endpoint, columns, heading, headingId, editMode }: ShowGenericProps) {
    const [loading, setLoading] = React.useState(!!id);
    const [data, setData] = React.useState<any[]>([]);
    const [onEdit, setOnEdit] = React.useState<{ [key: string]: boolean }>({});
    const hasUrlColumn = columns.some(col => col.key === "url");
    const [showURLColumn, setShowURLColumn] = React.useState(0);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/${endpoint}/${id}`);
                if (!response.ok) throw new Error(`Failed to fetch ${endpoint} data`);
                const fetchedData = await response.json();
                console.log(fetchedData);
                if (fetchedData && fetchedData.length > 0) {
                    setData(fetchedData);
                    setOnEdit(Object.fromEntries(fetchedData.map((item: any) => [item.id.toString(), false])));
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id, endpoint]);


    const handleAdd = () => {
        // Prevent adding if an empty row already exists based on first column
        if (data.find((item) => item[columns[0].key] === "")) return;
        const tempId = `temp_${Date.now()}`;
        const newItem: any = { id: tempId };
        columns.forEach(col => newItem[col.key] = "");
        if (hasUrlColumn) setShowURLColumn((prev) => prev + 1);
        setData([newItem, ...data]);
        setOnEdit((prev) => ({ ...prev, [tempId]: true }));
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (hasUrlColumn) setShowURLColumn((prev) => prev + 1);
        const itemToEdit = e.currentTarget.name;
        setOnEdit((prev) => ({ ...prev, [itemToEdit]: true }));
    };

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const rowToSave = e.currentTarget.name;
        const payload: Record<string, string> = {};

        // Dynamically pull all input values based on configured columns
        for (const col of columns) {
            const input = document.querySelector(`input[name="${col.key}_${rowToSave}"]`) as HTMLInputElement;
            payload[col.key] = input?.value || "";
        }

        if (hasUrlColumn) setShowURLColumn((prev) => prev - 1);

        // Basic validation: Require at least the very first column to be filled
        if (payload[columns[0].key]) {
            try {
                const isNew = rowToSave.startsWith("temp_");
                const endpointUrl = isNew
                    ? `http://localhost:5000/api/${endpoint}/${id}`
                    : `http://localhost:5000/api/${endpoint}/${id}/${rowToSave}`;
                const method = isNew ? "POST" : "PUT";

                const response = await fetch(endpointUrl, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const newItem = await response.json();
                    setData(data.map((item) => (item.id.toString() === rowToSave ? newItem : item)));
                    setOnEdit((prev) => ({ ...prev, [newItem.id.toString()]: false, [rowToSave]: false }));
                    return;
                }
            } catch (error) {
                console.error(`Error saving ${endpoint}:`, error);
            }
        }
        setOnEdit((prev) => ({ ...prev, [rowToSave]: false }));
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rowToCancel = e.currentTarget.name;
        if (hasUrlColumn) setShowURLColumn((prev) => prev - 1);
        if (rowToCancel.startsWith("temp_")) {
            setData(data.filter((item) => item.id.toString() !== rowToCancel));
        }
        setOnEdit((prev) => ({ ...prev, [rowToCancel]: false }));
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const rowToDelete = e.currentTarget.name;
        try {
            const response = await fetch(`http://localhost:5000/api/${endpoint}/${id}/${rowToDelete}`, { method: "DELETE" });
            if (response.ok) setData((prev) => prev.filter((item) => item.id.toString() !== rowToDelete));
        } catch (error) {
            console.error(`Error deleting ${endpoint}:`, error);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;

    if (data.length === 0 && !editMode) return null;

    return (
        <div className="mb-6">
            {heading && <h3 className="text-xl mb-4" id={headingId}>{heading}</h3>}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label={`${endpoint} table`} size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => {
                                if (col.key === "url" && showURLColumn === 0) return null;
                                return <TableCell key={col.key}>{col.label}</TableCell>;
                            })}
                            {editMode && (
                                <TableCell align="right">
                                    <Button onClick={handleAdd}>Add</Button>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => {
                            const rowId = row.id.toString();
                            const isEditing = onEdit[rowId];
                            return (
                                <TableRow key={rowId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    {columns.map((col, index) => {
                                        if (col.key === "url" && showURLColumn === 0) return null;
                                        return (
                                            <TableCell key={col.key} component={index === 0 ? "th" : undefined} scope={index === 0 ? "row" : undefined}>
                                                {isEditing ? (
                                                    <input
                                                        className="border-b-2 focus:outline-none focus:border-blue-500 w-full"
                                                        placeholder={col.label}
                                                        name={`${col.key}_${rowId}`}
                                                        defaultValue={row[col.key] || ""}
                                                        style={{ display: "block", marginTop: "0.5rem" }}
                                                        required={col.required}
                                                    />
                                                ) : index === 0 && hasUrlColumn ? (
                                                    <Tooltip title={row[col.key] || ""} placement="top-start" arrow>
                                                        <div className="max-w-50 truncate">
                                                            {row.url ? (
                                                                <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline">
                                                                    {row[col.key]}
                                                                </a>
                                                            ) : (
                                                                row[col.key]
                                                            )}
                                                        </div>
                                                    </Tooltip>
                                                ) : col.key === "url" ? null : (
                                                    row[col.key]
                                                )}
                                            </TableCell>
                                        );
                                    })}
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

                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    );
}