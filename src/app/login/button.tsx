import React from 'react';
import { Button, CircularProgress } from '@mui/material';

interface CustomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    children,
    onClick,
    type = 'button',
    fullWidth = true,
    disabled = false,
    loading = false,
}) => (
    <Button
        type={type}
        variant="contained"
        fullWidth={fullWidth}
        onClick={onClick}
        disabled={disabled || loading}
        endIcon={loading ? <CircularProgress size={20} /> : null} // 加载时显示旋转图标
        sx={{
            bgcolor: 'primary.main',
            borderRadius: '12px',
            py: 1.5,
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
                bgcolor: 'primary.dark',
            },
        }}
    >
        {children}
    </Button>
);