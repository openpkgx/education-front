"use client";
import { ExamPaper, ExamQuestion } from "@/api/dto";
import { Typography, Button, Box } from "@mui/material";
import React from "react";

interface QuestionOptionsCardProps {
    examPaper?: ExamPaper;
    questions?: ExamQuestion[];
    currentQuestionIndex: number;
    onSelected: (questionId: string, index: number) => void;
}

export default function QuestionOptionsCard({ examPaper, questions, currentQuestionIndex, onSelected }: QuestionOptionsCardProps) {
    const changeBgColor = (index: number, question: ExamQuestion) => {
        if (question.isAnswered) {
            return {
                bgcolor: question.isCorrect ? 'success.main' : 'error.main',
                color: 'white'
            };
        }
        return {
            bgcolor: index === currentQuestionIndex ? 'primary.main' : 'background.paper',
            color: index === currentQuestionIndex ? 'white' : 'text.primary'
        };
    };

    function getCorrectCount() {
        let correctCount = 0;
        questions?.forEach((question) => {
            if (question.isCorrect) {
                correctCount += 1;
            }
        });
        return correctCount;
    }

    function getErrorCount() {
        let answeredCount = 0;
        questions?.forEach((question) => {
            if (question.isAnswered) {
                answeredCount += 1;
            }
        });
        return answeredCount - getCorrectCount();
    }

    function totalScore() {
        let score = 0;
        questions?.forEach((question) => {
            question.questionOptions?.forEach((opt) => {
                score += opt.score
            });
        });
        return score;
    }

    function rightScore() {
        let score = 0;
        questions?.forEach((question) => {
            question.questionOptions?.forEach((opt) => {
                if (opt.isCorrect) {
                    score += opt.score
                }
            });
        });
        return score;
    }

    function wrongScore() {
        let score = 0;
        questions?.forEach((question) => {
            question.questionOptions?.forEach((opt) => {
                if (opt.isAnswered && !opt.isCorrect) {
                    score += opt.score
                }
            });
        });
        return score;
    }

    function getNotAnswer() {
        let answeredCount = 0;
        questions?.forEach((question) => {
            if (question.isAnswered) {
                answeredCount += 1;
            }
        });
        return (examPaper as ExamPaper).totalCount - answeredCount;
    }

    return (
        <div className="h-full pb-4">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                p: 4,
                alignItems: 'center',
                boxShadow: '0 0 8px rgba(0,0,0,0.25)',
                overflowY: 'auto',
                flex: '0 0 auto',
                justifyContent: 'space-between'
            }}>
                <div className="flex flex-col justify-center items-center">
                    <Typography variant="body1">答题卡</Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        mt: 4
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            gap: 2,
                            width: '100%',
                            mx: 'auto'
                        }}>
                            {questions?.map((question, index) => {
                                return <Box key={index} sx={{ position: 'relative' }}> {/* 容器用于蓝点定位 */}
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        onClick={() => onSelected(question.questionId, index)}
                                        sx={{
                                            ...changeBgColor(index, question),
                                            color: 'text.secondary',
                                            fontSize: '0.875rem',
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            p: 0,
                                            minWidth: 0,
                                            '&:hover': {
                                                bgcolor: 'primary.light'
                                            }
                                        }}
                                    >
                                        {index + 1}
                                    </Button>
                                    {/* 蓝点 */}
                                    {currentQuestionIndex === index && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -9,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 8,
                                                height: 8,
                                                bgcolor: 'text.disabled',
                                                borderRadius: '50%'
                                            }}
                                        />
                                    )}
                                </Box>;
                            })}
                        </Box>
                    </Box>
                </div>
                <Box sx={{ mt: 2, alignSelf: 'stretch', textAlign: 'center' }}> {/* 自身拉伸并居中对齐文本 */}
                    <Typography variant="body2">总分数：{totalScore()}</Typography>
                    <Typography variant="body2" sx={{ color: 'success.main' }}>正确分数：{rightScore()}</Typography>
                    <Typography variant="body2" sx={{ color: 'error.main' }} >错误分数：{wrongScore()}</Typography>
                </Box>
            </Box>
        </div>
    );
}