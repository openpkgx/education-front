import React from "react";
import * as MUIIcons from '@mui/icons-material'; // 导入所有图标
import { parsePhoneNumberFromString } from "libphonenumber-js";
import validator from "validator";

// export interface Tag {
//     id: string;
//     name: string;
//     iconsName: string;
//     order: number;
//     children: Tag[];
// }

// export function createData(
//     id: string,
//     name: string,
//     iconsName: string,
//     order: number,
//     children: Tag[] = []
// ): Tag {
//     return { id, name, iconsName, order, children };
// }
//export function findTagById(tags: Tag[], id: string): Tag | null {
//     for (const tag of tags) {
//         if (tag.id === id) return tag;
//         if (tag.children.length > 0) {
//             const found = findTagById(tag.children, id);
//             if (found) return found;
//         }
//     }
//     return null;
// }
// 

export function renderIcon(iconsName: string) {
    const IconComponent = iconsName ? MUIIcons[iconsName as keyof typeof MUIIcons] : null;
    return IconComponent ? React.createElement(IconComponent) : "无图标";
}

export function areStringsEqualIgnoreCase(str1: string, str2: string): boolean {
    return str1.toLowerCase() === str2.toLowerCase();
}

export function areArraysEqualIgnoreCase(str1: string[], str2: string[]): boolean {
    if (!str1 || !str2) {
        return false
    }
    // 如果数组长度不同，直接返回 false
    if (str1.length !== str2.length) {
        return false;
    }

    // 遍历数组，逐个比较元素（不区分大小写）
    for (let i = 0; i < str1.length; i++) {
        if (str1[i].toLowerCase() !== str2[i].toLowerCase()) {
            return false; // 如果有任意一个元素不相等，返回 false
        }
    }

    // 如果所有元素都相等，返回 true
    return true;
}

export function isPhoneNumber(phone: string): boolean {
    const phoneNumber = parsePhoneNumberFromString(phone);
    return phoneNumber ? phoneNumber.isValid() : false;
}

export function isEmail(email: string): boolean {
    return validator.isEmail(email);
}