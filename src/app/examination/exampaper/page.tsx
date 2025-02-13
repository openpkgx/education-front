'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import QuestionPage from './question-page';
import { ExamPaper, ExamPaperInit, ExamQuestion, ExamQuestionOptions, ExamQuestionrInit, Question, QuestionInit } from '@/api/dto';
import { GetQuestion } from '@/api/question-api';
import TopSidebar from '@/components/top-sidebar';
import BottomPage from './bottom-page';
import { AnswerExamPaperQuestion, GetExamPapersDetails } from '@/api/exam-paper-api';
import QuestionOptionsCard from './question-options-card';
import { addFavorite } from '@/api/favorite-api';
import { useNotification } from '@/components/notification';

type QuestionMap = {
    [key: string]: Question;
};

export default function Page() {
    // const examId = params.examId;  // 直接访问 params.exaid，不用解包
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [currentQuestionDetails, setCurrentQuestionDetails] = useState<Question>(QuestionInit);
    const [examPaper, setExamPaper] = useState<ExamPaper>(ExamPaperInit);
    //  const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [questionMap, setQuestionMap] = useState<QuestionMap>({});
    const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<ExamQuestion>(ExamQuestionrInit);
    const { showNotification } = useNotification();

    // 添加新数据
    const addQuestion = (question: Question) => {
        setQuestionMap((prevObj) => ({ ...prevObj, [question.id as string]: question }));
    };

    // 删除数据
    const deleteQuestion = (questionId: string) => {
        setQuestionMap((prevObj) => {
            const newObj = { ...prevObj };
            delete newObj[questionId];
            return newObj;
        });
    };

    // 获取指定 key 的对象
    const getQuestion = (questionId: string): Question => {
        return questionMap[questionId];
    };

    // 判断指定 key 是否存在
    const isQuestionExists = (questionId: string): boolean => {
        return questionId in questionMap;
    };

    useEffect(() => {
        GetExamPapersDetails(id as string).then((response) => {
            const exam = (response.data.paper as ExamPaper)
            setExamPaper(exam)
            if (exam.questions.length > 0) {
                const questionID = exam.questions[0].questionId
                GetQuestion(questionID).then((question) => {
                    setCurrentQuestionIndex(0)
                    setCurrentQuestionDetails(question.data.question)
                    setCurrentQuestionAnswer(exam.questions[0])
                    addQuestion(question.data.question);
                })
            }
        })
    }, [id]);

    const handleNextQuestion = () => {
        //handleQuestionOptionResult(currentQuestionDetails.id as string)
        const size = examPaper.questions.length
        if (currentQuestionIndex < size - 1) {
            const nextId = currentQuestionIndex + 1
            const question = examPaper.questions[nextId]
            const exist = isQuestionExists(question.questionId)
            if (exist) {
                //已存在
                setCurrentQuestionIndex(nextId)
                setCurrentQuestionDetails(getQuestion(question.questionId))
                setCurrentQuestionAnswer(examPaper.questions[nextId])
                return
            }
            //下一题
            GetQuestion(question.questionId).then((response) => {
                setCurrentQuestionIndex(nextId)
                setCurrentQuestionDetails(response.data.question)
                setCurrentQuestionAnswer(examPaper.questions[nextId])
                addQuestion(response.data.question);
            })
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            const previousId = currentQuestionIndex - 1
            const questionId = examPaper.questions[currentQuestionIndex - 1].questionId
            if (!isQuestionExists(questionId)) {
                GetQuestion(questionId).then((response) => {
                    setCurrentQuestionIndex(previousId)
                    setCurrentQuestionDetails(response.data.question)
                    setCurrentQuestionAnswer(examPaper.questions[previousId])
                    addQuestion(response.data.question);
                })
                return
            }
            setCurrentQuestionDetails(getQuestion(questionId))
            setCurrentQuestionAnswer(examPaper.questions[currentQuestionIndex - 1])
            setCurrentQuestionIndex((index) => {
                const newIndex = index - 1;
                return newIndex >= 0 ? newIndex : index; // 确保索引不小于 0
            })
        }
    };

    const handleQuestionSelected = (questionId: string, index: number) => {
        const exist = isQuestionExists(questionId)
        if (exist) {
            //已存在
            setCurrentQuestionIndex(index)
            setCurrentQuestionDetails(getQuestion(questionId))
            setCurrentQuestionAnswer(examPaper.questions[index])
            return
        }
        //不存重新获取
        GetQuestion(questionId).then((response) => {
            setCurrentQuestionIndex(index)
            setCurrentQuestionDetails(response.data.question)
            setCurrentQuestionAnswer(examPaper.questions[index])
            addQuestion(response.data.question);
        })
    };

    //点击试题选择回调
    const handleQuestionOptionChange = (questionId: string, optionIndex: number, answer: string) => {
        const question = getQuestion(questionId)
        question.options[optionIndex].selectedAnswer = [answer]
        handleQuestionOptionResult(questionId)
        setTimeout(() => {
            // handleNextQuestion();
        }, 1500); // 延时 3 秒
    }

    //提交服务端验证答题结果
    const handleQuestionOptionResult = async (questionId: string) => {
        if (questionId === "") {
            return
        }
        const question = getQuestion(questionId)
        //检查选项是否都已选中
        let examQuestionOptions: ExamQuestionOptions[] = [];

        let selectedAll = true
        for (let i = 0; i < question.options.length; i++) {
            let opt: ExamQuestionOptions = {
                correctAnswer: [],
                answers: [],
                isCorrect: false,
                isAnswered: false,
                score: 0
            }
            if (!question.options[i].selectedAnswer || question.options[i].selectedAnswer.length === 0) {
                selectedAll = false
            } else {
                opt.answers = question.options[i].selectedAnswer
            }
            examQuestionOptions.push(opt)
        }
        //已选中，发送请求验证结果
        if (selectedAll) {
            try {
                let response = await AnswerExamPaperQuestion(examPaper.id as string, questionId, examQuestionOptions)
                console.log(`AnswerExamPaperQuestion response: ${JSON.stringify(response)}`)
                setExamPaper((paper) => ({
                    ...paper,
                    questions: paper.questions.map((q) =>
                        q.questionId === questionId ? response.data.question : q
                    ),
                }));
                setCurrentQuestionAnswer(response.data.question)
                //更新选择UI
                //handleQuestionSelected(questionId, currentQuestionIndex)
            } catch (e) {
                console.log(`AnswerExamPaperQuestion response: ${e}`)
            }
        }
    }

    const hadnleOnFavorite = (question: Question) => {
        addFavorite(examPaper.topicId, examPaper.tagId, question.id as string).then((response) => {
            if (response.code === 200) {
                showNotification("收藏成功!", "success")
            } else {
                showNotification(`收藏失败, ${response.details}`, "warning")
            }
        }).catch((e) => {
            showNotification("收藏失败!", "warning")
        })
    };

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden">
            <div className="flex-none w-72 m-2 h-full">
                <QuestionOptionsCard examPaper={examPaper} questions={examPaper.questions} currentQuestionIndex={currentQuestionIndex} onSelected={handleQuestionSelected}></QuestionOptionsCard>
            </div>
            <div className="flex flex-col w-full overflow-y-auto p-2">
                <TopSidebar text={examPaper.name}></TopSidebar>
                <div className="flex flex-col overflow-y-auto w-full  h-screen mt-2 border-gray-50 shadow-[0_0_8px_rgba(0,0,0,0.25)]">
                    <div className='w-full'>
                        <QuestionPage
                            currentQuestionIndex={currentQuestionIndex}
                            questionDetails={currentQuestionDetails}
                            questionAnswer={currentQuestionAnswer}
                            questionOptionChange={handleQuestionOptionChange}
                            onFavorite={hadnleOnFavorite} />
                    </div>
                    <div className='justify-end mt-auto w-full'>
                        <BottomPage questionDetails={currentQuestionDetails} onPreviousQuestion={handlePreviousQuestion} onNextQuestion={handleNextQuestion}></BottomPage>
                    </div>
                </div>
            </div>
        </div>
    );
}
