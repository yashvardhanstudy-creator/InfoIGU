import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

function createData(
    profession: string,
    dateRange: string,
) {
    return { profession, dateRange }
}

const rows = [
    createData('Software Engineer', 'Jan 2020 - Dec 2022'),
    createData('Data Scientist', 'Mar 2019 - Feb 2021'),
    createData('Product Manager', 'Aug 2021 - Present'),
    createData('UI/UX Designer', 'Apr 2018 - Jul 2020'),
    createData('DevOps Engineer', 'Nov 2022 - Present'),
]

export default function BasicTable() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="profession table">
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.profession}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.profession}
                            </TableCell>
                            <TableCell align='right'>{row.dateRange}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}