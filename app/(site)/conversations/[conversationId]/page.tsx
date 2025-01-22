// "use client"

// import { useCurrentUser } from "@/hooks/use-current-user";
// import { useParams } from 'next/navigation';
// import { useState, useEffect } from "react";
// import { Conversation } from "@prisma/client";

// type ConversationWithFiles = Conversation & {
//   files: File[]
// }

// interface Chat {
//   name: string;
//   chat: string;
// }

// const Page = () => {
//     const user = useCurrentUser();
//     const { conversationId } = useParams();
//     const [documents, setDocuments] = useState<ConversationWithFiles>();
//     const [messages, setMessages] = useState([]);
//     const [chats, setChats] = useState<Chat[]>([]);
//     const [query, setQuery] = useState("");
//     const [loading,setLoading] = useState(false);

//     const queryHandler = async () => {
//       try {
//         setLoading(true);
//         setQuery("");
//         setChats((prev) => [...prev, {name: "user", chat: query}]);
  
//         const response = await fetch(`/api/chat?user=${user?.name}&query=${query}`, {
//           method: "GET",
//           headers: {
//             'Accept': 'application/json'
//           }
//         });
  
//         if (!response.ok) {
//           setLoading(false);
//           setChats((prev) => [...prev, {name: "system", chat: "An error from client occurred"}]);
//           return;
//         }
  
//         const result = await response.json();
//         setChats((prev) => [...prev, {name:"system", chat: result}]);
//       } catch (error) {
//         setChats((prev) => [...prev, {name: "system", chat: "An error occurred"}]);
//       }finally{
//         setLoading(false);
//       }
//     }

// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/conversations/singleconv?conversationId=${conversationId}`);
//         const result = await response.json();
//         setDocuments(result);
//         setMessages(result.messages);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [messages]);

//     return (
//       <div className='text-white'>
//         <div className='flex justify-center items-center'>
//           <h1 className='text-2xl'>Conversation Name: {documents?.title}</h1>
          
//         </div>
//       </div>
//     );
// }

// export default Page;

"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { VscSend } from "react-icons/vsc";
import { CgFileAdd } from "react-icons/cg";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import { createWorker } from 'tesseract.js';
import { Loader2 } from "lucide-react";
import { useParams } from 'next/navigation';
import { Conversation } from "@prisma/client";

type ConversationWithFiles = Conversation & {
  files: File[]
}

type Props = {};

interface Chat {
  role: string;
  content: string;
}

type ImageData = {
  page: number;
  index: number;
  extension: string;
  data: string; // Base64-encoded string
};

