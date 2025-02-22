import React from 'react'
import ChatBox from './chat-box'

export default function page() {
    return (
        <div className="w-full relative h-full">
            <div className="w-full h-[calc(100%-100px)] max-w-[1000px]">
                <ChatBox></ChatBox>
            </div>
        </div>
    )
}
