export interface Base {
    id?: string;         // 唯一ID
    createdAt?: number;   // 创建时间
    updatedAt?: number;   // 更新时间
    deletedAt?: number;  // 软删除时间
}

export interface PaginationRequest {
    page: number;       // 当前页码
    pageSize: number;   // 每页条数
}

export interface PaginationResponse {
    totalSize: number;  // 总条数
}

export interface Subject extends Base {
    name: string;           // 学科名称
    cover: string;          //学科封面
    questionTypes: string[]; // 学科有哪些题目类型
    description: string;    // 学科描述
}

export interface BaseResponse<T> {
    code: number,
    message: string,
    details: string,
    data: T
}

export interface QuestionOptions {
    a?: string;             // 选项 A
    b?: string;             // 选项 B
    c?: string;             // 选项 C
    d?: string;             // 选项 D
    e?: string;             // 选项 E
    f?: string;             // 选项 F
    g?: string;             // 选项 G
    h?: string;             // 选项 H
    correctAnswer: string[]; // 正确答案
    selectedAnswer: string[];      //已选择的答案
}

export interface Question extends Base {
    questionType: string;       // 题目类型
    content: string;            // 题目内容
    hasOption: boolean;          //是否是选择题, 是：true，否：false
    options: QuestionOptions[]; // 问题选项选项
    optionSize: number;         //问题个数
    subjectId: string;          // 科目ID
    tagIDs: string[];           // 标签ID数组
    analysis: string;           // 题目解析
}

export const QuestionInit = (): Question => {
    return {
        questionType: "",        // 默认题目类型
        content: "",             // 默认题目内容
        hasOption: false,      // 默认不是选择题
        options: [],             // 默认空选项数组
        optionSize: 0,           // 默认问题个数
        subjectId: "",           // 默认科目ID
        tagIDs: [],              // 默认空标签数组
        analysis: "",            // 默认题目解析
    };
};

export interface Tag {
    id?: string;   // 标签唯一ID
    name: string; // 标签名称
    iconsName: string; //标签图标 
    order: number  //标签排序 
}

export interface Topic extends Base {
    id?: string;          //主题ID
    subjectId?: string;   // 所属学科ID
    subjectName?: string; // 所属学科名称
    name: string;        // 主题名称
    iconsName: string;   // 图标名称
    order: number;       // 排序号
    description?: string; // 主题描述
    tags?: Tag[];         // 主题存在的标签
}

export interface ExamQuestionOptions {
    correctAnswer: string[]; // 正确答案
    answers: string[];       // 回答答案
    isCorrect: boolean;      // 是否回答正确
    isAnswered: boolean;               // 是否已答
    score: number;           // 分数
}

export interface ExamQuestion {
    questionId: string;                // 题目ID
    questionType: string;              // 题目类型
    isAnswered: boolean;               // 是否已答
    isCorrect: boolean;      // 是否回答正确
    questionOptions: ExamQuestionOptions[]; // 回答选项
}
export const ExamQuestionrInit = (): ExamQuestion => {
    return {
        questionId: "",   //题目ID
        questionType: "",          // 题目类型
        isAnswered: false,            // 是否已答
        isCorrect: false,    // 是否回答正确
        questionOptions: [],     // 回答选项
    };
};

// 试卷详情
export interface ExamPaper extends Base {
    name: string;
    userId: string;           // 用户ID
    topicId: string;          // 主题ID
    tagId: string;            // 标签ID
    answeredCount: number;    // 已做题数
    totalCount: number;       // 总题数
    totalScore: number;       // 总分
    correctScore: number;     // 正确得分
    questions: ExamQuestion[]; // 试题列表
}

export const ExamPaperInit = (): ExamPaper => {
    return {
        name: "",
        userId: "",          // 用户ID
        topicId: "",        //主题ID
        tagId: "",            // 标签ID
        answeredCount: 0,    // 已做题数
        totalCount: 0,     // 总题数
        totalScore: 0,   // 总分
        correctScore: 0,   // 正确得分
        questions: [] // 试题列表
    };
};

// 试卷简约详情概览
export interface ExamPaperSample extends Base {
    name: string;
    userId: string;           // 用户ID
    topicId: string;          // 主题ID
    tagId: string;            // 标签ID
    answeredCount: number;    // 已做题数
    totalCount: number;       // 总题数
    totalScore: number;       // 总分
    correctScore: number;     // 正确得分
}

export interface User extends Base {
    username: string; // 用户名（唯一）
    password?: never; // 密码（不返回给前端，使用 never 表示不存在）
    email: string; // 邮箱（唯一）
    phone?: string; // 手机号（可选）
    fullName?: string; // 全名（可选）
    avatarUrl?: string; // 头像URL（可选）
    gender?: string; // 性别（可选）
    isActive: boolean; // 用户是否激活
    lastLoginAt?: number; // 上次登录时间（可选）
    isAdmin?: boolean;
}

export interface Favorite extends Base {
    name: string;
    topicId: string; // 主题ID
    tagId: string;   // 标签ID
    order: number;   // 排序号
    questionCount: number; // 试题数量
}
