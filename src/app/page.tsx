"use client";

import { User } from '@/api/dto';
import { logout, getUserFromLocalStorage } from '@/api/user-api';
import { useGlobalContext } from '@/components/global-context';
import MailIcon from '@mui/icons-material/Mail';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  function logoutSystem() {
    logout().finally(() => {
      router.push("/login")
    })
  }
  const [suser, setSUser] = useState<User | null>(null);
  const { user } = useGlobalContext();
  const [isLogined, setIsLogined] = useState<boolean>(false);

  const personalInfo = {
    id: "未知ID",
    name: "未知姓名",
    phone: "未知电话",
    email: "未知邮箱",
    avatar: "/static/images/avatar/2.jpg"
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = getUserFromLocalStorage();
      if (storedUser) {
        setIsLogined(true)
        setSUser(storedUser);
      }
    }
  }, [user]);
  const handleLogin = () => {
    if (isLogined) {
      router.push("/school/student/exercise");
    } else {
      router.push("/login")
    }
  };

  const handleLogout = () => {
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* 页头 - 简化设计 */}
      <header className="bg-white w-full py-4 px-8 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <img
            src="book_logo.png"
            alt="Logo"
            className="h-10 w-10 rounded-full object-contain p-1 bg-gray-200"
          />
          <span className='text-2xl font-semibold text-gray-800 tracking-tight'>四海学堂</span>
        </div>

        <nav>
          <ul className="flex space-x-6">
            {isLogined ? (
              // 显示用户信息和注销按钮
              <li className="flex items-center space-x-3">
                <span className="text-gray-800 font-medium">欢迎, {suser?.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-200 font-medium"
                >
                  注销
                </button>
              </li>
            ) : (
              // 如果没有登录，显示登录按钮
              <li>
                <button
                  onClick={handleLogin}
                  className="text-gray-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-200 font-medium"
                >
                  登陆
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      {/* 主内容区 - 增强视觉表现 */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/static/images/hero1.jpg"
            alt="Hero"
            className="w-full h-full object-cover transform scale-105"
            style={{ filter: 'brightness(0.85) saturate(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/20 to-indigo-900/60" />
        </div>

        <div className="flex flex-col items-center justify-center text-white z-10">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-wider">
            学习永无止境
          </h1>
          <button className="bg-white/90 text-indigo-900 px-8 py-3 rounded-xl
                            hover:bg-white transition-all shadow-lg hover:shadow-xl
                            font-semibold text-lg" onClick={handleLogin}>
            立即开始
          </button>
        </div>
      </main>

      {/* 页尾 - 简化设计 */}
      <footer className="bg-white py-6 border-t border-gray-100">
        <div className="flex flex-row items-center justify-center text-center gap-8 text-sm">
          <p className="text-gray-950">
            © 2025 四海学堂 · 探索无边界的学习体验
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="mailto:huangkun186@gmail.com"
              className="text-gray-950 flex items-center"
            >
              <MailIcon className="mr-2 text-lg" />
              huangkun186@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

