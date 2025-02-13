"use client";
import { Question, Subject, Tag, Topic } from '@/api/dto';
import { CreateQuestion, ImportExam } from '@/api/question-api';
import { getAllSubjects } from '@/api/subject-api';
import { getTopic } from '@/api/topic-api';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Input, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'

export default function ImportOnline() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [currentSubject, setCurrentSubject] = useState<Subject>({ id: "", name: "", cover: "", questionTypes: [], description: "" });
    const [currentTopic, setCurrentTopic] = useState<Topic>({ id: "", name: "", iconsName: "", order: 0 });
    const [currentTag, setCurrentTag] = useState<Tag>({ id: "", name: "", iconsName: "", order: 0 });
    const [selectedQuestionType, setSelectedQuestionType] = useState('');
    const [cookie, setCookie] = useState("");
    const [examId, setExamId] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [syncState, setSyncState] = useState(false);
    const [syncMessage, setSyncMessage] = useState("");
    const [syncTimeSecond, setSyncTimeSecond] = useState(0);
    const [importMessage, setImportMessage] = useState("");
    const [importState, setImportState] = useState(false);
    const [importTimeSecond, setImportTimeSecond] = useState(0);


    // 处理科目选择
    const handleSubjectChange = (event: SelectChangeEvent) => {
        const sub = subjects.find((b) => b.id === event.target.value);
        setCurrentSubject(sub || { id: "", name: "", cover: "", questionTypes: [], description: "" });
        setSelectedQuestionType(''); // 重置试题类型
    };

    // 处理试题类型选择
    const handleQuestionTypeChange = (event: SelectChangeEvent) => {
        setSelectedQuestionType(event.target.value);
    };

    // 处理主题选择
    const handleTopicChange = (event: SelectChangeEvent) => {
        const topic = topics.find((b) => b.id === event.target.value);
        setCurrentTopic(topic || { id: "", name: "", iconsName: "", order: 0 })
    };

    // 处理标签选择
    const handleTagChange = (event: SelectChangeEvent) => {
        const tag = currentTopic.tags?.find((b) => b.id === event.target.value);
        setCurrentTag(tag || { id: "", name: "", iconsName: "", order: 0 })
    };

    // 处理输入框值的变化
    const handleCookieChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCookie(event.target.value);
    };

    // 处理输入框值的变化
    const handleExamIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExamId(event.target.value);
    };

    // 在组件挂载时调用 getAllSubjects
    useEffect(() => {
        getAllSubjects().then((response) => {
            if (response.subjects.length > 0) {
                setCurrentSubject(response.subjects[0])
            }
            setSubjects(response.subjects)
        });
    }, []); // 空依赖数组确保只在挂载时执行一次

    useEffect(() => {
        if (currentSubject.id != "") {
            getTopic(currentSubject.id ?? "").then((response) => {
                setTopics([...response.data.topics]);
            })
        }
    }, [currentSubject]);

    return (
        <div className='flex flex-col gap-4'>
            <div className="grid grid-cols-4 gap-4">
                <div >
                    <FormControl fullWidth>
                        <InputLabel id="book-select-label">选择科目</InputLabel>
                        <Select
                            labelId="book-select-label"
                            id="book-select"
                            value={currentSubject.id || ''}
                            label="选择科目"
                            onChange={handleSubjectChange}
                            sx={{ borderRadius: 1 }}
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
                <div>
                    <FormControl fullWidth>
                        <InputLabel id="question-type-select-label">选择试题类型</InputLabel>
                        <Select
                            labelId="question-type-select-label"
                            id="question-type-select"
                            value={selectedQuestionType}
                            label="选择试题类型"
                            onChange={handleQuestionTypeChange}
                            disabled={currentSubject.id === ""} // 未选择科目时禁用
                            sx={{ borderRadius: 1 }}
                        >
                            <MenuItem value="">请选择题型</MenuItem>
                            {currentSubject.questionTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth>
                        <InputLabel id="tag-select-label">选择主题</InputLabel>
                        <Select
                            labelId="topic-select-label"
                            id="topic-select"
                            value={currentTopic.id}
                            label="选择主题"
                            onChange={handleTopicChange}
                            sx={{ borderRadius: 1 }}
                        >
                            <MenuItem value="">请选择主题</MenuItem>
                            {topics.map((topic) => (
                                <MenuItem key={topic.id} value={topic.id}>
                                    {topic.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth>
                        <InputLabel id="tag-select-label">选择标签</InputLabel>
                        <Select
                            labelId="tag-select-label"
                            id="tag-select"
                            value={currentTag.id}
                            label="选择标签"
                            onChange={handleTagChange}
                            sx={{ borderRadius: 1 }}
                        >
                            <MenuItem value="">请选择标签</MenuItem>
                            {currentTopic.tags?.map((tag) => (
                                <MenuItem key={tag.id} value={tag.id}>
                                    {tag.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className='flex flex-row gap-4'>
                <FormControl variant="standard">
                    <InputLabel htmlFor="cookie">Cookie</InputLabel>
                    <Input id="cookie"
                        value={cookie} // 绑定值
                        onChange={handleCookieChange} // 绑定变化事件
                    />
                </FormControl>
                <FormControl variant="standard">
                    <InputLabel htmlFor="examId">试卷ID</InputLabel>
                    <Input id="examId"
                        value={examId} // 绑定值
                        onChange={handleExamIdChange} // 绑定变化事件
                    />
                </FormControl>
                <Button variant="outlined" disabled={syncState} onClick={() => {
                    setSyncState(true)
                    setSyncTimeSecond(0);
                    setQuestions([])
                    const timer = setInterval(() => {
                        setSyncTimeSecond((syncTimeSecond) => syncTimeSecond + 1);
                    }, 1000);
                    ImportExam(cookie, examId).then((response) => {
                        if (response.code !== 200) {
                            setSyncMessage(response.details)
                        } else {
                            console.log(`sync size: ${response.data.totalSize}`)
                            response.data.questions.map((question) => {
                                question.tagIDs = [currentTag.id ?? ""]
                                question.questionType = selectedQuestionType
                                question.subjectId = currentSubject.id ?? ""
                                return question
                            })
                            setQuestions(response.data.questions)
                        }
                    }).catch((e) => {
                        setSyncMessage(e.string())
                    }).finally(() => {
                        clearInterval(timer)
                        setSyncState(false)
                    })
                }}>开始同步</Button>
            </div>
            <span>
                {`同步状态：${syncState ? "同步中" : "空闲"}`}
            </span>
            <span>
                {`同步时长(s)：${syncTimeSecond}s`}
            </span>
            <span>
                {`同步结果：${syncMessage === "" ? "" : syncMessage}`}
            </span>
            <span>
                {`同步试题数量：${questions.length}`}
            </span>
            <Button variant="outlined" disabled={importState} onClick={() => {
                setImportState(true)
                setImportTimeSecond(0);
                const timer = setInterval(() => {
                    setImportTimeSecond((importTimeSecond) => importTimeSecond + 1);
                }, 1000);
                setImportMessage("")
                CreateQuestion(questions).then((response) => {
                    setImportMessage(response.message)
                }).catch((e) => {
                    setImportMessage(e.string())
                }).finally(() => {
                    clearInterval(timer)
                    setImportState(false)
                })
            }}>导入到题库</Button>
            <span>
                {`同步时长(s)：${importTimeSecond}s`}
            </span>
            <span>
                {`导入结果${importMessage}`}
            </span>
            <span>
                {`试题内容：${JSON.stringify(questions)}`}
            </span>
        </div>
    )
}
