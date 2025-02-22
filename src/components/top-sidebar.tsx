"use client";
import React, { useEffect, useState } from 'react'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Marquee, { MarqueeProps } from './marquee';
import { getUserFromLocalStorage, logout } from '@/api/user-api';
import { useRouter } from 'next/navigation';
import { User } from '@/api/dto';
import { useGlobalContext } from './global-context';


export default function TopSidebar({ text }: MarqueeProps) {
    const router = useRouter();
    function logoutSystem() {
        logout().finally(() => {
            router.push("/")
        })
    }
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
    return (
        <div className='flex flex-row items-center justify-between border-gray-50 shadow-[0_0_8px_rgba(0,0,0,0.25)]'>
            <div className='w-full ml-16 mr-16'>
                <Marquee text={text} />
            </div>
            <div className='flex flex-row items-center justify-center gap-2'>
                <Badge badgeContent={0} color="primary" sx={{
                    '& .MuiBadge-badge': {
                        right: 4,
                        top: 24,
                        border: `2px solid`,
                        padding: '0 4px',
                    },
                }}>
                    <IconButton size="medium" title="通知">
                        <MailIcon fontSize="inherit" />
                    </IconButton>
                </Badge>
                <span className="text-sm">{suser?.email}</span>
                <Tooltip title="退出">
                    <IconButton size="medium" onClick={logoutSystem}>
                        <PowerSettingsNewOutlinedIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            </div>
        </div >
    )
}
