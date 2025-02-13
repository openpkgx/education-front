// src/components/BookTable/BookFormDialog.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Subject } from '@/api/dto';

interface BookFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (book: Subject) => void;
    subject?: Subject;
}

export const BookFormDialog: React.FC<BookFormDialogProps> = ({ open, onClose, onSubmit, subject }) => {
    const [book, setBook] = useState<Subject>(subject ?? { name: '', cover: '', questionTypes: [], description: "", createdAt: 0, updatedAt: 0 });
    const [newQuestionType, setNewQuestionType] = useState('');
    const handleAddQuestionType = () => {
        if (newQuestionType.trim()) {
            setBook({ ...book, questionTypes: [...book.questionTypes, newQuestionType.trim()] });
            setNewQuestionType('');
        }
    };

    const handleDeleteQuestionType = (index: number) => {
        setBook({ ...book, questionTypes: book.questionTypes.filter((_, i) => i !== index) });
    };

    const handleSubmit = () => {
        if (book.name.trim() && book.cover?.trim() && book.questionTypes.length > 0) {
            onSubmit(book);
            onClose();
        }
    };
    // 使用 useEffect 监听 subject 的变化
    useEffect(() => {
        if (subject) {
            setBook(subject);
        } else {
            setBook({ name: '', cover: '', questionTypes: [], description: "", createdAt: 0, updatedAt: 0 });
        }
    }, [subject]);
    console.log(`BookFormDialog: ${JSON.stringify(subject)}`)
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{subject ? '编辑书籍' : '添加书籍'}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="书籍名称"
                        value={book.name}
                        onChange={(e) => setBook({ ...book, name: e.target.value })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="封面 URL"
                        value={book.cover}
                        onChange={() => setBook({ ...book, cover: "/static/images/book-cover-1.jpg" })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Grid container spacing={2}>
                        {book.questionTypes.map((type, index) => (
                            <Grid item xs={6} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        border: '1px solid #ddd',
                                        borderRadius: 1,
                                        p: 1,
                                    }}
                                >
                                    <Chip label={type} />
                                    <IconButton onClick={() => handleDeleteQuestionType(index)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <TextField
                            label="新增题目类别"
                            value={newQuestionType}
                            onChange={(e) => setNewQuestionType(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleAddQuestionType}>
                            添加
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="primary">保存</Button>
            </DialogActions>
        </Dialog>
    );
};