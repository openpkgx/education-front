"use client";
import React, { ChangeEvent, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
}

const columns: Column[] = [
    { id: 'name', label: '姓名', minWidth: 170 },
    { id: 'id', label: '账号', minWidth: 100 },
    { id: 'role', label: '角色', minWidth: 170 },
    { id: 'phone', label: '联系电话', minWidth: 170 },
    { id: 'email', label: '电子邮箱', minWidth: 170 },
    { id: 'createdAt', label: '注册时间', minWidth: 170 },
];

interface Data {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    createdAt: string;
}

function createData(
    id: string,
    name: string,
    role: string,
    phone: string,
    email: string,
    createdAt: string,
): Data {
    return { id, name, role, phone, email, createdAt };
}

const rows = [
    createData('India', 'IN', "1324171354", "3287263", "em@com", "2025-01-01"),
    createData('China', 'CN', "1403500365", "9596961", "em@com", "2025-01-01"),
    createData('Italy', 'IT', "60483973", "301340", "em@com", "2025-01-01"),
    createData('United States', 'US', "327167434", "9833520", "em@com", "2025-01-01"),
    createData('Canada', 'CA', "37602103", "9984670", "em@com", "2025-01-01"),
    createData('Australia', 'AU', "25475400", "7692024", "em@com", "2025-01-01"),
    createData('Germany', 'DE', "83019200", "357578", "em@com", "2025-01-01"),
    createData('Ireland', 'IE', "4857000", "70273", "em@com", "2025-01-01"),
    createData('Mexico', 'MX', "126577691", "1972550", "em@com", "2025-01-01"),
    createData('Japan', 'JP', "126317000", "377973", "em@com", "2025-01-01"),
    createData('France', 'FR', "67022000", "640679", "em@com", "2025-01-01"),
    createData('United Kingdom', 'GB', "67545757", "242495", "em@com", "2025-01-01"),
    createData('Russia', 'RU', "146793744", "17098246", "em@com", "2025-01-01"),
    createData('Nigeria', 'NG', "200962417", "923768", "em@com", "2025-01-01"),
    createData('Brazil', 'BR', "210147125", "8515767", "em@com", "2025-01-01"),
];

export default function UserTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%' }} elevation={0}>
            <TableContainer sx={{ maxHeight: 640 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.role}</TableCell>
                                        <TableCell>{row.phone}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.createdAt}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
