"use client";
import React, { useState } from 'react';
import { ForgotPasswordForm } from './forgot-password-form';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const toggleForm = () => setIsLogin(!isLogin);

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
                <div className="text-center mb-6">
                    <img src="book_logo.png" alt="Welcome" className="mx-auto h-12" />
                    <h2 className="text-3xl font-semibold text-gray-800 mt-4">
                        {isForgotPassword ? '重置密码' : isLogin ? '你好，欢迎回来' : '注册新账号'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        {isForgotPassword
                            ? '请输入您的邮箱或电话号码以重置密码'
                            : isLogin
                                ? '请输入您的登录信息以继续'
                                : '创建您的账号以开始使用'}
                    </p>
                </div>

                {isForgotPassword ? (
                    <ForgotPasswordForm setIsForgotPassword={setIsForgotPassword} />
                ) : isLogin ? (
                    <LoginForm toggleForm={toggleForm} setIsForgotPassword={setIsForgotPassword} />
                ) : (
                    <RegisterForm toggleForm={toggleForm} />
                )}
            </div>
        </div>
    );
}

