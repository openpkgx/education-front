// src/components/BookTable/DeleteConfirmDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ open, onClose, onConfirm, title }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>确认删除</DialogTitle>
            <DialogContent>
                确定删除{title}？
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={onConfirm} color="error">删除</Button>
            </DialogActions>
        </Dialog>
    );
};