"use client";
import React, { useEffect, useState, useRef } from 'react';
import {
    TextField,
    Button,
    Box,
    Paper,
    Stack,
    Alert,
    Avatar,
    useTheme,
    Typography
} from '@mui/material';
import { ChatAIStreamUrl, getChatAISession, PostMessage } from '@/api/chatai-api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InputAdornment from '@mui/material/InputAdornment';

interface Message {
    id: string;
    sender: string;
    text: string;
}

export default function ChatBox() {
    const theme = useTheme();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    // 初始化SSE连接
    useEffect(() => {
        let currentSessionId = sessionId;
        const initEventSource = async () => {
            try {
                if (!currentSessionId) {
                    const response = await getChatAISession();
                    currentSessionId = response.data.sessionId;
                    setSessionId(currentSessionId);
                }

                if (eventSource) return;

                const es = new EventSource(`${ChatAIStreamUrl}?sessionId=${currentSessionId}`);

                es.onerror = (error) => {
                    console.error('SSE error:', error);
                    setError('Connection error');
                    es.close();
                    setEventSource(null);
                    setLoading(false);
                };

                es.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    setMessages(prev => {
                        const lastMessage = prev[prev.length - 1];
                        const newTextChunk = message.output.text;

                        if (lastMessage?.sender === 'bot') {
                            return [
                                ...prev.slice(0, -1),
                                { ...lastMessage, text: lastMessage.text + newTextChunk }
                            ];
                        }
                        return [...prev, {
                            id: Date.now().toString(),
                            sender: 'bot',
                            text: newTextChunk
                        }];
                    });
                };

                setEventSource(es);
            } catch (err) {
                console.error('Init failed:', err);
                setError('Connection failed');
            }
        };

        initEventSource();

        return () => {
            eventSource?.close();
        };
    }, [eventSource, sessionId]);

    // 自动滚动处理
    const scrollToBottom = () => {
        if (autoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        setAutoScroll(isNearBottom);
    };

    // 发送消息
    const sendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;

        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), sender: 'user', text: messageText }
        ]);
        setInput('');
        setLoading(true);

        try {
            const response = await PostMessage(sessionId, messageText);
            if (response.code !== 200) {
                throw new Error(response.details || "Request failed");
            }
        } catch (err) {
            console.error('Send error:', err);
            setError('Message send failed');
            setMessages(prev => [
                ...prev,
                { id: Date.now().toString(), sender: 'bot', text: '⚠️ Send failed' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        await sendMessage(input.trim());
    };

    return (
        <Box className="w-full h-full m-auto p-2 relative flex flex-col items-center justify-center">
            <Typography variant="h6" sx={{ mb: 2 }}>AI学习助手</Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    width: '100%',
                    flex: 1,
                    overflow: 'auto',
                    bgcolor: 'background.default'
                }}
                onScroll={handleScroll}
            >
                <Stack spacing={2}>
                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            sx={{
                                display: 'flex',
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                                gap: 2,
                                alignItems: 'flex-start'
                            }}
                        >
                            {/* 头像部分 */}
                            <Avatar
                                sx={{
                                    bgcolor: msg.sender === 'user'
                                        ? theme.palette.primary.main
                                        : theme.palette.secondary.main,
                                    flexShrink: 0,
                                    width: 40,
                                    height: 40
                                }}
                            >
                                {msg.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                            </Avatar>

                            {/* 优化后的气泡框 */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    maxWidth: '70%',
                                    position: 'relative',
                                    bgcolor: msg.sender === 'user'
                                        ? theme.palette.primary.main
                                        : theme.palette.grey[100],
                                    color: msg.sender === 'user'
                                        ? theme.palette.primary.contrastText
                                        : theme.palette.text.primary,
                                    overflowWrap: 'break-word',
                                    '& p': { margin: 0 },
                                    // 气泡箭头
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        width: 0,
                                        height: 0,
                                        top: 16,
                                        [msg.sender === 'user' ? 'right' : 'left']: -8,
                                        border: '8px solid transparent',
                                        borderTopColor: msg.sender === 'user'
                                            ? theme.palette.primary.main
                                            : theme.palette.grey[100],
                                        transform: msg.sender === 'user'
                                            ? 'rotate(45deg)'
                                            : 'rotate(-45deg)'
                                    },
                                    // 用户消息阴影
                                    boxShadow: msg.sender === 'user'
                                        ? theme.shadows[2]
                                        : 'none',
                                    // AI消息边框
                                    border: msg.sender === 'bot'
                                        ? `1px solid ${theme.palette.divider}`
                                        : 'none'
                                }}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </Box>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} style={{ height: 1 }} />
                </Stack>
            </Paper>

            {/* 输入区域 */}
            <Box sx={{
                width: '100%',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                '& .MuiInputBase-root': {
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    // 新增输入框边框样式
                    fieldset: {
                        borderColor: theme.palette.divider,
                        transition: theme.transitions.create('border-color')
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.light
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: theme.shadows[1]
                    }
                }
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="请输入您的问题..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={loading}
                    multiline
                    maxRows={4}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <ChatBubbleOutlineIcon
                                    color="action"
                                    sx={{ opacity: 0.6 }}
                                />
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    sx={{
                        minWidth: 48,
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        p: 0,
                        transition: theme.transitions.create(['background-color', 'box-shadow']),
                        '&:hover': {
                            boxShadow: theme.shadows[2],
                            backgroundColor: theme.palette.primary.dark
                        },
                        '&.Mui-disabled': {
                            backgroundColor: theme.palette.action.disabledBackground
                        }
                    }}
                >
                    {loading ? (
                        <CircularProgress
                            size={24}
                            thickness={4}
                            sx={{ color: 'common.white' }}
                        />
                    ) : (
                        <SendIcon
                            sx={{
                                fontSize: 24,
                                transform: 'translateX(2px)'
                            }}
                        />
                    )}
                </Button>
            </Box>

            {/* 错误提示 */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mt: 2,
                        width: '100%',
                        borderRadius: 2
                    }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}
        </Box>
    );
}