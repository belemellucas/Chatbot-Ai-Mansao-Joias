import client from "@/graphql/apolloClient";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "@/graphql/mutations/mutations";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  try {
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: {
        name: guestName,
        email: guestEmail,
        created_at: new Date().toISOString(),
      },
    });

    // const guestId = guestResult.data.insertGuests.id;
    const guestIdInt = parseInt(guestResult.data.insertGuests.id);
    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        chatbot_id: chatbotId,
        guest_id: guestIdInt,
        created_at: new Date().toISOString(),
      },
    });
    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;
    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: "ai",
        content: `Bem-vindo ${guestName}! \n Como posso ajudá-lo hoje?`,
        created_at: new Date().toISOString(),
      },
    });

    console.log("Now chat session started successfully");
    return chatSessionId;
  } catch (error) {
    console.error("Error starting new chat session:", error);
  }
}

export default startNewChat;