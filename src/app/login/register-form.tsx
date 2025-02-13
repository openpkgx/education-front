import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid2 } from '@mui/material';
import { CustomButton } from './button';
import { TextFieldWithIcon } from './text-field-with-icon';
import { Gender, register, sendVerificationCode } from '@/api/user-api';
import { isEmail, isPhoneNumber } from '@/components/utils';
import { useNotification } from '@/components/notification';

// 定义一些常见的国际区号，包括香港、澳门和台湾
const countryCodes = [
    { label: '中国 (+86)', value: '+86' },
    { label: '香港 (+852)', value: '+852' },
    { label: '澳门 (+853)', value: '+853' },
    { label: '台湾 (+886)', value: '+886' },
    { label: '美国 (+1)', value: '+1' },
    { label: '英国 (+44)', value: '+44' },
    { label: '加拿大 (+1)', value: '+1' },
    { label: '澳大利亚 (+61)', value: '+61' },
];

interface RegisterFormProps {
    toggleForm: () => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    gender: Gender;  // 这里限定 gender 为 "male" | "female" | "other"
    countryCode: string;
    verificationCode: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        gender: 'male',
        countryCode: '+86',
        verificationCode: '',
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const { showNotification } = useNotification();

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEmail(formData.email)) {
            setEmailError('请输入有效的邮箱地址');
            return
        } else {
            setEmailError('');
        }
        if (!isPhoneNumber(formData.countryCode + formData.phone)) {
            setPhoneError('请输入有效的手机号码');
            return
        } else {
            setPhoneError('');
        }
        if (!validatePassword(password)) {
            setPasswordError('密码必须至少包含8个字符，包括字母和数字');
            return;
        }
        if (password !== confirmPassword) {
            setPasswordError('两次密码不匹配!');
            return;
        }
        register(password, formData.email, formData.countryCode + formData.phone, formData.name, formData.gender, formData.verificationCode).then((respone) => {
            if (respone.code === 200) {
                showNotification("注册成功", 'success')
            } else {
                showNotification(`注册失败, ${respone.message}`, 'error')
            }
        })
    };

    const handleSendVerificationCode = async () => {
        if (!isEmail(formData.email)) {
            setEmailError('请输入有效的邮箱地址');
        } else {
            setEmailError('');
        }
        try {
            let response = await sendVerificationCode("", formData.email)
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

    return (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <TextField
                label="姓名"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ borderRadius: '12px' }}
            />
            <TextField
                label="邮箱地址"
                variant="outlined"
                fullWidth
                value={formData.email}
                disabled={isCodeSent}
                error={!!emailError}
                helperText={emailError}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{ borderRadius: '12px' }}
            />
            {/* 发送验证码按钮 */}
            <Grid2 container spacing={2}>
                <Grid2>
                    <TextField
                        label="邮箱验证码"
                        variant="outlined"
                        fullWidth
                        value={formData.verificationCode}
                        onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                        sx={{ borderRadius: '12px' }}
                    />
                </Grid2>
                <Grid2>
                    <CustomButton onClick={handleSendVerificationCode} disabled={isCodeSent}>
                        {isCodeSent ? `重新发送(${secondsLeft}s)` : '发送验证码'}
                    </CustomButton>
                </Grid2>
            </Grid2>
            {isCodeSent && <p className="text-red-500 text-sm">验证码已发送至：{formData.email}</p>}

            <Grid2 container spacing={2}>
                {/* 国家/地区选择 */}
                <Grid2> {/* 设置宽度比例 */}
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>国家/地区</InputLabel>
                        <Select
                            label="国家/地区"
                            value={formData.countryCode}
                            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                            sx={{ borderRadius: '12px', minWidth: '130px' }}
                        >
                            {countryCodes.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid2>
                {/* 电话号码输入框 */}
                <Grid2> {/* 设置宽度比例 */}
                    <TextField
                        label="电话号码"
                        variant="outlined"
                        fullWidth
                        value={formData.phone}
                        error={!!phoneError}
                        helperText={phoneError}
                        onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                        }}
                        sx={{ borderRadius: '12px' }}
                    />
                </Grid2>
            </Grid2>
            <FormControl variant="outlined" fullWidth>
                <InputLabel>性别</InputLabel>
                <Select
                    label="性别"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" | "other" })}
                    sx={{ borderRadius: '12px' }}
                >
                    <MenuItem value="male">男</MenuItem>
                    <MenuItem value="female">女</MenuItem>
                    <MenuItem value="other">其他</MenuItem>
                </Select>
            </FormControl>
            <TextFieldWithIcon
                label="密码"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                togglePasswordVisibility={() => setShowPassword(!showPassword)}
            />
            <TextFieldWithIcon
                label="确认密码"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showPassword={showConfirmPassword}
                togglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <CustomButton type="submit">注册</CustomButton>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    已有账号？{' '}
                    <button
                        onClick={toggleForm}
                        className="text-blue-500 hover:text-blue-400 focus:outline-none font-medium"
                    >
                        立即登录
                    </button>
                </p>
            </div>
        </form>
    );
};