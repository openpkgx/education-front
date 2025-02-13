// src/components/BookTable/types.ts
export interface Book {
    name: string;
    cover: string;
    questionType: string[];
}

export function createData(
    name: string,
    questionType: string[],
    cover?: string,
): Book {
    return { name, questionType, cover: cover || '/static/images/book-cover-1.jpg' };
}