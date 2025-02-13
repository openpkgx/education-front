"use client";
import { useRouter, usePathname } from 'next/navigation'
import React, { JSX, useState } from 'react'
import Box from '@mui/material/Box';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { SvgIconComponent } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { colors } from '@mui/material';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';

const MenusRoutes: MenuItem[] = [
  {
    id: "100",
    name: "用户管理",
    href: "",
    icon: PortraitOutlinedIcon,
    children: [
      {
        id: "100.1",
        name: "用户配置",
        href: "/school/manage/user",
        icon: PeopleOutlineOutlinedIcon,
        children: [],
      },
      {
        id: "100.2",
        name: "角色管理",
        href: "/school/manage/role",
        icon: ManageAccountsOutlinedIcon,
        children: [],
      },
    ],
  }, {
    id: "101",
    name: "学科管理",
    href: "",
    icon: LocalLibraryOutlinedIcon,
    children: [
      {
        id: "101.1",
        name: "学科目录",
        href: "/school/manage/subject",
        icon: AutoStoriesOutlinedIcon,
        children: [],
      },
      {
        id: "101.2",
        name: "章节管理",
        href: "/school/manage/chapter",
        icon: MenuBookOutlinedIcon,
        children: [],
      },
      {
        id: "101.3",
        name: "主题标签",
        href: "/school/manage/topic-tag",
        icon: MenuBookOutlinedIcon,
        children: [],
      },
    ],
  }, {
    id: "102",
    name: "题库管理",
    href: "",
    icon: DatasetOutlinedIcon,
    children: [
      {
        id: "102.1",
        name: "在线导入",
        href: "/school/manage/import-online",
        icon: CloudSyncOutlinedIcon,
        children: [],
      },
      {
        id: "102.2",
        name: "试题编辑",
        href: "/school/manage/question-edit",
        icon: CheckBoxOutlinedIcon,
        children: [],
      },
      {
        id: "102.3",
        name: "试题审核",
        href: "/school/manage/question-review",
        icon: NotesOutlinedIcon,
        children: [],
      },
      {
        id: "102.4",
        name: "试题管理",
        href: "/school/manage/question",
        icon: EditNoteOutlinedIcon,
        children: [],
      },
    ],
  }
]

interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon?: SvgIconComponent;
  children: MenuItem[];
}

interface RenderItemProps {
  item: MenuItem;
  onClick: (menuId: string) => void;
  isExpanded: boolean
}

const RenderItem: React.FC<RenderItemProps> = ({ item, onClick, isExpanded }) => {
  const router = useRouter()
  const pathname = usePathname();
  const handleClick = () => {
    onClick(item.id)
    if (item.href !== "") {
      router.push(item.href)
    }
  };

  const ExpandedIcon = ({ show = false, isExpanded = false }) => {
    if (show === true) {
      return (<>{isExpanded ? <KeyboardArrowDownRoundedIcon></KeyboardArrowDownRoundedIcon> : <KeyboardArrowRightRoundedIcon></KeyboardArrowRightRoundedIcon>}</>)
    }
    return (<></>)
  }
  return (
    <div className="flex items-center w-full h-9">
      <Box
        className="flex items-center w-full h-9 rounded-md pl-2"
        sx={{
          backgroundColor: pathname === item.href ? alpha(colors.blue[700], 0.7) : 'transparent', // 根据点击状态设置背景颜色
          color: pathname === item.href ? colors.blueGrey[50] : 'inherit', // 根据点击状态设置文本颜色
          // transition: 'background-color 0.3s, color 0.3s', // 添加过渡效果使变化更平滑
          cursor: 'pointer', // 设置默认鼠标指针为手型
          ...(pathname !== item.href && {
            '&:hover': {
              color: alpha(colors.blue[700], 1),
              background: alpha(colors.blue[700], 0.1),
            },
          }),
          '&:active': { // 鼠标悬停时的样式
            color: alpha(colors.blueGrey[700], 1),
            background: alpha(colors.blue[700], 0.7),
          },
          '&:focus': { // 鼠标悬停时的样式
            color: alpha(colors.blueGrey[700], 1),
            background: alpha(colors.blue[700], 0.7),
          },
        }}
        onClick={handleClick}
      >
        <div className={`flex w-full justify-between`}>
          <div className='flex items-center justify-center gap-2'>
            {item.icon && <item.icon fontSize='small' style={{ width: '1.2em', height: '1.2em' }} />}
            <span>{item.name}</span>
          </div>
          <ExpandedIcon show={item.children.length > 0} isExpanded={isExpanded}></ExpandedIcon>
        </div>
      </Box >
    </div>
  )
}
const NavigationMenu: React.FC<{ items: MenuItem[] }> = ({ items }) => {
  const [expandedMenuIds, setExpandedMenuIds] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    if (expandedMenuIds.includes(menuId)) {
      setExpandedMenuIds(expandedMenuIds.filter(id => id !== menuId));
    } else {
      setExpandedMenuIds([...expandedMenuIds, menuId]);
    }
  };
  const renderItems = (items: MenuItem[], parentName: string): JSX.Element[] => {
    return items.map((item) => (
      <div key={item.id} className="flex flex-col items-center w-full">
        {item.children.length > 0 ? (
          <div className="flex items-start flex-col w-full">
            <RenderItem item={item} onClick={toggleMenu} isExpanded={expandedMenuIds.includes(item.id)}></RenderItem>
            <div className='bg-white w-full h-0.5'></div>
            {expandedMenuIds.includes(item.id) && <div className='flex items-start flex-col w-full pl-6'>{renderItems(item.children, item.id)}</div>}
          </div>
        ) : (
          <div className='w-full'>
            <RenderItem item={item} onClick={toggleMenu} isExpanded={expandedMenuIds.includes(item.id)}></RenderItem>
          </div>
        )}
        <div className='bg-white w-full h-0.5'></div>
      </div>
    ));
  }
  return (
    <div className="rounded-md">
      {renderItems(items, '')}
    </div>
  );
}

export default function Navigation2() {
  return (
    <div className='flex flex-col mt-2 overflow-y-auto'>
      <NavigationMenu items={MenusRoutes}></NavigationMenu>
    </div>
  )
}