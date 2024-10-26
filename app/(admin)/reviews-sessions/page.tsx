import ChatBotSessions from "@/components/ChatBotSessions";
import { GET_USER_CHATBOTS } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  Chatbot,
  GetUserChatbotsResponse,
  GetUserChatbotsVariables,
} from "@/types/types";
import { auth } from "@clerk/nextjs/server";

async function ReviewSessions() {
  const { userId } = await auth();
  if (!userId) return;

  const {
    data: { chatbotsByUser },
  } = await serverClient.query<
    GetUserChatbotsResponse,
    GetUserChatbotsVariables
  >({
    query: GET_USER_CHATBOTS,
    variables: { clerk_user_id: userId },
  });

  const sortedChatbotsByUser: Chatbot[] = chatbotsByUser.map((chatbot) => ({
    ...chatbot,
    chat_sessions: [...chatbot.chat_sessions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  }));

  return (
    <div className="flex-1 px-10">
      <h1 className="text-xl lg:text-3xl font-semibold mt-10">
        Sessões de bate-papo
      </h1>
      <h2 className="mb-5">
        Revise todas as sessões de chat que os chatbots tiveram com seus
        clientes.
      </h2>
      <ChatBotSessions chatbots={sortedChatbotsByUser} />
    </div>
  );
}

export default ReviewSessions;
