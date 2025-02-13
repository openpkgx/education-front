// src/components/BookTable/DeleteConfirmDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bookName: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ open, onClose, onConfirm, bookName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>确认删除</DialogTitle>
            <DialogContent>
                确定要删除书籍“{bookName}”吗？
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={onConfirm} color="error">删除</Button>
            </DialogActions>
        </Dialog>
    );
};