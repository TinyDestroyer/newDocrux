"use client"

import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { Conversation } from "@prisma/client";

type ConversationWithFiles = Conversation & {
  files: File[]
}

const Page = () => {
    const { conversationId } = useParams();
    const [documents, setDocuments] = useState<ConversationWithFiles>();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`/api/conversations/singleconv?conversationId=${conversationId}`);
            const result = await response.json();
            setDocuments(result);
            setMessages(result.messages);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [messages]);

    return <div className='text-white'>{documents?.title}</div>
}

export default Page;