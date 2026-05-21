"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, File as FileIcon, Trash2, ArrowLeft, Loader2, Download } from "lucide-react";
import Link from "next/link";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<{ url: string, name: string, originalSize: number, newSize: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setCompressedFile(null);
      } else {
        alert("กรุณาอัปโหลดไฟล์ PDF เท่านั้นครับ");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setCompressedFile(null);
  };

  const compressPdf = async () => {
    if (!file) return;

    setIsCompressing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      // Save the PDF with useObjectStreams to true (compresses structural objects)
      // This provides a basic level of compression for some PDFs.
      // Note: Deep image compression requires heavy WASM libraries, so we use structural compression here.
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setCompressedFile({
        url,
        name: `compressed-${file.name}`,
        originalSize: file.size,
        newSize: blob.size,
      });

    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบีบอัดไฟล์:", error);
      alert("บีบอัดไฟล์ไม่สำเร็จ ลองใหม่อีกครั้งนะครับ");
    } finally {
      setIsCompressing(false);
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
        
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Compress PDF</h1>
        <p className="text-gray-500 mb-8">Reduce your PDF file size. Processing is done securely on your device.</p>

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
            <p className="text-sm text-gray-400 mt-1">Upload a PDF file to compress</p>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Selected File</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-md">
              <div className="flex items-center">
                <FileIcon className="w-6 h-6 text-red-500 mr-3" />
                <div>
                  <span className="text-sm font-medium block">{file.name}</span>
                  <span className="text-xs text-gray-500">{formatSize(file.size)}</span>
                </div>
              </div>
              <button onClick={removeFile} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            {compressedFile && (
              <div className="mt-6 p-6 border border-green-100 bg-green-50 rounded-md">
                <h3 className="text-green-800 font-semibold mb-2">Compression Complete!</h3>
                <div className="flex justify-between items-center mb-4 text-sm text-green-700">
                  <div>
                    <span className="block opacity-75">Original Size</span>
                    <span className="font-medium">{formatSize(compressedFile.originalSize)}</span>
                  </div>
                  <div>
                    <ArrowLeft className="w-4 h-4 rotate-180 opacity-50 mx-auto" />
                  </div>
                  <div className="text-right">
                    <span className="block opacity-75">New Size</span>
                    <span className="font-medium">{formatSize(compressedFile.newSize)}</span>
                  </div>
                </div>
                <a
                  href={compressedFile.url}
                  download={compressedFile.name}
                  className="w-full flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Compressed PDF
                </a>
              </div>
            )}
          </div>
        )}

        {!compressedFile && (
          <button
            onClick={compressPdf}
            disabled={!file || isCompressing}
            className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isCompressing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Compressing...
              </>
            ) : (
              "Compress PDF"
            )}
          </button>
        )}

      </div>
    </div>
  );
}
