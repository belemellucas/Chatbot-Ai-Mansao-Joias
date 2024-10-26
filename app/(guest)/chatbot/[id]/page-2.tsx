"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphql/queries/queries";
import startNewChat from "@/lib/startNewChat";
import { GetChatbotByIdResponse, Message, MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables } from "@/types/types";
import Messages from "@/components/Messages";

const formSchema = z.object({
  message: z.string().min(2, "Your Message is too short!"), 
});

function ChatbotPage({ params: { id } }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    }
  });

  const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    { variables: { id } }
  );

  const { data } = useQuery<MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables>(
    GET_MESSAGES_BY_CHAT_SESSION_ID, 
    {
      variables: { chat_session_id: chatId },
      skip: !chatId
    }
  );

  useEffect(() => {
    if (data) {
      setMessages(data.chat_sessions.messages);
    }
  }, [data]);

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 

    const newChatId = await startNewChat(name, email, Number(id));
    setChatId(newChatId);
    setLoading(false);
    setIsOpen(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true); 
    const messageContent = values.message;
    form.reset();

    if (!name || !email) {
      setIsOpen(true);
      setLoading(false);
      return; 
    }

    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now(), 
      content: messageContent,
      created_at: new Date().toDateString(),
      chat_session_id: parseInt(chatId),
      sender: "user"
    };

    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: "Thinking...",
      created_at: new Date().toISOString(),
      chat_session_id: parseInt(chatId),
      sender: "ai",
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage
    ]);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, chat_session_id: chatId, chatbot_id: id, content: messageContent }),
      });

      const result = await response.json();
      setMessages((prevMessages) => 
        prevMessages.map((msg) =>
          msg.id === loadingMessage.id ? { ...msg, content: result.content, id: result.id } : msg
        )
      );
    } catch (error) {
      console.error("Error sending message: ", error); 
    }
  }

  return (
    <div className="w-full flex bg-gray-100">
      {/* Modal de informações */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Vamos ajudar você!</h2>
            <p className="text-sm text-gray-600 mb-4">Preciso de alguns detalhes para começar.</p>
            <form onSubmit={handleInformationSubmit}>
              <label className="block text-sm mb-2">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-2 border rounded mb-4"
              />
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@gmail.com"
                className="w-full p-2 border rounded mb-4"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
                {loading ? "Carregando..." : "Continuar"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-blue-500 py-5 px-10 text-white md:rounded-lg flex items-center space-x-4">
          <div className="h-12 w-12 bg-white rounded-full border-2 border-white flex items-center justify-center text-xl font-bold">
            {chatBotData?.chatbots?.name.charAt(0) || "?"}
          </div>
          <div>
            <h1 className="truncate text-lg">{chatBotData?.chatbots?.name}</h1>
            <p className="text-sm text-gray-300">Typically replies Instantly</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 p-4 bg-gray-50">
        {/*  {messages.map((msg) => (
            <div key={msg.id} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}>
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs text-gray-500">{msg.created_at}</span>
            </div>
          ))}*/}
            <Messages
          messages={messages}
          chatbotName={chatBotData?.chatbots?.name || "default-seed"} />

        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center p-4 bg-gray-100 rounded-md">
          <input
            type="text"
            placeholder="Digite uma mensagem..."
            {...form.register("message")}
            className="flex-1 p-2 border rounded mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatbotPage;
