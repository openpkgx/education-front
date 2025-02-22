import { BaseResponse } from "./dto";
import { baseUrl, post } from "./fetch";

// 定义 GetChatAISession 请求接口
export interface GetChatAISessionReq {
}

// 定义 GetChatAISession 响应接口
export interface GetChatAISessionResponse {
    sessionId: string;
}

// 定义 PostMessage 请求接口
export interface PostMessageReq {
    sessionId: string;
    text: string;
}

// 定义 PostMessage 响应接口
export interface PostMessageResponse {
    sessionId: string;
}

export const ChatAIStreamUrl = baseUrl + "/api/ai/chatSteam";

export const getChatAISession = async (): Promise<BaseResponse<GetChatAISessionResponse>> => {
    const url = '/api/ai/getSession';

    const request: GetChatAISessionReq = {}
    const response = await post<BaseResponse<GetChatAISessionResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

export const PostMessage = async (sessionId: string, text: string): Promise<BaseResponse<PostMessageResponse>> => {
    const url = '/api/ai/postMessage';

    const request: PostMessageReq = {
        text: text,
        sessionId: sessionId
    }
    const response = await post<BaseResponse<PostMessageResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};