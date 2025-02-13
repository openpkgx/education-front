// Marquee.tsx
import React from 'react';

export interface MarqueeProps {
    text: string;
    speed?: string; // 速度，默认为 10s
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = '30s' }) => {
    return (
        <div className="overflow-hidden w-full">
            <div
                className="flex whitespace-nowrap animate-marquee"
                style={{ animationDuration: speed }}
            >
                {/* 第一个文本块 */}
                <div className="inline-block text-sm">{text}</div>
            </div>
        </div>
    );
};

export default Marquee;