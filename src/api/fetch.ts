type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

export interface RequestOptions {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    timeout?: number; // 超时时间
    retries?: number; // 重试次数
    signal?: AbortSignal; // 支持手动取消请求
}

export interface ApiConfig {
    baseUrl?: string;
    defaultTimeout?: number;
    defaultRetries?: number;
}
//export const baseUrl = "http://127.0.0.1:8080";
export const baseUrl = "https://120.79.85.104/education-backend";

const DEFAULT_CONFIG: ApiConfig = {
    // baseUrl: 'https://120.79.85.104/education-backend',
    baseUrl: baseUrl,
    defaultTimeout: 120 * 1000, // 默认超时时间 10 秒
    defaultRetries: 1, // 默认重试次数
};

/**
 * 获取 token
 */
const getToken = (): string | null => {
    try {
        const token = localStorage.getItem('token');
        return token;
    } catch (error) {
        console.error('Failed to read token from localStorage:', error);
    }
    return null;
};

/**
 * 处理响应
 */
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({})); // 防止解析失败
        throw new Error(error.message || `HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return {
        data,
        status: response.status,
        statusText: response.statusText,
    };
};

/**
 * 封装 fetch
 */
const fetchApi = async <T>(
    url: string,
    options: RequestOptions = {},
    config: ApiConfig = DEFAULT_CONFIG
): Promise<ApiResponse<T>> => {
    const { baseUrl, defaultTimeout, defaultRetries } = config;
    const { timeout = defaultTimeout, retries = defaultRetries ?? 0, signal, ...fetchOptions } = options;

    // 根据 body 类型确定 Content-Type
    let headers: Record<string, string> = {};
    if (!(fetchOptions.body instanceof FormData)) {
        headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
    } else {
        headers = {
            ...options.headers,
        };
    }

    // 如果是非登录接口，添加 token
    if (!url.includes('/login')) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `${token}`;
        }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchWithRetry = async (attempt: number): Promise<ApiResponse<T>> => {
        try {
            const response = await fetch(`${baseUrl}${url}`, {
                ...fetchOptions,
                headers,
                signal: signal || controller.signal, // 支持外部传入的 signal
            });

            clearTimeout(timeoutId); // 清除超时计时器
            return handleResponse<T>(response);
        } catch (error) {
            clearTimeout(timeoutId); // 清除超时计时器

            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new Error(`Request timed out after ${timeout}ms`);
            }

            if (attempt < retries) {
                console.warn(`Retrying request (${attempt + 1}/${retries})...`);
                return fetchWithRetry(attempt + 1); // 重试请求
            }

            throw new Error(`Request failed after ${retries} attempts: ${error}`);
        }
    };

    return fetchWithRetry(0);
};

/**
 * GET 请求
 */
export const get = async <T>(url: string, options?: RequestOptions, config?: ApiConfig): Promise<ApiResponse<T>> => {
    return fetchApi<T>(url, { ...options, method: 'GET' }, config);
};

/**
 * POST 请求
 */
export const post = async <T>(
    url: string,
    body: any,
    options?: RequestOptions,
    config?: ApiConfig
): Promise<ApiResponse<T>> => {
    return fetchApi<T>(url, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }, config);
};

/**
 * PUT 请求
 */
export const put = async <T>(
    url: string,
    body: any,
    options?: RequestOptions,
    config?: ApiConfig
): Promise<ApiResponse<T>> => {
    return fetchApi<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }, config);
};

/**
 * DELETE 请求
 */
export const del = async <T>(url: string, options?: RequestOptions, config?: ApiConfig): Promise<ApiResponse<T>> => {
    return fetchApi<T>(url, { ...options, method: 'DELETE' }, config);
};

/**
 * 手动取消请求示例
 */
export const createAbortController = (): AbortController => {
    return new AbortController();
};