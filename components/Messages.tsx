"use client";
import { Message } from "@/types/types";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { UserCircle } from "lucide-react";
import { useEffect, useRef } from "react";

function Messages({ messages, chatbotName} : {
    messages: Message[]; 
    chatbotName: string;
}) {
    const path = usePathname();
    const ref = useRef<HTMLDivElement>(null);

    const isReviewsPage = path.includes("review-sessions");

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth"});
        }
    }, [messages])
    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto space-y-10 px-5 bg-white rounded-lg">
    {messages.map((message) => {


        const isSender = message.sender !== "user";
        const createdAtTimestamp =
          typeof message.created_at === "string"
            ? Date.parse(message.created_at)
            : message.created_at;
        const date = new Date(createdAtTimestamp);
        const formattedTime =
          date instanceof Date && !isNaN(date.getTime())
            ? date.toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Invalid time";
        return (
            <div
                key={message.id}
                className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
            >
                {isReviewsPage && (
                    <p className="absolute -bottom-5 text-xs text-gray-300">
                        enviar {new Date(message.created_at).toLocaleString()}
                    </p>
                )}
                <div className={`chat-image avatar w-10 ${!isSender && "-mr-4"}`}>
                    {isSender ? (
                        <Avatar
                            seed={chatbotName}
                            className="h12 w-12 bg-white rounded-full border-[#2991EE]"
                        />
                    ) : (
                        <UserCircle className="text-[#2991EE]" />
                    )}
                </div>

                    <div className="chat-header">
                  {isSender ? chatbotName : "User"}{" "}
                  <time className="text-xs opacity-50">{formattedTime}</time>
                </div>
                     <div className="chat-bubble bg-[#4D7DFB] text-white">
                  {message.content}
                </div>
                   
                
            </div>
        );
    })}

    <div ref={ref} />
</div>

    )
}

export default Messages