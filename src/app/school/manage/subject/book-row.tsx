// src/components/BookTable/BookRow.tsx
import React from 'react';
import { TableRow, TableCell, Card, CardMedia, Button, Stack, Chip } from '@mui/material';
import { Subject } from '@/api/dto';

interface BookRowProps {
    row: Subject;
    onEdit: (book: Subject) => void;
    onDelete: (book: Subject) => void;
}

export const BookRow: React.FC<BookRowProps> = ({ row, onEdit, onDelete }) => {
    return (
        <TableRow
            sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transition: 'background-color 0.3s ease',
                },
            }}
        >
            <TableCell sx={{ border: 'none' }} component="th" scope="row">
                <Card className="relative w-24 aspect-[3/4] overflow-hidden">
                    <CardMedia
                        className="absolute w-full h-full object-fill"
                        component="img"
                        alt="Card Image"
                        height="100%"
                        image={row.cover}
                    />
                    <div className='absolute inset-0 flex items-center justify-center text-blue-700 p-2'>
                        <span className="text-center block select-none">
                            {row.name}
                        </span>
                    </div>
                </Card>
            </TableCell>
            <TableCell sx={{ border: 'none' }} align="center">
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {row.questionTypes.map((type, index) => (
                        <Chip
                            key={index}
                            label={type}
                            sx={{
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                border: '1px solid #90caf9',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: '#bbdefb',
                                },
                            }}
                        />
                    ))}
                </Stack>
            </TableCell>
            <TableCell sx={{ border: 'none' }} align="center">
                <Button variant="outlined" size="small" onClick={() => onEdit(row)}>
                    查看详情
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ marginLeft: 1 }}
                    color="error"
                    onClick={() => onDelete(row)}
                >
                    删除
                </Button>
            </TableCell>
        </TableRow>
    );
};