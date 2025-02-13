import { BaseResponse, Subject } from './dto';
import { get, post, ApiResponse, del } from './fetch'; // 导入 fetchApi 的封装方法


// 分页请求参数
export interface PaginationRequest {
    page: number;
    pageSize: number;
}

// 分页响应参数
export interface PaginationResponse {
    totalSize: number;
}

// 创建学科请求
export interface CreateSubjectRequest {
    subjects: Subject[]; // 去掉指针符号
}

// 创建学科响应
export interface CreateSubjectResponse {
    failed: Subject[]; // 去掉指针符号
}

// 获取学科请求
export interface GetSubjectsRequest extends PaginationRequest {
    name?: string;
}

// 获取学科响应
export interface GetSubjectsResponse extends PaginationResponse {
    subjects: Subject[]; // 去掉指针符号
}

// 更新学科请求
export interface UpdateSubjectRequest {
    id: string;
    name: string;
}

// 更新学科响应
export interface UpdateSubjectResponse {
    id: string;
}

// 删除学科请求
export interface DelSubjectRequest {
    id: string;
}

// 删除学科响应
export interface DelSubjectResponse {
    // 无字段
}

// 添加学科题目类型请求
export interface AddSubjectQuestionTypeRequest {
    subjectId: string;
    questionTypes: string[];
}

// 添加学科题目类型响应
export interface AddSubjectQuestionTypeResponse {
    failed: string[];
}

// 删除学科题目类型请求
export interface DelSubjectQuestionTypeRequest {
    subjectId: string;
    questionTypes: string[];
}

// 删除学科题目类型响应
export interface DelSubjectQuestionTypeResponse {
    // 无字段
}

// 创建科目
export const createSubject = async (request: CreateSubjectRequest): Promise<BaseResponse<CreateSubjectResponse>> => {
    const url = '/api/createSubject';
    const response = await post<BaseResponse<CreateSubjectResponse>>(url, request);
    return response.data
};

// 获取科目列表
export const getSubjects = async (request: GetSubjectsRequest): Promise<BaseResponse<GetSubjectsResponse>> => {
    const url = '/api/getSubjects';
    const response = await post<BaseResponse<GetSubjectsResponse>>(url, request);
    return response.data
};

export const getAllSubjects = async (): Promise<GetSubjectsResponse> => {
    const request: GetSubjectsRequest = {
        page: 1,
        pageSize: 20,
    };
    const response = await getSubjects(request);
    return response.data
}

// 删除科目
export const deleteSubject = async (request: DelSubjectRequest): Promise<BaseResponse<DelSubjectResponse>> => {
    const url = '/api/delSubject';
    const response = await post<BaseResponse<DelSubjectResponse>>(url, request);
    return response.data
};

// 更新科目
export const updateSubject = async (request: UpdateSubjectRequest): Promise<BaseResponse<UpdateSubjectResponse>> => {
    const url = '/api/updateSubject';
    const response = await post<BaseResponse<UpdateSubjectResponse>>(url, request);
    return response.data
};