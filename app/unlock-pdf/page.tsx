"use client";

import { useState } from "react";
import { decryptPDF } from "@pdfsmaller/pdf-decrypt";
import { FileUp, File as FileIcon, Trash2, ArrowLeft, Loader2, Download, Unlock } from "lucide-react";
import Link from "next/link";

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [unlockedFile, setUnlockedFile] = useState<{ url: string; name: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setUnlockedFile(null);
      } else {
        alert("Please upload a PDF file only.");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setUnlockedFile(null);
  };

  const processPdf = async () => {
    if (!file || !password) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      const decryptedBytes = await decryptPDF(pdfBytes, password);
      
      const blob = new Blob([decryptedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setUnlockedFile({
        url,
        name: `unlocked-${file.name}`,
      });
    } catch (error: any) {
      console.error("Error unlocking PDF:", error);
      if (error.message && (error.message.includes('Incorrect password') || error.message.includes('not match'))) {
        alert("Incorrect password. Please try again.");
      } else if (error.message && error.message.includes('not encrypted')) {
        alert("This PDF is not encrypted.");
      } else {
        alert("Failed to unlock the PDF. Please check the password and try again.");
      }
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
        <h1 className="text-3xl font-bold mb-2">Unlock PDF</h1>
        <p className="text-gray-500 mb-8">Remove password security from your PDF securely on your device.</p>

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
            <p className="text-sm text-gray-400 mt-1">Upload a protected PDF file</p>
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
            
            {!unlockedFile && (
              <div className="bg-gray-50 p-6 rounded-md border border-gray-100 mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Unlock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Document password"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-colors"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter the password currently used to protect this document.
                </p>
              </div>
            )}

            {unlockedFile && (
              <div className="mt-6 p-6 border border-green-100 bg-green-50 rounded-md">
                <h3 className="text-green-800 font-semibold mb-4 text-center">PDF Unlocked Successfully!</h3>
                <a
                  href={unlockedFile.url}
                  download={unlockedFile.name}
                  className="w-full flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Unlocked PDF
                </a>
              </div>
            )}
          </div>
        )}

        {!unlockedFile && (
          <button
            onClick={processPdf}
            disabled={!file || !password || isProcessing}
            className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Unlocking...
              </>
            ) : (
              <>
                <Unlock className="w-5 h-5 mr-2" />
                Unlock PDF
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
