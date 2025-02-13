"use client";
import { getAllSubjects } from '@/api/subject-api';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from './global-context';
import { Subject } from '@/api/dto';

export default function SubjectSelect() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const { subject, setSubject } = useGlobalContext();
    // 处理科目选择
    const handleSubjectChange = (event: SelectChangeEvent) => {
        const sub = subjects.find((b) => b.id === event.target.value);
        setSubject(sub || subjects[0]);
    };

    // 在组件挂载时调用 getAllSubjects
    useEffect(() => {
        getAllSubjects().then((response) => {
            if (response.subjects.length > 0) {
                setSubjects(response.subjects)
            }
            if (!subject.id) {
                setSubject(response.subjects[0]);
            }
        });
    }, []); // 空依赖数组确保只在挂载时执行一次

    return (
        <div className='mt-6 mb-4' >
            <FormControl fullWidth>
                <InputLabel id="book-select-label">科目</InputLabel>
                <Select
                    labelId="book-select-label"
                    id="book-select"
                    value={subject.id || ''}
                    label="科目"
                    onChange={handleSubjectChange}
                    sx={{
                        borderRadius: 1,
                        height: '40px',       // 设置高度
                        fontSize: '14px',     // 设置字体大小
                        padding: '0 14px',    // 设置内边距
                    }}
                >
                    <MenuItem value="">请选择科目</MenuItem>
                    {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                            {subject.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}
