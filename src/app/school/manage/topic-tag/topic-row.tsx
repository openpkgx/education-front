import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import { renderIcon } from '../../../../components/utils';
import CollapsibleContent from './collapsible-content';
import { Topic } from '@/api/dto';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';

interface TopicRowProps {
    row: Topic; // 当前行的标签数据
    onEdit: (tagId: string) => void; // 编辑标签的回调
    onAddTag: (tagId: string) => void; // 添加子标签的回调
    onDeleteTopic: (topicId: string) => void; // 删除主题的回调
    onDeleteTag: (topicId: string, tagId: string) => void; // 删除标签的回调
}

export default function TopicRow({ row, onEdit, onAddTag, onDeleteTopic, onDeleteTag }: TopicRowProps) {
    const [open, setOpen] = useState(false); // 控制折叠状态
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'none' }, '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ border: 'none' }}>
                    {(row.tags?.length ?? 0) > 0 && (
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    )}
                </TableCell>
                <TableCell sx={{ border: 'none' }}>{row.name}</TableCell>
                <TableCell align="center" sx={{ border: 'none', fontSize: '1.0rem' }}>{renderIcon(row.iconsName)}</TableCell>
                <TableCell align="center" sx={{ border: 'none', fontSize: '1.0rem' }}>{row.order}</TableCell>
                <TableCell align="center" sx={{ border: 'none', fontSize: '1.0rem' }}>
                    <Button variant="outlined" size="small" onClick={() => onEdit(row.id ?? "")}>
                        编辑
                    </Button>
                    <Button variant="outlined" size="small" sx={{ marginLeft: 1 }} onClick={() => onAddTag(row.id ?? "")}>
                        添加标签
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ marginLeft: 1 }}
                        color="error"
                        onClick={() => {
                            setOpenDeleteConfirm(true)
                        }}
                    >
                        删除
                    </Button>
                </TableCell>
            </TableRow>
            {(row.tags?.length ?? 0) > 0 && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5} sx={{ border: 'none' }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <CollapsibleContent topicId={row.id ?? ""} tags={row.tags ?? []} onEdit={onEdit} onDeleteTag={onDeleteTag} />
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
            <DeleteConfirmDialog open={openDeleteConfirm} title={`主题：${row.name}`} onClose={() => {
                setOpenDeleteConfirm(false)
            }} onConfirm={() => {
                setOpenDeleteConfirm(false)
                onDeleteTopic(row.id ?? "")
            }} ></DeleteConfirmDialog>
        </React.Fragment>
    );
}