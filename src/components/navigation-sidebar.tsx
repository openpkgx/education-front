"use client"
import React, { useEffect, useState } from 'react'
import Navigation from './navigation'
import Navigation2 from './navigation2';
import PersonalCard from './personal-card';
import Divider from '@mui/material/Divider';
import SubjectSelect from './subject-select';
import { User } from '@/api/dto';
import { getUserFromLocalStorage } from '@/api/user-api';
import { useGlobalContext } from './global-context';

export default function NavigationSidebar() {
    const [suser, setSUser] = useState<User | null>(null);
    const { user } = useGlobalContext();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = getUserFromLocalStorage();
            if (storedUser) {
                setSUser(storedUser);
            }
        }
    }, [user]);
    return (
        <div className='flex grow h-full flex-col border-gray-50 shadow-[0_0_8px_rgba(0,0,0,0.25)] overflow-y-auto'>
            {/* <div className='rounded-md p-2 h-56'>
                <PersonalCard></PersonalCard>
            </div> */}
            <div className='rounded-md p-2 mt-6 '>
                <Divider>学习中心</Divider>
                <SubjectSelect></SubjectSelect>
                <Navigation></Navigation>
            </div>
            {suser?.isAdmin === true && <div className='flex flex-col rounded-md p-2 mt-4  overflow-y-auto'>
                <Divider>系统管理</Divider>
                <Navigation2></Navigation2>
            </div>
            }
        </div>
    )
}
