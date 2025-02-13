import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface TextFieldWithIconProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showPassword?: boolean;
    togglePasswordVisibility?: () => void;
}

export const TextFieldWithIcon: React.FC<TextFieldWithIconProps> = ({
    label,
    type,
    value,
    onChange,
    showPassword,
    togglePasswordVisibility,
}) => {
    // 如果 type 是 password，并且提供了 togglePasswordVisibility，则显示图标按钮
    // const shouldShowIcon = type === 'password' && togglePasswordVisibility;
    const shouldShowIcon = true
    return (
        <TextField
            label={label}
            variant="outlined"
            type={type}
            fullWidth
            value={value}
            onChange={onChange}
            slotProps={{
                input: {
                    endAdornment: shouldShowIcon && (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
            sx={{ borderRadius: '12px' }}
        />
    );
};