import { BaseResponse, User } from "./dto";
import { post } from "./fetch";

export type Gender = "male" | "female" | "other";

export interface RegisterRequest {
    username?: string; // 用户名（可选，长度 3-20）
    password: string; // 密码（必填，长度 6-50）
    email: string; // 邮箱（必填，需符合邮箱格式）
    phone?: string; // 手机号（可选，需符合手机号格式）
    fullName?: string; // 全名（可选，最大长度 50）
    gender?: 'male' | 'female' | 'other'; // 性别（可选，必须是 male/female/other 之一）
    verificationCode?: string; // 验证码（可选，最大长度 50）
}

export interface RegisterResponse {
    // 假设 dto.User 是一个包含用户信息的接口
    user: User;
}

export interface LoginRequest {
    password: string; // 密码（必填，长度 6-50）
    email?: string; // 邮箱（可选，需符合邮箱格式）
    phone?: string; // 手机号（可选，需符合手机号格式）
}

export interface LoginResponse {
    token: string;
    durationSecond: number;
    user: User;
}

export interface LogoutRequest {
    // 无字段
}

export interface LogoutResponse {
    // 无字段
}

export interface ResetPasswordRequest {
    password: string; // 密码（必填，长度 6-50）
    email: string; // 邮箱（必填，需符合邮箱格式）
    verificationCode?: string; // 验证码（可选，最大长度 50）
}

export interface ResetPasswordResponse {
    // 无字段
}

export interface SendVerificationCodeRequest {
    email: string; // 邮箱（必填，需符合邮箱格式）
    phone?: string; // 手机号（可选，需符合手机号格式）
    timestamp?: number;
}

export interface SendVerificationCodeResponse {
    // 假设没有返回内容，可以根据实际情况调整
}

// 用户登录
export const sendVerificationCode = async (phone: string, email: string): Promise<BaseResponse<SendVerificationCodeResponse>> => {
    const url = '/api/user/sendVerificationCode';

    const request: SendVerificationCodeRequest = {
        email: email,
        phone: phone
    }
    const response = await post<BaseResponse<SendVerificationCodeResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 用户登录
export const login = async (phone: string, email: string, password: string): Promise<BaseResponse<LoginResponse>> => {
    const url = '/api/user/login';

    const request: LoginRequest = {
        password: password,
        email: email,
        phone: phone
    }
    const response = await post<BaseResponse<LoginResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    if (response.data.code === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.data.user)); // 将 Token 存储到 localStorage
        localStorage.setItem("token", response.data.data.token); // 将 Token 存储到 localStorage
    }
    return response.data
};

// 用户登出
export const logout = async (): Promise<BaseResponse<LogoutResponse>> => {
    const url = '/api/user/logout';

    const request: LogoutRequest = {}
    const response = await post<BaseResponse<LogoutResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    localStorage.removeItem("user")
    localStorage.removeItem("token"); // 将 Token 存储到 localStorage
    return response.data
};

export const getUserFromLocalStorage = (): User | null => {
    if (typeof window === 'undefined') {
        console.warn('Attempted to access localStorage in a non-browser environment');
        return null;
    }

    try {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user: User = JSON.parse(userString);
            return user;
        }
    } catch (error) {
        console.error('Failed to read user from localStorage:', error);
    }

    return null;
};

// 用户注册
export const register = async (password: string, email: string, phone: string, fullName: string, gender: 'male' | 'female' | 'other', verificationCode: string): Promise<BaseResponse<RegisterResponse>> => {
    const url = '/api/user/register';
    const request: RegisterRequest = {
        username: "",
        password: password,
        email: email,
        phone: phone,
        fullName: fullName,
        gender: gender,
        verificationCode: verificationCode
    }
    const response = await post<BaseResponse<RegisterResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};

// 重置密码
export const resetPassword = async (password: string, email: string, verificationCode: string): Promise<BaseResponse<ResetPasswordResponse>> => {
    const url = '/api/user/resetPassword';
    const request: ResetPasswordRequest = {
        password: password,
        email: email,
        verificationCode: verificationCode
    }
    const response = await post<BaseResponse<ResetPasswordResponse>>(url, request);
    if (response.status != 200) {
        throw new Error(`network error, ${response.statusText}`)
    }
    return response.data
};