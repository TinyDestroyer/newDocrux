"use client"
import React from "react";
import { useState } from "react";
import { Document, Page } from 'react-pdf';
import ProductForm from "../../../components/ProductForm";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {};

const page = (props: Props) => {
  const cloudinaryUrl = "https://res.cloudinary.com/docrux/raw/upload/v1737292407/vnyexwbfnotxxfzdkm40";
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center w-screen">
      <div className="text-3xl font-semibold text-primary-foreground py-10 w-3/4">
        Your Documents
      </div>
      <div className="text-lg text-white">No documents</div>
      <Document file={cloudinaryUrl} onLoadSuccess={onDocumentLoadSuccess} className="text-white">
        <Page pageNumber={pageNumber} />
      </Document>
      <p className="text-white">
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

export default page;
