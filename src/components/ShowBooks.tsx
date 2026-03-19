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

interface Book {
    id: string | number;
    title: string;
    isbn: string;
    publish_date: string;
    edition: string;
    authors: string;
    url: string;
}

export default function ShowBooks({ id }: { id: number }) {
    const [loading, setLoading] = React.useState(!!id);
    const [books, setBooks] = React.useState<Book[]>([]);
    const [onEdit, setOnEdit] = React.useState<{ [key: string]: boolean }>({});
    const [showURLColumn, setShowURLColumn] = React.useState(0);

    React.useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/books/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch books data");
                }
                const fetchedData = await response.json();
                if (fetchedData && fetchedData.length > 0) {
                    setBooks(fetchedData);
                    setOnEdit(
                        Object.fromEntries(
                            fetchedData.map((book: Book) => [book.id.toString(), false])
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
            fetchBooks();
        }
    }, [id]);

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const bookIdToDelete = e.currentTarget.name;
        try {
            const response = await fetch(
                `http://localhost:5000/api/books/${id}/${bookIdToDelete}`,
                {
                    method: "DELETE",
                }
            );
            if (response.ok) {
                const updatedBooks = books.filter(
                    (book) => book.id.toString() !== bookIdToDelete
                );
                setBooks(updatedBooks);
            }
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowURLColumn(showURLColumn + 1);
        const bookToEdit = e.currentTarget.name;
        setOnEdit((prev) => ({
            ...prev,
            [bookToEdit]: true,
        }));
    };

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const bookToSave = e.currentTarget.name;
        const titleVal = (document.querySelector(`input[name="title_${bookToSave}"]`) as HTMLInputElement)?.value || "";
        const isbnVal = (document.querySelector(`input[name="isbn_${bookToSave}"]`) as HTMLInputElement)?.value || "";
        const dateVal = (document.querySelector(`input[name="publish_date_${bookToSave}"]`) as HTMLInputElement)?.value || "";
        const editionVal = (document.querySelector(`input[name="edition_${bookToSave}"]`) as HTMLInputElement)?.value || "";
        const authorsVal = (document.querySelector(`input[name="authors_${bookToSave}"]`) as HTMLInputElement)?.value || "";
        const urlVal = (document.querySelector(`input[name="url_${bookToSave}"]`) as HTMLInputElement)?.value || "";
        setShowURLColumn(showURLColumn - 1);

        if (titleVal) {
            try {
                // Emulate an UPDATE by deleting the old record if it exists
                if (!bookToSave.startsWith("temp_")) {
                    await fetch(`http://localhost:5000/api/books/${id}/${bookToSave}`, {
                        method: "DELETE",
                    });
                }

                const response = await fetch(`http://localhost:5000/api/books/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: titleVal,
                        isbn: isbnVal,
                        publish_date: dateVal,
                        edition: editionVal,
                        authors: authorsVal,
                        url: urlVal,
                    }),
                });

                if (response.ok) {
                    const newBook = await response.json();
                    const updatedBooks = books.map((book) => {
                        if (book.id.toString() === bookToSave) {
                            return newBook;
                        }
                        return book;
                    });
                    setBooks(updatedBooks);
                    setOnEdit((prev) => ({
                        ...prev,
                        [newBook.id.toString()]: false,
                        [bookToSave]: false,
                    }));
                    return;
                }
            } catch (error) {
                console.error("Error saving book:", error);
            }
        }
        setOnEdit((prev) => ({
            ...prev,
            [bookToSave]: false,
        }));
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowURLColumn(showURLColumn - 1);
        const bookToCancel = e.currentTarget.name;
        if (bookToCancel.startsWith("temp_")) {
            setBooks(books.filter((b) => b.id.toString() !== bookToCancel));
        }
        setOnEdit((prev) => ({
            ...prev,
            [bookToCancel]: false,
        }));
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
            <Table sx={{ minWidth: 650 }} aria-label="books table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>ISBN</TableCell>
                        <TableCell>Authors</TableCell>
                        <TableCell>Publish Date</TableCell>
                        <TableCell>Edition</TableCell>
                        {showURLColumn ? <TableCell>URL</TableCell> : null}
                        <TableCell align="right">
                            <Button
                                onClick={() => {
                                    if (books.find((b) => b.title === "")) return;
                                    const tempId = `temp_${Date.now()}`;
                                    const newBook: Book = {
                                        id: tempId,
                                        title: "",
                                        isbn: "",
                                        publish_date: "",
                                        edition: "",
                                        authors: "",
                                        url: "",
                                    };
                                    setShowURLColumn(showURLColumn + 1);
                                    setBooks([newBook, ...books]);
                                    setOnEdit((prev) => ({ ...prev, [tempId]: true }));
                                }}
                            >
                                Add
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {books.map((row) => {
                        const rowId = row.id.toString();
                        const isEditing = onEdit[rowId];
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
                                    {isEditing ? renderInput(`isbn_${rowId}`, "ISBN", row.isbn) : row.isbn}
                                </TableCell>
                                <TableCell>
                                    {isEditing ? renderInput(`authors_${rowId}`, "Authors", row.authors) : row.authors}
                                </TableCell>
                                <TableCell>
                                    {isEditing ? renderInput(`publish_date_${rowId}`, "Publish Date", row.publish_date) : row.publish_date}
                                </TableCell>
                                <TableCell>
                                    {isEditing ? renderInput(`edition_${rowId}`, "Edition", row.edition) : row.edition}
                                </TableCell>
                                {isEditing && (
                                    <TableCell>
                                        {isEditing ? renderInput(`url_${rowId}`, "URL", row.url) : row.url}
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
                                            <Button onClick={handleEdit} name={rowId}>Edit</Button>
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