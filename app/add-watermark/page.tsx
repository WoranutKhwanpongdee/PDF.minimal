"use client";

import { useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { FileUp, File as FileIcon, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        alert("กรุณาอัปโหลดไฟล์ PDF เท่านั้นครับ");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const processWatermark = async () => {
    if (!file) {
      alert("กรุณาอัปโหลดไฟล์ PDF ครับ");
      return;
    }
    if (!watermarkText.trim()) {
      alert("กรุณาใส่ข้อความลายน้ำครับ");
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, 60);
        const textHeight = helveticaFont.heightAtSize(60);

        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: 60,
          font: helveticaFont,
          color: rgb(0.75, 0.75, 0.75), // Light gray
          opacity: 0.5,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `watermarked-${file.name}`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการใส่ลายน้ำ:", error);
      alert("ใส่ลายน้ำไม่สำเร็จ ลองใหม่อีกครั้งนะครับ");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Add Watermark to PDF</h1>
        <p className="text-gray-500 mb-8">Stamp text on your PDF document to protect it or mark its status.</p>

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
            <p className="text-sm text-gray-400 mt-1">Upload a PDF file to add watermark</p>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Selected File</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-md">
              <div className="flex items-center">
                <FileIcon className="w-6 h-6 text-red-500 mr-3" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <button onClick={removeFile} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-6">
              <label htmlFor="watermark-text" className="block text-sm font-medium text-gray-700 mb-2">
                Watermark Text
              </label>
              <input
                id="watermark-text"
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
              />
            </div>
          </div>
        )}

        <button
          onClick={processWatermark}
          disabled={!file || !watermarkText.trim() || isProcessing}
          className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? "Adding Watermark..." : "Add Watermark"}
        </button>

      </div>
    </div>
  );
}
