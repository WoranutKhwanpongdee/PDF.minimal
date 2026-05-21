"use client";

import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { FileUp, File as FileIcon, Trash2, ArrowLeft, Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function OcrScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setExtractedText("");
        setProgress(0);
      } else {
        alert("กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG) ครับ");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setExtractedText("");
    setProgress(0);
  };

  const scanImage = async () => {
    if (!file) return;

    setIsScanning(true);
    setProgress(0);
    setExtractedText("");

    try {
      const result = await Tesseract.recognize(file, "eng+tha", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      setExtractedText(result.data.text);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสแกนข้อความ:", error);
      alert("สแกนข้อความไม่สำเร็จ ลองใหม่อีกครั้งนะครับ");
    } finally {
      setIsScanning(false);
    }
  };

  const copyToClipboard = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">OCR Scanner</h1>
        <p className="text-gray-500 mb-8">Extract text from images directly in your browser. Supports English and Thai.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="flex flex-col space-y-6">
            {!file ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors relative h-[300px] flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileUp className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="font-semibold text-gray-700">Click to browse or drag & drop</p>
                <p className="text-sm text-gray-400 mt-1">Upload an image (JPG, PNG)</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-md">
                  <div className="flex items-center truncate">
                    <FileIcon className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{file.name}</span>
                  </div>
                  <button onClick={removeFile} className="text-gray-400 hover:text-red-500 ml-4 flex-shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                {previewUrl && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden h-[220px] flex items-center justify-center bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                )}

                <button
                  onClick={scanImage}
                  disabled={!file || isScanning}
                  className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Scanning... {progress}%
                    </>
                  ) : (
                    "Extract Text"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="flex flex-col h-full min-h-[400px]">
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col h-full bg-gray-50 relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Extracted Text</h2>
                {extractedText && (
                  <button 
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-black flex items-center text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                )}
              </div>
              
              <div className="flex-grow bg-white border border-gray-200 rounded-md p-4 overflow-y-auto">
                {isScanning ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-gray-300" />
                    <p>Analyzing image and extracting text...</p>
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mt-4">
                      <div className="bg-black h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                ) : extractedText ? (
                  <p className="whitespace-pre-wrap text-gray-700">{extractedText}</p>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-center">
                    <p>Your extracted text will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
