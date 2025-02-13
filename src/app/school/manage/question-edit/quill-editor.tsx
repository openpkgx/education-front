"use client";
import React, { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css';
import { Upload } from '@/api/file-api';

interface QuillEditorProps {
    initialContent?: string; // 初始内容
    onContentChange?: (content: string) => void; // 内容变化的回调函数
}

const QuillEditor: React.FC<QuillEditorProps> = ({ initialContent = '', onContentChange }) => {
    const [Quill, setQuill] = useState<any>(null); // 保存 Quill 构造函数
    const [editorId, setEditorId] = useState<string>(''); // 保存唯一的编辑器 ID
    const quillRef = useRef<any>(null); // 保存 Quill 实例
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 用于 debounce 的 timeout

    // 动态加载 Quill
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('quill')
                .then((module) => {
                    setQuill(() => module.default);
                })
                .catch((error) => {
                    console.error('Failed to load Quill:', error);
                });
        }
    }, []);

    // 在客户端渲染时生成唯一的编辑器 ID
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setEditorId(`editor-${Math.random().toString(36).substr(2, 9)}`);
        }
    }, []);

    const isValidImageUrl = (url: string) => {
        // 简单的正则表达式检查URL是否为图片
        const pattern = /\.(jpeg|jpg|gif|png)$/i;
        return pattern.test(url);
    };

    // 初始化 Quill 编辑器
    useEffect(() => {
        if (Quill && editorId && !quillRef.current) { // 确保 Quill 实例只初始化一次
            // 动态加载图片调整插件
            // @ts-ignore
            import('quill-image-resize-module-react')
                .then((module) => {
                    const ImageResize = module.default;

                    // 注册图片调整模块
                    Quill.register('modules/imageResize', ImageResize);

                    // 初始化 Quill 编辑器，使用唯一的 ID
                    const quillInstance = new Quill(`#${editorId}`, {
                        theme: 'snow',
                        modules: {
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ header: [1, 2, 3, false] }],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'image'],
                                ['clean'],
                            ],
                            imageResize: {
                                // 图片调整模块配置
                                modules: ['Resize', 'DisplaySize'], // 启用调整大小和显示尺寸功能
                            },
                        },
                        placeholder: '请输入内容...',
                    });

                    quillInstance.root.style.height = '250px';

                    // 设置初始内容
                    if (initialContent) {
                        // quillInstance.root.innerHTML = initialContent;
                        quillInstance.clipboard.dangerouslyPasteHTML(0, initialContent); // 使用 dangerouslyPasteHTML

                    }

                    //quillInstance.root.innerHTML = testhtml;

                    quillRef.current = quillInstance;

                    // 监听内容变化
                    const handleTextChange = () => {
                        const content = quillInstance.root.innerHTML;

                        // 使用 debounce 减少回调频率
                        if (debounceTimeoutRef.current) {
                            clearTimeout(debounceTimeoutRef.current);
                        }

                        debounceTimeoutRef.current = setTimeout(() => {
                            if (onContentChange) {
                                onContentChange(content); // 触发回调
                            }
                        }, 300); // 300ms 延迟
                    };

                    quillInstance.on('text-change', handleTextChange);
                    // 添加图片上传功能
                    const toolbar = quillInstance.getModule('toolbar');
                    toolbar.addHandler('image', () => {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.click();

                        input.onchange = async () => {
                            if (!input.files || input.files.length === 0) {
                                console.warn('No files selected.');
                                return;
                            }

                            const file = input.files[0];
                            if (file) {
                                const formData = new FormData();
                                formData.append('file', file);

                                try {
                                    // 发送图片到服务器并获取返回的图片URL
                                    const response = await Upload(formData);

                                    const imageUrl = "";

                                    // 插入图片到编辑器
                                    const range = quillInstance.getSelection();
                                    quillInstance.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER);
                                } catch (error) {
                                    console.error('Error uploading image:', error);
                                }
                            }
                        };
                    });
                    // 清理函数
                    return () => {
                        quillInstance.off('text-change', handleTextChange); // 移除事件监听器
                        quillRef.current = null;
                        if (debounceTimeoutRef.current) {
                            clearTimeout(debounceTimeoutRef.current);
                        }
                    };
                })
                .catch((error) => {
                    console.error('Failed to load image resize module:', error);
                });
        }
    }, [Quill, editorId, initialContent, onContentChange]);


    if (!editorId) {
        return null; // 在 editorId 生成之前不渲染任何内容
    }

    return (
        <div className='flex flex-col w-full h-[250px]'>
            <div id={editorId} />
        </div>
    );
};

export default QuillEditor;