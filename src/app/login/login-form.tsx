import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { CustomButton } from './button';
import { TextFieldWithIcon } from './text-field-with-icon';
import { isEmail, isPhoneNumber } from '@/components/utils';
import { login } from '@/api/user-api';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/notification';
import { useGlobalContext } from '@/components/global-context';

interface LoginFormProps {
    toggleForm: () => void;
    setIsForgotPassword: (value: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ toggleForm, setIsForgotPassword }) => {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const { user, setUser } = useGlobalContext();

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('login submitted', { account, password });
        if (!isEmail(account) && !isPhoneNumber(account)) {
            return
        }
        setLoading(true)
        login(isEmail(account) ? "" : account, isEmail(account) ? account : "", password).then((response) => {
            console.log(`login response ${JSON.stringify(response)}`);
            //localStorage.setItem('auth', JSON.stringify(response)); // 将 Token 存储到 localStorage
            if (response.code !== 200) {
                showNotification(`登录失败, ${response.message}`, 'error')
            } else {
                setUser(response.data.user)
                router.push("/school/student/exercise"); // 数据加载完成且 subject 存在时跳转
            }
        }).catch((e) => {
            showNotification(`登录失败, ${e}`, 'error')
        }).finally(() => {
            setLoading(false)
        })
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 阻止默认行为
            const form = e.currentTarget;
            if (form) form.requestSubmit(); // 手动提交表单
        }
    };
    return (
        <form onSubmit={handleLoginSubmit} onKeyDown={handleKeyDown} className="space-y-4">
            <TextField
                label="邮箱地址/手机号"
                variant="outlined"
                fullWidth
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                sx={{ borderRadius: '12px' }}
            />
            <TextFieldWithIcon
                label="密码"
                type={showPassword ? 'text' : 'password'}  //
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                togglePasswordVisibility={() => setShowPassword(!showPassword)}
            />
            <div className="text-right">
                <button
                    onClick={(e) => {
                        e.preventDefault(); // 阻止默认行为，防止点击时提交表单
                        setIsForgotPassword(true);
                    }}
                    className="text-blue-500 hover:text-blue-400 focus:outline-none font-medium text-sm"
                >
                    忘记密码？
                </button>
            </div>
            <CustomButton type="submit" loading={loading} >登录</CustomButton>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    还没有账号？{' '}
                    <button
                        onClick={toggleForm}
                        className="text-blue-500 hover:text-blue-400 focus:outline-none font-medium"
                    >
                        立即注册
                    </button>
                </p>
            </div>
        </form>
    );
};