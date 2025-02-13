'use client';
import { ExamQuestion, ExamQuestionOptions, Question, QuestionOptions } from '@/api/dto';
import { Button, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { areArraysEqualIgnoreCase } from '@/components/utils';

interface OptionsCardProps {
    index: number
    optionDetails: QuestionOptions;
    optionAnswer: ExamQuestionOptions;
    onOptionChange: (optionIndex: number, answer: string) => void;
}

function OptionsCard({ optionDetails, optionAnswer, index, onOptionChange }: OptionsCardProps) {
    const [selectedValue, setSelectedValue] = useState("");
    const [bgColor, setBgColor] = useState("");
    useEffect(() => {
        if (optionDetails.selectedAnswer && optionDetails.selectedAnswer.length > 0) {
            setSelectedValue(optionDetails.selectedAnswer[0])
            setBgColor(checkAnswerBg())
        }
    }, [selectedValue]);
    console.log(`OptionsCard optionDetails: ${JSON.stringify(optionDetails)}, optionAnswer: ${JSON.stringify(optionAnswer)}`)

    const checkAnswerBg = () => {
        console.log(`checkAnswerBg selectedAnswer: ${JSON.stringify(optionDetails.selectedAnswer)}, correctAnswer: ${JSON.stringify(optionDetails.correctAnswer)}`)
        if (optionDetails.selectedAnswer) {
            if (areArraysEqualIgnoreCase(optionDetails.selectedAnswer, optionDetails.correctAnswer)) {
                return 'text-green-700'
            } else {
                return 'text-red-600'
            }
        }
        return ''
    }

    function OptionsRadioGroup() {
        if (optionAnswer.isAnswered === true) {
            const answer = optionAnswer.answers[0]
            const correct = optionAnswer.correctAnswer[0]

            function setOptBg(optIndex: string) {
                if (optionAnswer.isCorrect) {
                    if (correct.toLowerCase() === optIndex.toLowerCase()) {
                        return "bg-green-700 rounded-lg"
                    }
                } else {
                    if (correct.toLowerCase() === optIndex.toLowerCase()) {
                        return "bg-green-700 rounded-lg"
                    }
                    if (answer.toLowerCase() === optIndex.toLowerCase()) {
                        return "bg-red-700 rounded-lg"
                    }
                }
            }

            return <div>
                <style>
                    {`
                    .Mui-disabled {
                        color: inherit !important; /* 保持字体颜色不变 */
                    }
                `}
                </style>
                <RadioGroup
                    value={answer}
                    onChange={(e) => {
                        setSelectedValue(e.target.value)
                        setBgColor(checkAnswerBg())
                        onOptionChange(index, e.target.value)
                    }}
                >
                    {optionDetails.a && <FormControlLabel value="A" className={`${selectedValue === "A" ? bgColor : ""}`} label={
                        <div className='flex flex-row justify-center items-center'>
                            <span>A.</span>
                            <span dangerouslySetInnerHTML={{ __html: `${optionDetails.a}` }} />
                        </div>
                    } control={<Radio />} />}
                    {optionDetails.b && <FormControlLabel value="B" className={`${selectedValue === "B" ? bgColor : ""}`} label={
                        <div className='flex flex-row justify-center items-center'>
                            <span>B.</span>
                            <span dangerouslySetInnerHTML={{ __html: `${optionDetails.b}` }} />
                        </div>
                    } control={<Radio />} />}
                    {optionDetails.c && <FormControlLabel value="C" className={`${selectedValue === "C" ? bgColor : ""}`} label={
                        <div className='flex flex-row justify-center items-center'>
                            <span>C.</span>
                            <span dangerouslySetInnerHTML={{ __html: `${optionDetails.c}` }} />
                        </div>
                    } control={<Radio />} />}
                    {optionDetails.d && <FormControlLabel value="D" className={`${selectedValue === "D" ? bgColor : ""}`} label={
                        <div className='flex flex-row justify-center items-center'>
                            <span>D.</span>
                            <span dangerouslySetInnerHTML={{ __html: `${optionDetails.d}` }} />
                        </div>
                    } control={<Radio />} />}
                </RadioGroup>
            </div>
        }
        return <RadioGroup
            value={selectedValue}
            onChange={(e) => {
                setSelectedValue(e.target.value)
                setBgColor(checkAnswerBg())
                onOptionChange(index, e.target.value)
            }}
        >
            {optionDetails.a && <FormControlLabel value="A" className={`${selectedValue === "A" ? bgColor : ""}`} label={
                <div className='flex flex-row justify-center items-center'>
                    <span>A.</span>
                    <span dangerouslySetInnerHTML={{ __html: `${optionDetails.a}` }} />
                </div>
            } control={<Radio />} />}
            {optionDetails.b && <FormControlLabel value="B" className={`${selectedValue === "B" ? bgColor : ""}`} label={
                <div className='flex flex-row justify-center items-center'>
                    <span>B.</span>
                    <span dangerouslySetInnerHTML={{ __html: `${optionDetails.b}` }} />
                </div>
            } control={<Radio />} />}
            {optionDetails.c && <FormControlLabel value="C" className={`${selectedValue === "C" ? bgColor : ""}`} label={
                <div className='flex flex-row justify-center items-center'>
                    <span>C.</span>
                    <span dangerouslySetInnerHTML={{ __html: `${optionDetails.c}` }} />
                </div>
            } control={<Radio />} />}
            {optionDetails.d && <FormControlLabel value="D" className={`${selectedValue === "D" ? bgColor : ""}`} label={
                <div className='flex flex-row justify-center items-center'>
                    <span>D.</span>
                    <span dangerouslySetInnerHTML={{ __html: `${optionDetails.d}` }} />
                </div>
            } control={<Radio />} />}
        </RadioGroup>
    }
    return (
        <div className="flex flex-col p-3">
            {/* 第一行：Typography */}
            <Typography
                variant="body1"
                className="bg-blue-300 p-1 rounded w-fit" // w-fit 使宽度自适应内容
            >
                问题{index + 1}:
            </Typography>
            {/* 第二行：RadioGroup（缩进） */}
            <div className="ml-8 w-fit"> {/* 缩进 2rem (32px)，宽度自适应 */}
                <OptionsRadioGroup></OptionsRadioGroup>
            </div>
        </div>
    );
}


interface QuestionPageProps {
    currentQuestionIndex: number;
    questionDetails: Question;
    questionAnswer: ExamQuestion;
    questionOptionChange: (questionId: string, optionIndex: number, answer: string) => void;
    onFavorite: (question: Question) => void;
}

export default function QuestionPage({ questionDetails, currentQuestionIndex, questionAnswer, questionOptionChange, onFavorite }: QuestionPageProps) {
    const handleOptionChange = (optionIndex: number, answer: string) => {
        questionOptionChange(questionDetails.id ?? "", optionIndex, answer)
        //question.options[optionIndex].selectedAnswer = [answer]
    }

    return (
        <div className="p-6 max-h-full w-full flex flex-col overflow-hidden">
            <div className='flex flex-row items-end justify-end'>
                <Button
                    variant="outlined"
                    size="medium"
                    color="primary"
                    onClick={() => {
                        onFavorite(questionDetails)
                    }}
                    startIcon={<StarOutlineIcon />}
                    className="ml-auto"
                >
                    加入收藏
                </Button>
            </div>
            {/* 第一个 div：不允许滚动 */}
            <div className="flex justify-start w-full flex-shrink-0 overflow-hidden mt-4">
                <span>{currentQuestionIndex + 1}、</span>
                <div dangerouslySetInnerHTML={{ __html: questionDetails.content }} />
            </div>

            {/* 可滚动区域 */}
            <div className="flex-1 grow w-full overflow-y-auto">
                {/* 问题列表 */}
                <div className="flex justify-start w-full flex-col">
                    {questionDetails.hasOption === true && questionDetails.options.map((optionDetails, index) => {
                        const key = (questionDetails.id as string) + "-" + index
                        return <OptionsCard key={key} index={index} optionDetails={optionDetails} optionAnswer={questionAnswer.questionOptions[index]} onOptionChange={handleOptionChange} />
                    })}
                </div>
            </div>
        </div>
    );
}
