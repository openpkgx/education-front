// src/hooks/useBooks.ts
import { useState } from 'react';
import { Subject } from '@/api/dto';

export const useBooks = () => {
    const [rows, setRows] = useState<Subject[]>([]);

    const addBook = (book: Subject) => {
        setRows([...rows, book]);
    };

    const updateBook = (updatedBook: Subject) => {
        setRows(rows.map(row => (row.name === updatedBook.name ? updatedBook : row)));
    };

    const deleteBook = (bookName: string) => {
        setRows(rows.filter(row => row.name !== bookName));
    };

    return { rows, addBook, updateBook, deleteBook };
};