"use client";
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddTagDialog from './add-tag-dialog';
import { Divider, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { Subject, Topic } from '@/api/dto';
import AddTopicDialog from './add-topic-dialog';
import TopicTable from './topic-table';
import { getAllSubjects } from '@/api/subject-api';
import { createTopic, createTopicTags, deleteTopic, deleteTopicTags, getTopic } from '@/api/topic-api';

export default function ParentComponent() {
    const [rows, setRows] = useState<Topic[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [addTopicDialogOpen, setAddTopicDialogOpen] = useState(false);
    const [addTagDialogOpen, setAddTagDialogOpen] = useState(false);
    const [currentTopicId, setCurrentTopicId] = useState<string | null>(null); // 当前正在添加标签的主题ID
    const [subject, setSubject] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setSubject(event.target.value as string);
    };
    // 添加主题
    const handleAddTopic = (topic: {
        name: string; iconsName: string; order: number
    }) => {

        createTopic(subject, topic.name, topic.iconsName, topic.order).then((response) => {
            setRows([...rows, ...response.data.succeeded]);
        }).finally(() => setAddTopicDialogOpen(false))
    };

    // 添加标签
    const handleAddTag = (topicId: string, tag: { name: string; iconsName: string; order: number }) => {

        createTopicTags(topicId, tag.name, tag.iconsName, tag.order).then((response) => {
            const updatedRows = rows.map((row) =>
                row.id === topicId
                    ? { ...row, tags: [...(row.tags || []), ...response.data.succeeded] }
                    : row
            );
            setRows(updatedRows);
        }).finally(() => setAddTagDialogOpen(false))
    };

    // 编辑标签
    const handleEditTag = (tagId: string, updatedTag: { name: string; iconsName: string; order: number }) => {
        const updatedRows = rows.map((row) => ({
            ...row,
            tags: row.tags?.map((child) =>
                child.id === tagId ? { ...child, ...updatedTag } : child
            ),
        })
        );
        setRows(updatedRows);
    };

    // 删除主题
    const handleDeleteTopic = (topicId: string) => {
        deleteTopic(topicId).then(() => {
            const updatedRows = rows.filter((row) => row.id !== topicId); // 过滤掉 id 等于 topicId 的 row
            setRows(updatedRows);
        })
    };

    // 删除标签
    const handleDeleteTag = (topicId: string, tagId: string) => {
        deleteTopicTags(topicId, tagId).then(() => {
            // 更新 rows
            const updatedRows = rows.map((row) => {
                if (row.id === topicId) {
                    row.tags = row.tags?.filter((child) => child.id !== tagId);
                }
                return row;
            });
            // 更新状态
            setRows(updatedRows);
        }).catch((error) => {
            console.error("删除标签失败:", error);
        });
    };

    // 在组件挂载时调用 reloadSubject
    useEffect(() => {
        getAllSubjects().then((response) => {
            if (response.subjects.length > 0) {
                setSubject(response.subjects[0].id ?? "")
            }
            setSubjects(response.subjects)
        });
    }, []); // 空依赖数组确保只在挂载时执行一次

    useEffect(() => {
        if (subject !== "") {
            getTopic(subject).then((response) => {
                setRows([...response.data.topics]);
            })
        }
    }, [subject]);

    return (
        <div className='flex flex-col w-full h-full gap-8'>
            <Divider textAlign="center" className='m-4'>
                <div className='flex flex-row justify-center items-center gap-2'>
                    <AutoStoriesOutlinedIcon fontSize="large" />
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={subject}
                        size="small"
                        className='w-52'
                        onChange={handleChange}
                    >

                        {
                            subjects.map((subject, index) => {
                                // 在这里对每个 subject 执行操作
                                console.log(`Subject ${index}:`, subject);
                                return <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>; // 返回处理后的 subject（如果需要）
                            })
                        }
                    </Select>
                    {/* 添加主题按钮 */}
                    <Button variant="text" onClick={() => setAddTopicDialogOpen(true)}>添加主题</Button>
                </div>
            </Divider>
            <Box sx={{ padding: 2 }}>
                {/* 标签表格 */}
                <TopicTable
                    rows={rows}
                    onEdit={handleEditTag}
                    onAddTag={(topicId) => {
                        setCurrentTopicId(topicId); // 设置当前主题ID
                        setAddTagDialogOpen(true); // 打开添加标签弹窗
                    }}
                    onDeleteTopic={handleDeleteTopic}
                    onDeleteTag={handleDeleteTag}
                />

                {/* 添加主题弹窗 */}
                <AddTopicDialog
                    open={addTopicDialogOpen}
                    onClose={() => {
                        setAddTopicDialogOpen(false);
                    }}
                    onSubmit={(topic) => {
                        // 添加主题
                        handleAddTopic(topic);
                    }}
                    title={'添加主题'}
                />

                {/* 添加标签弹窗 */}
                <AddTagDialog
                    open={addTagDialogOpen}
                    onClose={() => {
                        setAddTagDialogOpen(false);
                        setCurrentTopicId(null); // 重置当前主题ID
                    }}
                    onSubmit={(tag) => {
                        handleAddTag(currentTopicId ?? "", tag);
                    }}
                    title={'添加标签'}
                />
            </Box>
        </div>
    );
}