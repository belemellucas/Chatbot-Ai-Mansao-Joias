import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { GET_CHATBOTS_BY_USER } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  Chatbot,
  GetChatbotsByUserData,
  GetChatbotsByUserDataVariables,
} from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ViewChatbots() {
  const { userId } = await auth();

  if (!userId) return;

  const {
    data: { chatbotsByUser },
  } = await serverClient.query<
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariables
  >({
    query: GET_CHATBOTS_BY_USER,
    variables: {
      clerk_user_id: userId,
    },
  });

  const sortedChatbotsByUser: Chatbot[] = [...chatbotsByUser].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex-1 pb-20 p-10">
      <div>Ver chatbots</div>
      <h1 className="text-xl lg:text-3xl font-semibold mb-5">
        Chatbots ativos
      </h1>
      {sortedChatbotsByUser.length === 0 && (
        <div>
          <p>
          Você ainda não criou nenhum chatbots, clique no botão abaixo para
          crie um.
          </p>
          <Link href="/create-chatbot">
            <Button className="bg-[#64b5f5] text-white p-3 rounded-md mt-5">
              Criar Chatbot
            </Button>
          </Link>
        </div>
      )}
      <ul>
        {sortedChatbotsByUser.map((chatbot) => (
          <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
            <li className="relative p-10 border rounded-md max-w-3xl bg-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar seed={chatbot.name} />
                  <h2 className="text-xl font-bold">{chatbot.name}</h2>
                </div>
                <p className="text-xs text-gray-400">
                  Criado: {new Date(chatbot.created_at).toLocaleString()}
                </p>
              </div>
              <hr className="mt-2" />
              <div className="grid grid-cols-2 gap-10 md:gap-5 p-5">
                <h3 className="italic">Características:</h3>
                <ul className="text-xs">
                  {!chatbot.chatbot_characteristics.length && (
                    <p>Nenhuma característica adicionada ainda.</p>
                  )}
                  {chatbot.chatbot_characteristics.map((characteristic) => (
                    <li
                      className="list-disc break-words"
                      key={characteristic.id}
                    >
                      {characteristic.content}
                    </li>
                  ))}
                </ul>

                <h3 className="italic">Nº de Sessão:</h3>
                {chatbot.chat_sessions.length}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ViewChatbots;
