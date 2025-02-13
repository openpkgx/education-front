"use client";
import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { getUserFromLocalStorage } from '@/api/user-api';
import { User } from '@/api/dto';
import { useGlobalContext } from './global-context';

export default function PersonalCard() {
    const [suser, setSUser] = useState<User | null>(null);
    const { user } = useGlobalContext();

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
                setSUser(storedUser);
            }
        }
    }, [user]);
    // const userString = localStorage.getItem('user');
    console.log(`userString: ${JSON.stringify(suser)}`)
    return (
        <div className='flex flex-col h-full'>
            <div className='flex flex-col items-center justify-center'>
                <Avatar sx={{ width: 64, height: 64 }} alt="Travis Howard" src={personalInfo.avatar} />
                <span className='text-sm text-gray-700 mt-4'>系统管理员</span>
            </div>
            <div className="flex justify-center items-center h-full mt-4">
                <div className="grid inner-grid grid-cols-2 grid-rows-2 gap-6">
                    {/* User ID */}
                    <div className="item text-sm text-gray-700 flex items-center relative group" style={{ maxWidth: '200px' }}>
                        <PersonOutlineOutlinedIcon className="mr-1" />
                        <span className="overflow-hidden whitespace-nowrap text-ellipsis">{suser?.id}</span>
                        <span className="absolute left-0 top-full mt-2 px-2 py-1 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-normal">
                            {suser?.id}
                        </span>
                    </div>

                    {/* Full Name */}
                    <div className="item text-sm text-gray-700 flex items-center relative group" style={{ maxWidth: '200px' }}>
                        <BadgeOutlinedIcon className="mr-1" />
                        <span className="overflow-hidden whitespace-nowrap text-ellipsis">{suser?.fullName}</span>
                        <span className="absolute left-0 top-full mt-2 px-2 py-1 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-normal">
                            {suser?.fullName}
                        </span>
                    </div>

                    {/* Phone Number */}
                    <div className="item text-sm text-gray-700 flex items-center relative group" style={{ maxWidth: '200px' }}>
                        <PhoneIphoneOutlinedIcon className="mr-1" />
                        <span className="overflow-hidden whitespace-nowrap text-ellipsis">{suser?.phone}</span>
                        <span className="absolute left-0 top-full mt-2 px-2 py-1 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-normal">
                            {suser?.phone}
                        </span>
                    </div>

                    {/* Email Address */}
                    <div className="item text-sm text-gray-700 flex items-center relative group" style={{ maxWidth: '200px' }}>
                        <EmailOutlinedIcon className="mr-1" />
                        <span className="overflow-hidden whitespace-nowrap text-ellipsis">{suser?.email}</span>
                        <span className="absolute left-0 top-full mt-2 px-2 py-1 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-normal">
                            {suser?.email}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
