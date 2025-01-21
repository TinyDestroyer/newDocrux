import { db } from "@/lib/db";

export const getConversations = async (userId: string) => {
  try {
    const conversations = await db.conversation.findMany({
        where: {
            userId
        },
        include: {
            files: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return conversations;
  } catch {
    return null;
  }
};

export const getSingleConversation = async (conversationId: string) => {
  try {
    const conversations = await db.conversation.findUnique({
        where: {
            id:conversationId
        },
        include: {
            files: true,
            messages: true,
        }
    });

    return conversations;
  } catch {
    return null;
  }
};