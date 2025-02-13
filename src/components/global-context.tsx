"use client";
import { Subject, User } from '@/api/dto';
// GlobalContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// 定义上下文类型
interface GlobalContext {
    subject: Subject;
    user: User;
    setSubject: (value: Subject) => void;
    setUser: (value: User) => void;

}

interface GlobalContextProviderProps {
    children: ReactNode;
}

// 创建一个 Context，默认值为 null
const GlobalContext = createContext<GlobalContext | undefined>(undefined);

// 创建 Provider 组件，封装全局状态
export const GlobalProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
    const [subject, setSubject] = useState<Subject>({ id: "", name: "", cover: "", questionTypes: [], description: "" });
    const [user, setUser] = useState<User>({ username: "", email: "", isActive: false });

    return (
        <GlobalContext.Provider value={{ subject, setSubject, user, setUser }}>
            {children}
        </GlobalContext.Provider>
    );
};

// 自定义 hook，简化上下文的使用
export const useGlobalContext = (): GlobalContext => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};
