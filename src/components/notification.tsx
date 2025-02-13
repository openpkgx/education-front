"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SuccessOutlined from '@mui/icons-material/CheckCircleOutline';
import ErrorOutline from '@mui/icons-material/ErrorOutline';

// 通知类型
type Severity = 'success' | 'error' | 'warning' | 'info';

interface NotificationContextType {
    showNotification: (message: string, severity?: Severity) => void;
}

// 创建 Notification 上下文
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// NotificationProvider 组件，用来提供通知功能
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<Severity>('success');

    const showNotification = (msg: string, type: Severity = 'success') => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    const hideNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={hideNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={hideNotification}
                    severity={severity}
                    variant="filled"
                    iconMapping={{
                        success: <SuccessOutlined fontSize="inherit" />,
                        error: <ErrorOutline fontSize="inherit" />
                    }}
                    sx={{
                        alignItems: 'center',
                        '.MuiAlert-message': { padding: '8px 0' }
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

// 使用 Notification 上下文提供的 showNotification 方法
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// 通知组件 - 通过 NotificationProvider 管理通知显示
const Notification: React.FC = () => {
    return null; // 通知组件本身不需要做任何事情，它由 NotificationProvider 管理
};

export default Notification;
