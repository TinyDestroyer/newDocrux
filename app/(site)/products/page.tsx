"use client"

import React from "react";
import { useState, useEffect } from "react";
import { Document, Page } from 'react-pdf';
import { useCurrentUser } from "@/hooks/use-current-user";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { X,Ghost, Trash2, Upload,FileText } from "lucide-react";
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorker } from 'tesseract.js';
import { Conversation } from "@prisma/client";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {};

type FileType = {
  id: string;
  createdAt: Date;
  name: string;
  url: string; // Explicitly define the `url` field
  size: number;
  type: string;
  conversationId: string;
};

type ConversationWithFiles = Conversation & {
  files: FileType[]
}

const Docs = (props: Props) => {
  const user = useCurrentUser();
  const cloudinaryUrl = "https://res.cloudinary.com/docrux/raw/upload/v1737292407/vnyexwbfnotxxfzdkm40";
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  const [documents, setDocuments] = useState<ConversationWithFiles[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      files.forEach(file => {
        formData.append('files', file);
      });
      const username = user?.name || "guest"
      formData.append("user", username);

      const response = await fetch(`/api/conversations?userid=${user?.id}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

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

      // Reset form and close modal on success
      setTitle('');
      setFiles([]);
      setOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/conversations/data?userid=${user?.id}`);
        const result = await response.json();
        setDocuments(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [documents]);

  return (
    <div className="flex flex-col items-center w-screen">
      <div className="flex text-3xl font-semibold text-primary-foreground py-10 w-3/4">
        Your Conversations :
        {/* <Button className="ml-auto bg-green-600"><Upload className="mr-2 h-4 w-4" />New Conversation</Button> */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="ml-auto bg-green-600">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              New Conversation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Conversation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter conversation title"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="files">Files</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    id="files"
                    type="file"
                    onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                    className="flex-1"
                    multiple
                    required
                  />
                </div>
                {files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Uploading...' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* <Document file={cloudinaryUrl} onLoadSuccess={onDocumentLoadSuccess} className="text-white">
        <Page pageNumber={pageNumber} />
      </Document>
      <p className="text-white">
        Page {pageNumber} of {numPages}
      </p> */}
      {documents == null ? 
        <div className="text-lg text-white">No Conversations</div> 
        :
        <Table className="text-white text-center w-5/6 mx-auto">
          <TableCaption>A list of your recent Conversations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">S. No.</TableHead>
              <TableHead className="text-center">Conversation name</TableHead>
              <TableHead className="text-center">No. of Documents</TableHead>
              <TableHead className="text-center">Documents</TableHead>
              <TableHead className="text-right">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* <TableRow>
              <TableCell className="font-medium cursor-pointer">Conversation-1</TableCell>
              <TableCell><Button className="bg-green-600 hover:bg-green-600">Documents</Button></TableCell>
              <TableCell>10</TableCell>
              <TableCell className="text-right"><Button className="text-red-600"><Trash2/></Button></TableCell>
            </TableRow> */}
            {documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium cursor-pointer">{index + 1}</TableCell>
                <TableCell className="font-medium cursor-pointer"><Link href={`/conversations/${doc.id}`}>{doc.title!}</Link></TableCell>
                <TableCell>{doc.files.length}</TableCell>
                <TableCell>
                  <Button className="bg-green-600 hover:bg-green-600">
                    <Dialog>
                      <DialogTrigger>Documents</DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Documents</DialogTitle>
                          <DialogDescription>
                            Your Documents are shown here
                          </DialogDescription>
                          <ScrollArea className="rounded-md border p-4">
                            <Document file={cloudinaryUrl} onLoadSuccess={onDocumentLoadSuccess} className="text-white w-full">
                              <Page pageNumber={pageNumber} />
                            </Document>
                            <p className="text-white">
                              Page {pageNumber} of {numPages}
                            </p>
                          </ScrollArea>
                        </DialogHeader>
                        <div className="grid grid-cols-5">
                          {doc.files.map((file,index) => (
                            <div className="flex flex-col justify-center items-center" key={index}>
                                <Dialog>
                                  <DialogTrigger>
                                    <FileText className="h-8 w-8 text-green-500" />
                                    <div className="text-xs">{file.name}</div>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                      </DialogDescription>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                  </Dialog>
                  </Button>
                </TableCell>
                <TableCell className="text-right"><Button className="text-red-600"><Trash2/></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> 
      }
    </div>
  );
};

export default Docs;
