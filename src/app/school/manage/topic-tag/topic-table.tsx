import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Topic } from '@/api/dto';
import TopicRow from './topic-row';
import EditTopicDialog from './edit-topic-dialog';

interface TopicTableProps {
    rows: Topic[];
    onEdit: (tagId: string, updatedTag: { name: string; iconsName: string; order: number }) => void; // 修改为接受两个参数
    onAddTag: (topicId: string) => void;
    onDeleteTopic: (topicId: string) => void;
    onDeleteTag: (topicId: string, tagId: string) => void;
}

export default function TopicTable({ rows, onEdit, onAddTag, onDeleteTopic, onDeleteTag }: TopicTableProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

    return (
        <Paper elevation={0}>
            <TableContainer>
                <Table aria-label="collapsible table" sx={{ border: 'none' }}>
                    <TableHead sx={{ borderBottom: 'none' }}>
                        <TableRow>
                            <TableCell sx={{ border: 'none' }} />
                            <TableCell align="left" sx={{ border: 'none', fontSize: '1.0rem', fontWeight: 'bold' }}>主题名称</TableCell>
                            <TableCell align="center" sx={{ border: 'none', fontSize: '1.0rem', fontWeight: 'bold' }}>主题图标</TableCell>
                            <TableCell align="center" sx={{ border: 'none', fontSize: '1.0rem', fontWeight: 'bold' }}>排列序号</TableCell>
                            <TableCell align="center" sx={{ border: 'none', fontSize: '1.0rem', fontWeight: 'bold' }}>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.sort((a, b) => a.order - b.order).map((row) => (
                            <TopicRow
                                key={row.id}
                                row={row}
                                onEdit={() => {
                                    setCurrentTopic(row);
                                    setEditDialogOpen(true);
                                }}
                                onAddTag={onAddTag}
                                onDeleteTopic={onDeleteTopic}
                                onDeleteTag={onDeleteTag}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 编辑主题弹窗 */}
            {currentTopic && (
                <EditTopicDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    onSubmit={(tag) => {
                        onEdit(currentTopic.id ?? "", tag);
                        setEditDialogOpen(false);
                    }}
                    topic={{
                        name: currentTopic.name,
                        iconsName: currentTopic.iconsName,
                        order: currentTopic.order,
                    }}
                />
            )}
        </Paper>
    );
}