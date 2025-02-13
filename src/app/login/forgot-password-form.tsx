import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid2 } from '@mui/material';
import { CustomButton } from './button';
import { TextFieldWithIcon } from './text-field-with-icon';
import { resetPassword, sendVerificationCode } from '@/api/user-api';
import { useNotification } from '@/components/notification';
import { isEmail } from '@/components/utils';

interface ForgotPasswordFormProps {
    setIsForgotPassword: (value: boolean) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ setIsForgotPassword }) => {
    const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
    const [resetData, setResetData] = useState({
        emailOrPhone: '',
        newPassword: '',
        verificationCode: '',
    });
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [passwordError, setPasswordError] = useState('');
    const { showNotification } = useNotification();
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSendVerificationCode = async () => {
        if (!isEmail(resetData.emailOrPhone)) {
            setEmailError('请输入有效的邮箱地址');
        } else {
            setEmailError('');
        }
        try {
            let response = await sendVerificationCode("", resetData.emailOrPhone)
            if (response.code == 200) {
                console.log('Verification code sent successfully');
                setIsCodeSent(true);
                let intervalId = setInterval(() => {
                    setSecondsLeft((prevSeconds) => {
                        if (prevSeconds <= 1) {
                            clearInterval(intervalId);
                            setIsCodeSent(false);
                            return 60
                        }
                        return prevSeconds - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send verification code. Please try again.');
        }
    };

    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetData.emailOrPhone) {
            setPasswordError('请输入邮箱或电话号码');
            return;
        }
        if (!resetData.verificationCode) {
            setPasswordError('请输入验证码');
            return;
        }
        if (!validatePassword(resetData.newPassword)) {
            setPasswordError('新密码必须至少包含8个字符，包括字母和数字');
            return;
        }
        setPasswordError('');
        resetPassword(resetData.newPassword, resetData.emailOrPhone, resetData.verificationCode).then((respone) => {
            if (respone.code === 200) {
                showNotification("重置成功", 'success')
            } else {
                showNotification(`重置失败, ${respone.message}`, 'error')
            }
        })
    };

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    return (
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <FormControl variant="outlined" fullWidth>
                <InputLabel>重置方式</InputLabel>
                <Select
                    label="重置方式"
                    value={resetMethod}
                    onChange={(e) => setResetMethod(e.target.value as 'email' | 'phone')}
                    sx={{ borderRadius: '12px' }}
                >
                    <MenuItem value="email">邮箱</MenuItem>
                    <MenuItem value="phone" disabled>电话</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label={resetMethod === 'email' ? '邮箱地址' : '电话号码'}
                variant="outlined"
                fullWidth
                error={!!emailError}
                helperText={emailError}
                value={resetData.emailOrPhone}
                disabled={isCodeSent}
                onChange={(e) => setResetData({ ...resetData, emailOrPhone: e.target.value })}
                sx={{ borderRadius: '12px' }}
            />
            <Grid2 container spacing={2}>
                <Grid2>
                    <TextField
                        label="验证码"
                        variant="outlined"
                        fullWidth
                        value={resetData.verificationCode}
                        onChange={(e) => setResetData({ ...resetData, verificationCode: e.target.value })}
                        sx={{ borderRadius: '12px' }}
                    />
                </Grid2>
                <Grid2>
                    <CustomButton onClick={handleSendVerificationCode} disabled={isCodeSent}>
                        {isCodeSent ? `重新发送(${secondsLeft}s)` : '发送验证码'}
                    </CustomButton>
                </Grid2>
            </Grid2>
            <TextFieldWithIcon
                label="新密码"
                type={showPassword ? 'text' : 'password'}
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                showPassword={showPassword}
                togglePasswordVisibility={() => setShowPassword(!showPassword)}
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <CustomButton type="submit">重置密码</CustomButton>
            <div className="mt-4 text-center">
                <button
                    onClick={() => setIsForgotPassword(false)}
                    className="text-blue-500 hover:text-blue-400 focus:outline-none font-medium"
                >
                    返回登录
                </button>
            </div>
        </form>
    );
};