const Page = (props: Props) => {
  const user = useCurrentUser();
  const { conversationId } = useParams();
  const [documents, setDocuments] = useState<ConversationWithFiles>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [query, setQuery] = useState("");
  const [loading,setLoading] = useState(false);
  const [upload, setUpload] = useState(false);

  const handleDivClick = () => {
    fileInputRef.current!.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpload(true);
    if (e.target.files!.length > 0) {
      const files = e.target.files;
      const formData = new FormData();
      for(let i = 0 ; i < files!.length; i++){
        formData.append("files", e.target.files![i]);
      }
      const username = user?.name || "guest"
      formData.append("user", username);
      formData.append("conversationId", Array.isArray(conversationId) ? conversationId.join('') : conversationId);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      let result
      if(response.ok){
        result = await response.json();
      }
      const imgs = result.images;

      const worker = await createWorker();
      let imgText = []
      if(imgs){
        for(let i = 0; i < imgs.length; i++){
          // Decode Base64 to binary
          const binaryString = atob(imgs[i].data);
          const binaryLength = binaryString.length;
          const binaryArray = new Uint8Array(binaryLength);
  
          for (let i = 0; i < binaryLength; i++) {
            binaryArray[i] = binaryString.charCodeAt(i);
          }
          // Create a Blob
          const blob = new Blob([binaryArray], { type: 'image/png' }); 
          const ret = await worker.recognize(blob);
          imgText.push(ret.data.text)
        }
      }

      formData.append("imgText", JSON.stringify(imgText));
      await fetch("/api/imageUpload", {
        method : "POST",
        body: formData,
      })
      await worker.terminate();
    } else {
      console.log("No file uploaded");
    }
    setUpload(false);
  };

  const queryHandler = async () => {
    try {
      setLoading(true);
      setQuery("");
      setChats((prev) => [...prev, {role: "user", content: query}]);

      const response = await fetch(`/api/chat?user=${user?.name}&query=${query}&conversationId=${conversationId}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        setLoading(false);
        setChats((prev) => [...prev, {role: "system", content: "An error from client occurred"}]);
        return;
      }

      const result = await response.json();
      setChats((prev) => [...prev, {role:"system", content: result}]);
    } catch (error) {
      setChats((prev) => [...prev, {role: "system", content: "An error occurred"}]);
    }finally{
      setLoading(false);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      queryHandler();
    }
  };

  useEffect(() => {
    // Automatically scroll to the target div when the page loads
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/conversations/singleconv?conversationId=${conversationId}`);
        const result = await response.json();
        setDocuments(result);
        setChats(result.messages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const targetDiv = document.getElementById('targetDiv');
    targetDiv?.scrollIntoView({
      behavior: 'smooth', // Smooth scrolling
      block: 'end', // Align the div to the bottom of the viewport
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 text-2xl text-white flex-grow justify-between m-2 mb-2 min-h-full">
      <div className="flex justify-between itmes-center h-full gap-2">
        {/* <div className="flex flex-col justify-center items-center w-1/2 bg-white text-sm text-black rounded-xl h-full">
          {pdfText == "" ? <div
            onClick={handleDivClick}
            className="flex flex-col justify-center items-center w-1/2 h-1/2 border border-dashed rounded-lg border-zinc-600 bg-red-100 cursor-pointer"
          >
            <CgFileAdd className="text-2xl cursor-pointer" title="Add File" />
            <span className="font-semibold text-lg">Upload</span>
            <p className="text-zinc-500"> or drag and drop your file</p>
            <p className="text-zinc-500 text-xs text-center">{fileName}</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div> : <div className="max-h-full overflow-y-scroll p-2">{pdfText}</div>}
        </div> */}
        <div className="flex flex-col justify-center itmes-center h-full w-full">
          <h1 className="m-4 font-sans text-center flex-1">
            Good to see you, <span className="font-bold">{user?.name}!</span>{" "}
            What can we discover in your PDF today?
          </h1>
          {chats.length == 0 ? <div className="flex justify-center items-center gap-5 flex-grow mb-10">
            <div className="flex flex-col justify-center items-center text-sm text-center p-4 w-48 gap-2 border border-gray-500 rounded-lg">
              <h3 className="font-bold">Step-1 : Upload</h3>
              <p>
                Click Upload and add your PDF. Your file stays secure and
                private.
              </p>
            </div>
            <div className="flex flex-col justify-center items-center text-sm text-center p-4 w-48 gap-2 border border-gray-500 rounded-lg">
              <h3 className="font-bold">Step-2 : Ask</h3>
              <p>
                Type your question in the chatbox to get instant answers from
                your PDF..
              </p>
            </div>
            <div className="flex flex-col justify-center items-center text-sm text-center p-4 w-48 gap-2 border border-gray-500 rounded-lg">
              <h3 className="font-bold">Step-3 : Explore</h3>
              <p>
                Refine your queries, ask follow-up questions, and uncover
                insights easily.
              </p>
            </div>
          </div> : 
          <div className="max-h-full overflow-y-auto scrollbar-thin scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-gray-400 scrollbar-track-gray-700">
          <div className="flex flex-col justify-end mx-auto mt-auto m-2 w-3/5 text-gray-700">
            {chats.map((chat,index) => (
              <div key={index} className={`flex mb-2 gap-3 ${chat.role !== "system" && "justify-end"}`}>
                {chat.role == "system" && 
                  <Avatar>
                    <AvatarImage src="./ai_avatar.jpg" />
                    <AvatarFallback className="bg-sky-500">
                      <FaUser className="text-white" />
                    </AvatarFallback>
                  </Avatar> 
                }
                <div className={`flex p-2 px-4 text-base text-black rounded-2xl ${chat.role !== "system" && "justify-end bg-emerald-500 rounded-br-none"} ${chat.role == "system" && "bg-stone-800 text-white rounded-tl-none mb-2 w-10/12"}`}>
                  <ReactMarkdown className="prose">{chat.content}</ReactMarkdown>
                </div>
                {chat.role !== "system" && 
                  <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-sky-500">
                      <FaUser className="text-white" />
                    </AvatarFallback>
                  </Avatar> 
                }
              </div>
            ))}
            {loading && 
              <div className="flex space-x-4 w-10/12 mb-2">
                <Avatar>
                    <AvatarImage src="./ai_avatar.jpg" />
                    <AvatarFallback className="bg-sky-500">
                      <FaUser className="text-white" />
                    </AvatarFallback>
                  </Avatar> 
                <div className="flex-1">
                  <Skeleton className="h-4 mb-2 rounded-lg bg-white animate-pulse" /> {/* Message text */}
                  <Skeleton className="h-4 mb-2 rounded-lg bg-white animate-pulse" /> {/* Message text */}
                  <Skeleton className="h-4 w-5/6 mb-2 rounded-lg bg-gray-50 animate-pulse" /> {/* Message text */}
                  <Skeleton className="h-4 w-4/6 rounded-lg bg-gray-100 animate-pulse" /> {/* Timestamp */}
                </div>
              </div>
            }
          </div>
          </div>
          }
          
          <div id="targetDiv" className="flex gap-2 justify-center items-center w-full">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple
              onChange={handleFileChange}
             />
            <div className="flex gap-2 justify-center items-center w-full">
              <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>{upload == true ? <Loader2 className="animate-spin"/> :<CgFileAdd className="cursor-pointer text-gray-300 hover:scale-110 hover:text-white transition ease-in-out duration-300" onClick={handleDivClick}/>}</TooltipTrigger>
                    <TooltipContent>
                      <p className="p-1">Upload PDFs Here</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Curious about your document? Start asking!"
                className="h-10 px-5 text-base bg-gray-50 rounded-2xl w-3/5 text-gray-700 focus:outline-none placeholder:text-gray-400 placeholder:italic placeholder:font-sans"
              />
              <button disabled = {query == "" ? true : false} onClick={queryHandler}>
                <VscSend className={`transition ease-in-out duration-300 ${query == "" ? "text-gray-700" : "text-gray-400 hover:scale-110 hover:text-white"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
