"use client";
import Avatar from "@/components/Avatar";
//import Messages from "@/components/Messages";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import startNewChat from "@/lib/startNewChat";
import {
  GetChatbotByIdResponse,
  Message,
  MessagesByChatSessionIdResponse,
  MessagesByChatSessionIdVariables,
} from "@/types/types";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserCircle } from "lucide-react";
//import { usePathname } from "next/navigation";

const formSchema = z.object({
  message: z.string().min(2, "Your Message is too short!"),
});

function ChatbotPage({ params: { id } }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  //const path = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  //  const isReviewsPage = path.includes("review-sessions");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    {
      variables: { id },
    }
  );

  const { data } = useQuery<
    MessagesByChatSessionIdResponse,
    MessagesByChatSessionIdVariables
  >(GET_MESSAGES_BY_CHAT_SESSION_ID, {
    variables: { chat_session_id: chatId },
    skip: !chatId,
  });

  useEffect(() => {
    if (data) {
      setMessages(data.chat_sessions.messages);
    }
  }, [data]);

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const chatId = await startNewChat(name, email, Number(id));

    setChatId(chatId);
    setLoading(false);
    setIsOpen(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { message: formMessage } = values;

    const message = formMessage;
    form.reset();

    if (!name || !email) {
      setIsOpen(true);
      setLoading(false);
      return;
    }
    if (!message.trim()) {
      return;
    }

   //const sanitizedName: String = message.replace(/[^a-zA-Z0-9_-]/g, '');
   console.log(message)
    const userMessage: Message = {
      id: Date.now(),
      content: message,
      created_at: new Date().toDateString(),
      chat_session_id: parseInt(chatId),
      sender: "user",
    };

    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: "Pensando...",
      created_at: new Date().toISOString(),
      chat_session_id: parseInt(chatId),
      sender: "ai",
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage,
    ]);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          chat_session_id: chatId,
          chatbot_id: id,
          content: message
        }),
      });

      const result = await response.json();
      // update the loading message for the AI with
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: result.content, id: result.id }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }

  
  return (
    <div className="w-full h-screen flex bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-full md:max-w-[425px] z-50">
          <form onSubmit={handleInformationSubmit}>
            <DialogHeader>
              <DialogTitle>Vamos ajudá-lo!</DialogTitle>
              <DialogDescription>
                Só preciso de alguns detalhes para começar.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Email
                </Label>
                <Input
                  id="username"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@gmail.com"
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={!name || !email || loading}>
                {!loading ? "Continue" : "Carregando..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-[#4D7DFB] py-5 px-10 text-white md: rounded-lg flex items-center space-x-4">
          <Avatar
            seed={chatBotData?.chatbots?.name || "undefined"}
            className="h-12 w-12 bg-white rounded-full border-2 border-white"
          />
          <div>
            <h1 className="truncate text-lg">{chatBotData?.chatbots?.name}</h1>
            <p className="text-sm text-gray-300">
              Normalmente responde instantaneamente
            </p>
          </div>
        </div>
        {/* 

<div className="flex flex-col space-y-4 p-4 bg-gray-50">
        {messages.map((msg) => (
            <div key={msg.id} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}>
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs text-gray-500">{msg.created_at}</span>
            </div>
          ))}
         </div>*/}

        <div className="flex-1 flex flex-col h-full overflow-y-auto space-y-4 p-4 rounded-lg">
          {messages.map((msg) => {
            const isSender = msg.sender !== "user";
            const createdAtTimestamp = typeof msg.created_at === 'string' 
            ? Date.parse(msg.created_at) 
            : msg.created_at;
            const date = new Date(createdAtTimestamp); 
            const formattedTime = date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid time';
            return (
              <div
                key={msg.id}
                className={`chat ${isSender ? "chat-start" : "chat-end"}`}
              >
                <div className="chat-image avatar ">
                  <div className="flex w-10 rounded-full items-end justify-end">
                    {isSender ? (
                      <Avatar
                        seed={chatBotData?.chatbots?.name || "undefined"}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <>
                       <div className="flex items-end justify-end w-10 h-10">
                      <UserCircle 
                      className="text-[#2991EE] h-8 w-8 flex items-end rounded-full" />
                       </div>
                       </>
                       
                    )}
                  </div>
                </div>
                <div className="chat-header">
                  {isSender ? chatBotData?.chatbots?.name : "User"}{" "}
                  <time className="text-xs opacity-50">
                  
                    {formattedTime}
                  </time>
                </div>
                <div className="chat-bubble bg-[#4D7DFB] text-white">
                  {msg.content}
                </div>
                {/* {isReviewsPage && (
          <div className="chat-footer opacity-50">
            {msg.status} 
          </div>
        )} */}
              </div>
            );
          })}
          <div ref={ref} />
        </div>

        <Form {...form}>
          <form
            className="flex items-start sticky bottom-0 z-50 
             space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite uma mensagem..."
                      {...field}
                      className="p-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-full"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Enviar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatbotPage;

{
  /*  <UserInfoModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        onSubmit={handleUserInfoSubmit} 
        loading={loading} 
      />
*/
}
