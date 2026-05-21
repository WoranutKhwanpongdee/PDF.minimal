"use client";

import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { FileUp, File as FileIcon, Trash2, ArrowLeft, Loader2, Download, FileText } from "lucide-react";
import Link from "next/link";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wordFile, setWordFile] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setWordFile(null);
        setProgress(0);
      } else {
        alert("Please upload a PDF file only.");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setWordFile(null);
    setProgress(0);
  };

  const processPdfToWord = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = "";

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY = -1;
        let pageText = "";
        
        for (const item of textContent.items) {
          if ('str' in item) {
            if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
              pageText += "\n";
            }
            pageText += item.str;
            lastY = item.transform[5];
          }
        }
        
        fullText += pageText + "\n\n";
        setProgress(20 + Math.round((i / numPages) * 50));
      }

      setProgress(80);
      
      // Create Word Document
      const paragraphs = fullText.split('\n').map(line => 
        new Paragraph({
          children: [new TextRun(line)],
        })
      );

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      setProgress(100);
      
      const url = URL.createObjectURL(blob);
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      
      setWordFile({
        url,
        name: `${originalName}.docx`,
      });

    } catch (error) {
      console.error("Error converting PDF to Word:", error);
      alert("Failed to convert PDF to Word. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">PDF to Word</h1>
        <p className="text-gray-500 mb-8">Extract text from your PDF into an editable Word document. Processed securely on your device.</p>

        {!file ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors relative mb-8">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileUp className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <p className="font-semibold text-gray-700">Click to browse or drag & drop</p>
            <p className="text-sm text-gray-400 mt-1">Upload a PDF file to convert</p>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Selected File</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-md mb-6">
              <div className="flex items-center">
                <FileIcon className="w-6 h-6 text-red-500 mr-3" />
                <div>
                  <span className="text-sm font-medium block">{file.name}</span>
                  <span className="text-xs text-gray-500">{formatSize(file.size)}</span>
                </div>
              </div>
              <button onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            {isProcessing && !wordFile && (
              <div className="bg-gray-50 p-6 rounded-md border border-gray-100 mb-8 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-gray-300" />
                <p>Converting PDF to Word...</p>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mt-4">
                  <div className="bg-black h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {wordFile && (
              <div className="mt-6 p-6 border border-green-100 bg-green-50 rounded-md">
                <h3 className="text-green-800 font-semibold mb-4 text-center">Conversion Complete!</h3>
                <a
                  href={wordFile.url}
                  download={wordFile.name}
                  className="w-full flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Word Document
                </a>
                <p className="text-center text-xs text-green-700 mt-3">
                  Note: This minimal conversion extracts text and basic formatting. Complex layouts or images are not supported.
                </p>
              </div>
            )}
          </div>
        )}

        {!wordFile && !isProcessing && (
          <button
            onClick={processPdfToWord}
            disabled={!file}
            className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            Convert to Word
          </button>
        )}
      </div>
    </div>
  );
}
