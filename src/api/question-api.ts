import { BaseResponse, Question, QuestionOptions } from "./dto";
import { post } from "./fetch";

export interface ImportExamResponse {
    totalSize: number;
    questions: Question[];
}

export interface Request {
    cookie: string;
    examId: string;
}

export interface CreateQuestionRequest {
    questions: Question[];
}

export interface CreateQuestionResponse {
    failed: Question[];
}

export interface UpdateQuestionRequest {
    question: Question;
}

export interface UpdateQuestionResponse {
    // No properties defined
}

export interface DeleteQuestionRequest {
    id: string;
}

export interface DeleteQuestionResponse {
    // No properties defined
}

export interface TagQuestions {
    tagId: string;
    questionSize: number;
    questionId: string[];
}

export interface GetQuestionIDSByTagsRequest {
    subjectId: string;
    tagIds: string[];
}

export interface GetQuestionIDSByTagsResponse {
    tagQuestions: TagQuestions[];
}

export interface GetQuestionRequest {
    id: string;
}

export interface GetQuestionResponse {
    question: Question;
}

export interface LoadQuestionResponse {
    totalSize: number;
    questions: Question[];
}

export interface QuestionOptionAnswers {
    answers: string[];
}

export interface QuestionOptionsVerifyRequest {
    questionId: string;
    options: QuestionOptionAnswers[];
}

export interface QuestionOptionsVerifyResponse {
    isCorrect: boolean;
    correctAnswers: QuestionOptions[];
}


// 导入在线试卷题目
export const ImportExam = async (cookie: string, examId: string): Promise<BaseResponse<ImportExamResponse>> => {
    const url = '/api/importExam';

    const request: Request = {
        examId: examId,
        cookie: cookie
    }
    const response = await post<BaseResponse<ImportExamResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 添加多个题目
export const CreateQuestion = async (questions: Question[]): Promise<BaseResponse<CreateQuestionResponse>> => {
    const url = '/api/createQuestion';

    const request: CreateQuestionRequest = {
        questions: questions
    }
    const response = await post<BaseResponse<CreateQuestionResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};


// 获取单个个题目
export const GetQuestion = async (questionID: string): Promise<BaseResponse<GetQuestionResponse>> => {
    const url = '/api/getQuestion';

    const request: GetQuestionRequest = {
        id: questionID
    }
    const response = await post<BaseResponse<GetQuestionResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};