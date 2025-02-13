"use client";
import React, { useEffect, useState } from 'react';
import QuillEditor from './quill-editor';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Grid2,
    Paper,
    Divider,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material'; // 引入图标
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import { Topic, Subject, Tag, Question, QuestionInit, QuestionOptions } from '@/api/dto';
import { getAllSubjects } from '@/api/subject-api';
import { getTopic } from '@/api/topic-api';
import { useNotification } from '@/components/notification';
import { CreateQuestion } from '@/api/question-api';

const ParentComponent = () => {
    const [editorContent, setEditorContent] = useState('');
    const [analysisContent, setAnalysisContent] = useState(''); // 题目解析内容
    const [selectedQuestionType, setSelectedQuestionType] = useState('');
    const [question, setQuestion] = useState<Question>(QuestionInit);
    const [selectedTag, setSelectedTag] = useState(''); // 用于选择标签
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [currentSubject, setCurrentSubject] = useState<Subject>({ id: "", name: "", cover: "", questionTypes: [], description: "" });
    const [currentTopic, setCurrentTopic] = useState<Topic>({ id: "", name: "", iconsName: "", order: 0 });
    const { showNotification } = useNotification();

    // 处理科目选择
    const handleSubjectChange = (event: SelectChangeEvent) => {
        const sub = subjects.find((b) => b.id === event.target.value);
        if (sub !== null) {
            setQuestion({ ...question, subjectId: sub?.id as string, questionType: "" })
        }
        setCurrentSubject(sub || { id: "", name: "", cover: "", questionTypes: [], description: "" });
        setSelectedQuestionType(''); // 重置试题类型
    };

    // 处理主题选择
    const handleTopicChange = (event: SelectChangeEvent) => {
        const topic = topics.find((b) => b.id === event.target.value);
        setCurrentTopic(topic || { id: "", name: "", iconsName: "", order: 0 })
    };

    // 处理试题类型选择
    const handleQuestionTypeChange = (event: SelectChangeEvent) => {
        setSelectedQuestionType(event.target.value);
        setQuestion({ ...question, questionType: event.target.value });
    };

    // 处理标签选择
    const handleTagChange = (event: SelectChangeEvent) => {
        const tag = event.target.value;
        setSelectedTag(tag);
        if (tag && !question.tagIDs.includes(tag)) {
            setQuestion({ ...question, tagIDs: [tag] });
        } else {
            setQuestion({ ...question, tagIDs: [] });
        }
    };

    // 处理选项内容变化
    const handleOptionChange = (index: number, key: string, value: string) => {
        const updatedOptions = [...question.options];
        updatedOptions[index] = { ...updatedOptions[index], [key]: value };
        setQuestion({ ...question, options: updatedOptions });
    };

    // 处理正确答案勾选
    const handleCorrectAnswerChange = (index: number, optionKey: string) => {
        const updatedOptions = [...question.options];
        const correctAnswers = updatedOptions[index].correctAnswer;

        if (correctAnswers.includes(optionKey)) {
            // 如果已经勾选，则取消勾选
            updatedOptions[index].correctAnswer = correctAnswers.filter(
                (key) => key !== optionKey
            );
        } else {
            // 如果未勾选，则添加
            updatedOptions[index].correctAnswer = [...correctAnswers, optionKey];
        }

        setQuestion({ ...question, options: updatedOptions });
    };

    // 添加新的选项
    const handleAddOption = () => {
        const newOption: QuestionOptions = {
            a: '',
            b: '',
            c: '',
            d: '',
            correctAnswer: [],
            selectedAnswer: []
        };
        setQuestion({
            ...question,
            options: [...question.options, newOption],
        });
    };

    // 删除选项
    const handleDeleteOption = (index: number) => {
        const updatedOptions = question.options.filter((_, i) => i !== index);
        setQuestion({ ...question, options: updatedOptions });
    };

    // 处理解析内容变化
    const handleAnalysisChange = (content: string) => {
        setAnalysisContent(content);
        setQuestion((prevQuestion) => ({ ...prevQuestion, analysis: content }));
    };

    // 处理题目内容变化
    const handleContentChange = (content: string) => {
        setEditorContent(content);
        setQuestion((prevQuestion) => ({ ...prevQuestion, content }));
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


    // 提交
    const handleSubmit = () => {
        if (question.questionType === "") {
            showNotification("请选择题目类型!", "error")
            return;
        }
        if (question.tagIDs.length === 0) {
            showNotification("请选择标签类型!", "error")
            return;
        }
        if (question.content === "" || question.content === "<p><br></p>") {
            showNotification("题目内容为空!", "error")
            return;
        }
        if (question.analysis === "" || question.analysis === "<p><br></p>") {
            showNotification("解析内容为空!", "error")
            return;
        }
        if (question.options.length > 0) {
            question.optionSize = question.options.length
            question.hasOption = true
        }
        question.subjectId = currentSubject.id as string
        console.log(`question: ${JSON.stringify(question)}`)
        let questions: Question[] = [question];
        CreateQuestion(questions).then((resp) => {
            if (resp.code === 200) {
                showNotification("提交成功!", "success")
            } else {
                showNotification(`${resp.details}`, "error")
            }
        }).catch((e) => {
            showNotification(`${e}`, "error")
        })
    };
    return (
        <div className='flex flex-col gap-4'>
            {/* 科目、试题类型和标签选择模块 */}
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
                            value={selectedTag}
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
            {/* 题目内容编辑器 */}
            <Paper elevation={0} className='mt-4'>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    试题正文:
                </Typography>
                <div className='h-[300px] pb-10'> {/* 设置固定高度 */}
                    <QuillEditor
                        initialContent={""}
                        onContentChange={handleContentChange} // 实时更新回调
                    />
                </div>
            </Paper>

            {/* 题目选项输入 */}
            <Paper elevation={0} sx={{ marginTop: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    题目选项:
                </Typography>
                {question.options.map((option, index) => (
                    <Box key={index} sx={{
                        marginBottom: 2,
                        border: 1, // 边框宽度
                        borderColor: 'grey.300', // 使用 grey[500]
                        borderRadius: 1, // 圆角
                        padding: 2, // 内边距
                    }}>
                        <div className='flex flex-row gap-4 justify-start  items-center'>
                            <span className="flex items-center">
                                选项：{index + 1}
                            </span>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => handleDeleteOption(index)}
                                startIcon={<Delete />} // 删除图标
                                sx={{ mt: 1, borderRadius: 1 }}
                            >
                                删除选项
                            </Button>
                        </div>
                        <Grid2 container spacing={2} sx={{ marginTop: 2 }}>
                            {['a', 'b', 'c', 'd'].map((key) => (
                                <Grid2 key={`${index}-${key}`}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            label={`选项 ${key}`}
                                            value={option[key as keyof QuestionOptions] || ''}
                                            onChange={(e) =>
                                                handleOptionChange(index, key, e.target.value)
                                            }
                                            fullWidth
                                            sx={{ borderRadius: 1 }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={option.correctAnswer.includes(key)}
                                                    onChange={() =>
                                                        handleCorrectAnswerChange(index, key)
                                                    }
                                                    color="primary"
                                                />
                                            }
                                            label="正确答案"
                                        />
                                    </Box>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Box>
                ))}
                <Button
                    variant="outlined"
                    onClick={handleAddOption}
                    startIcon={<Add />} // 添加图标
                    sx={{ mt: 2, borderRadius: 1 }}
                >
                    添加选项
                </Button>
            </Paper>
            <Divider sx={{ marginBottom: 10, marginTop: 2 }}></Divider>

            {/* 题目解析编辑器 */}
            <Paper elevation={0} >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    答案解析
                </Typography>
                <Box sx={{ height: '350px', marginBottom: 3 }}> {/* 设置固定高度 */}
                    <QuillEditor
                        initialContent={question.analysis}
                        onContentChange={handleAnalysisChange} // 实时更新回调
                    />
                </Box>
            </Paper>
            <div className='flex flex-row justify-end'>
                <Button
                    variant="outlined"
                    onClick={handleSubmit}
                    startIcon={<SaveOutlinedIcon />} // 删除图标
                    sx={{ mt: 1, borderRadius: 1 }}
                >
                    提交
                </Button>
            </div>
            {/* 显示保存的内容 */}
            <Paper elevation={0}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    预览内容
                </Typography>
                <div dangerouslySetInnerHTML={{ __html: editorContent }} />

                <div dangerouslySetInnerHTML={{
                    __html: ""
                }} />

            </Paper>
        </div>
    );
};

export default ParentComponent;