"use client";
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BookRow } from './book-row';
import { BookFormDialog } from './book-form-dialog';
import { DeleteConfirmDialog } from './delete-confirm-dialog';
import { useSubjects } from '@/hook/use-subject';
import { Subject } from '@/api/dto';

export const BookTable: React.FC = () => {
    const { rows, addSubjectState, updateSubjectState, deleteSubjectState, reloadSubject } = useSubjects();
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [currentBook, setCurrentBook] = useState<Subject | null>(null);
    const [bookToDelete, setBookToDelete] = useState<Subject | null>(null);

    const handleOpenEdit = (subject: Subject) => {
        console.log(`handleOpenEdit: ${JSON.stringify(subject)}`)
        setCurrentBook(subject);
        setOpenEdit(true);
    };

    const handleOpenDeleteConfirm = (book: Subject) => {
        setBookToDelete(book);
        setOpenDeleteConfirm(true);
    };

    const handleDeleteBook = () => {
        if (bookToDelete) {
            deleteSubjectState(bookToDelete.id ?? "");
            setOpenDeleteConfirm(false);
        }
    };
    // 在组件挂载时调用 reloadSubject
    useEffect(() => {
        reloadSubject();
    }, []); // 空依赖数组确保只在挂载时执行一次
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                    setCurrentBook(null)
                    setOpenAdd(true)
                }}>
                    添加书籍
                </Button>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650, border: 'none' }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>科目</TableCell>
                            <TableCell sx={{ border: 'none', fontWeight: 'bold' }} align="left">题目类别</TableCell>
                            <TableCell sx={{ border: 'none', fontWeight: 'bold' }} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <BookRow
                                key={row.name}
                                row={row}
                                onEdit={handleOpenEdit}
                                onDelete={handleOpenDeleteConfirm}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <BookFormDialog
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSubmit={addSubjectState}
            />
            {currentBook && (
                <BookFormDialog
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    onSubmit={updateSubjectState}
                    subject={currentBook}
                />
            )}
            {bookToDelete && (
                <DeleteConfirmDialog
                    open={openDeleteConfirm}
                    onClose={() => setOpenDeleteConfirm(false)}
                    onConfirm={handleDeleteBook}
                    bookName={bookToDelete.name}
                />
            )}
        </>
    );
};