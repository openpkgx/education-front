import { pages } from "next/dist/build/templates/app-page";
import { BaseResponse, Favorite, PaginationRequest, PaginationResponse } from "./dto";
import { post } from "./fetch";

// AddFavorite相关接口
export interface AddFavoriteRequest {
    topicId: string;
    tagId: string;
    questionId: string;
}

interface AddFavoriteResponse {
    topicId: string;
    tagId: string;
    questionId: string;
}

// DelFavorite相关接口
interface DelFavoriteRequest {
    topicId: string;
    tagId: string;
    questionId: string;
}

interface DelFavoriteResponse { }

// GetFavorites相关接口
interface GetFavoritesRequest extends PaginationRequest { }

interface GetFavoritesResponse extends PaginationResponse {
    favorites: Favorite[];
}

// 添加收藏
export const addFavorite = async (topicId: string, tagId: string, questionId: string): Promise<BaseResponse<AddFavoriteResponse>> => {
    const url = '/api/favorite/add';

    const request: AddFavoriteRequest = {
        topicId: topicId,
        tagId: tagId,
        questionId: questionId,
    }
    const response = await post<BaseResponse<AddFavoriteResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 取消收藏
export const delFavorite = async (topicId: string, tagId: string, questionId: string): Promise<BaseResponse<DelFavoriteResponse>> => {
    const url = '/api/favorite/del';

    const request: DelFavoriteRequest = {
        topicId: topicId,
        tagId: tagId,
        questionId: questionId,
    }
    const response = await post<BaseResponse<DelFavoriteResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 获取收藏记录
export const getFavoriteRecord = async (page: number, pageSize: number): Promise<BaseResponse<GetFavoritesResponse>> => {
    const url = '/api/favorite/getRecord';

    const request: GetFavoritesRequest = {
        page: page,
        pageSize: pageSize
    }
    const response = await post<BaseResponse<GetFavoritesResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};