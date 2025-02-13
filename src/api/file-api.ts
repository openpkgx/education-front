import { BaseResponse } from "./dto";
import { baseUrl, post } from "./fetch";

export const uploadFile = () => {
    return baseUrl + "/api/file/upload";
};

// UploadResponse 对应的 TypeScript 接口
export interface UploadResponse {
    fileKey: string;  // 临时文件的key
    checksum: string; // 文件MD5校验码
}

// UploadCompletedRequest 对应的 TypeScript 接口
export interface UploadCompletedRequest {
    fileKey: string;    // 临时文件的key
    source: string;
    externalId: string;
}

// UploadCompletedResponse 对应的 TypeScript 接口
export interface UploadCompletedResponse {
    // 这个接口在 Go 中是空的，因此在 TypeScript 中也可以保持为空
}

export const Upload = async (formData: FormData): Promise<BaseResponse<UploadCompletedResponse>> => {
    const url = '/api/file/upload';

    // const request: Request = {
    //     body: formData,
    // }
    const response = await post<BaseResponse<UploadCompletedResponse>>(url, formData);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};