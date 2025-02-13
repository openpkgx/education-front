// src/hooks/useBooks.ts
import { useState } from 'react';
import {
    createSubject,
    CreateSubjectRequest,
    GetSubjectsRequest,
    getSubjects,
    UpdateSubjectRequest,
    updateSubject,
    DelSubjectRequest,
    deleteSubject,
} from '@/api/subject-api';
import { Subject } from '@/api/dto';

export const useSubjects = () => {
    const [rows, setRows] = useState<Subject[]>([]);

    const addSubjectState = async (subject: Subject) => {
        setRows([...rows, subject]);
        const newSubject: Subject = {
            name: subject.name,
            cover: subject.cover,
            questionTypes: subject.questionTypes,
            description: subject.description
        };

        const request: CreateSubjectRequest = {
            subjects: [newSubject],
        };
        try {
            const response = await createSubject(request);
            console.log('Subjects created successfully:', response);
        } catch (error) {
            console.error('Failed to create subjects:', error);
        }
    };

    const updateSubjectState = async (subject: Subject) => {
        const request: UpdateSubjectRequest = {
            id: subject.id ?? "",
            name: subject.name,

        };
        try {
            const response = await updateSubject(request);
            console.log('Subjects update successfully:', response.data);
        } catch (error) {
            console.error('Failed to create subjects:', error);
        }
        setRows(rows.map(row => (row.id === subject.id ? subject : row)));
    };

    const deleteSubjectState = async (id: string) => {
        const request: DelSubjectRequest = {
            id: id,
        };
        try {
            const response = await deleteSubject(request);
            console.log('Subjects delete successfully:', response.data);
        } catch (error) {
            console.error('Failed to create subjects:', error);
        }
        setRows(rows.filter(row => row.id !== id));
    };

    const reloadSubject = async () => {
        const request: GetSubjectsRequest = {
            page: 1,
            pageSize: 20,
        };
        try {
            const response = await getSubjects(request);
            setRows(response.data.subjects)
            console.log('Subjects get successfully:', response.data);
        } catch (error) {
            console.error('Failed to create subjects:', error);
        }
    }
    return { rows, addSubjectState, updateSubjectState, deleteSubjectState, reloadSubject };
};