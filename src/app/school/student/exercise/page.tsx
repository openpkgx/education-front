"use client";
import React, { useEffect, useState } from "react";
import { Box, Divider, Grid2, Typography } from "@mui/material";
import { TopicItemComponent } from "./topic-item";
import { TableSection } from "./table-section";
import { getTopic } from "@/api/topic-api";
import { useGlobalContext } from "@/components/global-context";
import { ExamPaperSample, Tag, Topic } from "@/api/dto";
import { GetTopicExamPapers, ResetExamPaperRequestQuestion } from "@/api/exam-paper-api";

export default function Page() {
    const [selectedId, setSelectedId] = useState<string>("");
    const [page, setPage] = useState<number>(0); // 当前页码（从 0 开始）
    const [rowsPerPage, setRowsPerPage] = useState<number>(10); // 每页行数
    const { subject, setSubject } = useGlobalContext();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [currentTopic, setCurrentTopic] = useState<Topic>({ id: "", name: "", iconsName: "", order: 0 });
    // const [currentTag, setCurrentTag] = useState<Tag>({ id: "", name: "", iconsName: "", order: 0 });
    const [currentExamPapers, setCurrentExamPapers] = useState<ExamPaperSample[]>([]);
    const [totalSize, setTotalSize] = useState<number>(0); // 总数据量

    useEffect(() => {
        if (subject.id != "") {
            getTopic(subject.id ?? "").then((response) => {
                setTopics([...response.data.topics]);
                if (response.data.topics.length > 0) {
                    handleTopicSelect(response.data.topics[0].id ?? ""); // 默认选择第一个主题
                }
            });
        }
    }, [subject]);

    // 处理主题选择
    const handleTopicSelect = (id: string) => {
        setSelectedId(id);
        const topic = topics.find((b) => b.id === id);
        setCurrentTopic(topic || { id: "", name: "", iconsName: "", order: 0 });
        setPage(0)
        fetchExamPapers(id, 1, rowsPerPage); // 请求第一页数据
    };

    // 获取试卷数据
    const fetchExamPapers = (topicId: string, page: number, pageSize: number) => {
        GetTopicExamPapers(topicId, page, pageSize).then((response) => {
            console.log(`response.data.papers: ${JSON.stringify(response.data.papers)}`);
            setCurrentExamPapers(response.data.papers);
            setTotalSize(response.data.totalSize ?? 0); // 设置总数据量
        });
    };

    // 处理页码变化
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        fetchExamPapers(selectedId, newPage + 1, rowsPerPage); // 请求新页码的数据
    };

    // 处理每页行数变化
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0); // 重置页码为第一页
        fetchExamPapers(selectedId, 1, newRowsPerPage); // 请求第一页数据
    };

    // 重置试卷请求问题
    const handleResetExamPaperRequestQuestion = (examId: string, topicId: string, tagId: string) => {
        ResetExamPaperRequestQuestion(examId, topicId, tagId).then(() => {
            getTopic(subject.id ?? "").then((response) => {
                setTopics([...response.data.topics]);
                if (response.data.topics.length > 0) {
                    handleTopicSelect(selectedId); // 重新加载当前主题
                }
            });
        });
    };

    return (
        <Box sx={{ minHeight: "100vh" }}>
            {/* 顶部导航栏 */}
            <Box sx={{ backgroundColor: "#fff" }}>
                <Box sx={{ mx: "auto", px: 2, py: 2 }}>
                    <Grid2 container spacing={1} justifyContent="flex-start">
                        {/* 渲染导航项 */}
                        {topics.map((item) => (
                            <TopicItemComponent
                                key={item.id}
                                item={item}
                                onClick={handleTopicSelect}
                                selectedId={selectedId}
                            />
                        ))}
                    </Grid2>
                </Box>
            </Box>
            <Divider className="m-4" />
            {/* 表格 */}
            <TableSection
                rows={currentExamPapers ?? []}
                topicId={currentTopic.id as string}
                title={currentTopic.name}
                page={page}
                rowsPerPage={rowsPerPage}
                totalSize={totalSize} // 传递总
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleResetExamPaperRequestQuestion={handleResetExamPaperRequestQuestion}
            />
        </Box>
    );
}