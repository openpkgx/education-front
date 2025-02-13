import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { renderIcon } from '../../../../components/utils';
import { Tag } from '@/api/dto';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';

interface CollapsibleContentProps {
    topicId: string; //主题ID
    tags: Tag[]; // 标签数据
    onEdit: (tagId: string) => void; // 编辑标签的回调
    onDeleteTag: (topicId: string, tagId: string) => void; // 删除标签的回调
}

export default function CollapsibleContent({ topicId, tags, onEdit, onDeleteTag }: CollapsibleContentProps) {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [onTag, setOnTag] = useState<Tag>({ name: "", iconsName: "", order: 0 });

    return (
        <Box sx={{ margin: 1, marginLeft: 5 }}>
            <span>标签组</span>
            <Table size="small" aria-label="sub-tags" sx={{ border: 'none' }}>
                <TableBody>
                    {tags.sort((a, b) => a.order - b.order).map((child) => (
                        <TableRow key={child.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, borderBottom: 'none' }}>
                            {/* 第一列留空，用于对齐折叠按钮列 */}
                            <TableCell sx={{ border: 'none' }} />
                            <TableCell sx={{ border: 'none', fontSize: '0.8rem' }}>{child.name}</TableCell>
                            <TableCell align="center" sx={{ border: 'none', fontSize: '0.8rem' }}>
                                {renderIcon(child.iconsName)}
                            </TableCell>
                            <TableCell align="center" sx={{ border: 'none', fontSize: '0.8rem' }}>{child.order}</TableCell>
                            <TableCell align="center" sx={{ border: 'none', fontSize: '0.8rem' }}>
                                <Button variant="outlined" size="small" onClick={() => onEdit(child.id ?? "")}>
                                    编辑
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ marginLeft: 1 }}
                                    color="error"
                                    onClick={() => {
                                        setOnTag(child)
                                        setOpenDeleteConfirm(true)
                                    }}
                                >
                                    删除
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DeleteConfirmDialog open={openDeleteConfirm} title={`标签: ${onTag.name}`} onClose={() => {
                setOpenDeleteConfirm(false)
            }} onConfirm={() => {
                setOpenDeleteConfirm(false)
                onDeleteTag(topicId, onTag.id ?? "")
            }} ></DeleteConfirmDialog>
        </Box>
    );
}