import { BaseResponse, ExamPaper, ExamPaperSample, ExamQuestion, ExamQuestionOptions } from "./dto";
import { post } from "./fetch";

// 创建试卷请求
export interface CreateExamPaperRequest {
    userId: string;  // 用户Id
    topicId: string; // 主题ID
    tagId: string;   // 标签
}

// 创建试卷响应
export interface CreateExamPaperResponse {
    paper: ExamPaper; // 试卷详情
}

// 获取试卷请求
export interface GetExamPaperRequest {
    userId: string;  // 用户Id
    topicId: string; // 主题ID
    tagId: string;   // 标签
}

// 获取试卷响应
export interface GetExamPaperResponse {
    paper: ExamPaper; // 试卷详情
}

// 根据主题获取试卷请求
export interface GetExamPaperByTopicRequest {
    page: number;  // 页码
    pageSize: number;  // 每页大小
    topicId: string; // 主题ID
}

// 根据主题获取试卷响应
export interface GetExamPaperByTopicResponse {
    totalSize: number;
    papers: ExamPaperSample[]; // 试卷简约详情列表
}

// 重置试卷请求
export interface ResetExamPaperRequest {
    id: string;  // 试卷Id
    topicId: string; // 主题ID
    tagId: string;   // 标签
}

// 重置试卷响应
export interface ResetExamPaperResponse {
    paper: ExamPaper; // 试卷详情
}

export interface GetExamPaperDetailsRequest {
    id: string; // 试卷ID
}

export interface GetExamPaperDetailsResponse {
    paper: ExamPaper | null; // 使用 null 表示指针可能为 nil
}

// 定义 AnswerExamPaperQuestionRequest
interface AnswerExamPaperQuestionRequest {
    examPaperId: string; // 用户Id
    questionID: string; // 试卷ID
    questionOptions: ExamQuestionOptions[]; // 回答选项
}

// 定义 AnswerExamPaperQuestionResponse
interface AnswerExamPaperQuestionResponse {
    question: ExamQuestion; // 试题列表
}

// 获取主题相关的试题
export const GetTopicExamPapers = async (topicId: string, page: number, pageSize: number): Promise<BaseResponse<GetExamPaperByTopicResponse>> => {
    const url = '/api/getTopicExamPapers';

    const request: GetExamPaperByTopicRequest = {
        topicId: topicId,
        page: page,
        pageSize: pageSize,
    }
    const response = await post<BaseResponse<GetExamPaperByTopicResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 根据试卷ID获取试卷
export const GetExamPapersDetails = async (examId: string): Promise<BaseResponse<GetExamPaperDetailsResponse>> => {
    const url = '/api/getExamPaperDetails';

    const request: GetExamPaperDetailsRequest = {
        id: examId,
    }
    const response = await post<BaseResponse<GetExamPaperDetailsResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 回答试卷某道题目
export const AnswerExamPaperQuestion = async (examId: string, questionId: string, questionOptions: ExamQuestionOptions[]): Promise<BaseResponse<AnswerExamPaperQuestionResponse>> => {
    const url = '/api/answerExamPaperQuestion';

    const request: AnswerExamPaperQuestionRequest = {
        examPaperId: examId,
        questionID: questionId,
        questionOptions: questionOptions,
    }
    const response = await post<BaseResponse<AnswerExamPaperQuestionResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 重置试卷
export const ResetExamPaperRequestQuestion = async (examId: string, topicId: string, tagId: string): Promise<BaseResponse<ResetExamPaperResponse>> => {
    const url = '/api/resetExamPaperQuestion';

    const request: ResetExamPaperRequest = {
        id: examId,
        topicId: topicId,
        tagId: tagId,
    }
    const response = await post<BaseResponse<ResetExamPaperResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};