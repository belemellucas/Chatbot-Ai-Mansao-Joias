"use client"
import { Chatbot } from '@/types/types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar';
import Link from 'next/link';
import ReactTimeago from "react-timeago";

function ChatBotSessions({ chatbots }: {chatbots: Chatbot[]}) {
   const [sortedChatbots, setSortedChatbots] = useState<Chatbot[]>(chatbots);
   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
    const sortedArray = [...chatbots].sort(
        (a, b) => b.chat_sessions.length - a.chat_sessions.length
    ); 
    setSortedChatbots(sortedArray); 
   }, [chatbots]);

    return (
    <div className="bg-white">
      <Accordion type="single" collapsible>
        {sortedChatbots.map((chatbot) => {
            const hasSessions = chatbot.chat_sessions.length > 0; 
            return (
                <AccordionItem key={chatbot.id}
                 value={`item-${chatbot.id}`}
                 className="border-b border-gray-300 px-10 py-5"
                >

                    {hasSessions ? (
                        <>
                          <AccordionTrigger onClick={() => setIsOpen(!isOpen)}>
                             <div className="flex text-left items-center w-full">
                                <Avatar seed={chatbot.name} className="h-10 w-10 mr-4" /> 
                                <div className="flex flex-1 justify-between items-center space-x-4">
                                    <p>{chatbot.name}</p>
                                    <div className="flex items-center space-x-2 ml-auto">
                            <p className="font-bold">{chatbot.chat_sessions.length} sessões</p>
                            <span className="transform transition-transform duration-300">
                              {isOpen ? "▲" : "▼"}
                            </span>
                          </div>
                                   
                                </div>
                             </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-5 p-5 bg-gray-100 rounded-md">
                              {chatbot.chat_sessions.map((session) => (
                                 <Link
                                 href={`/reviews-sessions/${session.id}`}
                                 key={session.id}
                                 className="relative p-10 bg-[#2991EE] text-white rounded-md block"
                               >
                                 <p className="text-lg font-bold">{session.guests?.name || "Anônimo"}</p>
                                 <p className="text-lg font-light">{session.guests?.email || "Nenhum e-mail fornecido"}</p>
                                 <p className="absolute top-5 right-5 text-sm">
                                   <ReactTimeago date={new Date(session.created_at)} />
                                 </p>
                               </Link>
                              ))}
                          </AccordionContent>
                        </>
                    ): (
                       <p className="font-ligth">{chatbot.name} (Sem sessões)</p>
                    )}

                </AccordionItem>
            )
        })}
     </Accordion>   
    </div>
  )
}

export default ChatBotSessions
