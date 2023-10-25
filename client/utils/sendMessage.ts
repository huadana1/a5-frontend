import { fetchy } from "./fetchy";

export async function sendMessage(to: string, message: string, messageType: string) {
  try {
    await fetchy(`/api/chats/chat/${to}`, "POST", {
      body: { to, message, messageType },
    });
  } catch (_) {
    return;
  }
}
