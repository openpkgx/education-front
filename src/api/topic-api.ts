import Snackbar from "@mui/material/Snackbar";
import { Topic, Tag, BaseResponse } from "./dto";
import { post } from "./fetch";
import { CreateSubjectResponse } from "./subject-api";

export interface CreateTopicRequest {
    subjectId: string;
    topics: Topic[];
}

export interface CreateTopicResponse {
    succeeded: Topic[];
    failedInfo: string;
}

export interface GetTopicRequest {
    subjectId: string;
}

export interface GetTopicResponse {
    topics: Topic[];
}

export interface UpdateTopicRequest {
    id: string;
    name?: string; // 使用可选属性表示指针类型
}

export interface UpdateTopicResponse {
    // 空接口，没有字段
}

export interface DeleteTopicRequest {
    id: string;
}

export interface DeleteTopicResponse {
    // 空接口，没有字段
}

export interface AddTopicTagsRequest {
    topicId: string;
    tags: Tag[];
}

export interface AddTopicTagsResponse {
    succeeded: Tag[];
}

export interface DelTopicTagsRequest {
    topicId: string;
    tags: Tag[];
}

export interface DelTopicTagsResponse {
    failed: string[];
}

// 创建主题
export const createTopic = async (subjectId: string, name: string, iconsName: string, order: number): Promise<BaseResponse<CreateTopicResponse>> => {
    const url = '/api/createTopic';

    const request: CreateTopicRequest = {
        subjectId: subjectId,
        topics: [
            {
                name: name,
                iconsName: iconsName,
                order: order
            }
        ],
    }
    const response = await post<BaseResponse<CreateTopicResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 获取主题
export const getTopic = async (subjectId: string): Promise<BaseResponse<GetTopicResponse>> => {
    const url = '/api/getTopic';

    const request: GetTopicRequest = {
        subjectId: subjectId
    }
    const response = await post<BaseResponse<GetTopicResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 删除主题
export const deleteTopic = async (topicId: string): Promise<BaseResponse<DeleteTopicResponse>> => {
    const url = '/api/delTopic';

    const request: DeleteTopicRequest = {
        id: topicId
    }
    const response = await post<BaseResponse<DeleteTopicResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 创建主题标签
export const createTopicTags = async (topicId: string, name: string, iconsName: string, order: number): Promise<BaseResponse<AddTopicTagsResponse>> => {
    const url = '/api/createTopicTags';

    const request: AddTopicTagsRequest = {
        topicId: topicId,
        tags: [
            {
                name: name,
                iconsName: iconsName,
                order: order
            }
        ],
    }
    const response = await post<BaseResponse<AddTopicTagsResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 删除主题标签
export const deleteTopicTags = async (topicId: string, tagId: string): Promise<BaseResponse<AddTopicTagsResponse>> => {
    const url = '/api/delTopicTags';

    const request: DelTopicTagsRequest = {
        topicId: topicId,
        tags: [
            {
                id: tagId,
                name: "",
                iconsName: "",
                order: 0
            }
        ],
    }
    const response = await post<BaseResponse<AddTopicTagsResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};