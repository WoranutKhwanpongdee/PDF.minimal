"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, Image as ImageIcon, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type === "image/jpeg" || file.type === "image/png"
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const convertToPDF = async () => {
    if (files.length === 0) {
      alert("กรุณาอัปโหลดอย่างน้อย 1 รูปภาพครับ");
      return;
    }

    setIsConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        
        let image;
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === "image/png") {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue; // ข้ามไฟล์ที่ไม่รองรับ
        }

        const { width, height } = image.scale(1);
        const page = pdfDoc.addPage([width, height]);
        
        page.drawImage(image, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = "images-converted.pdf";
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแปลงไฟล์:", error);
      alert("แปลงไฟล์ไม่สำเร็จ ลองใหม่อีกครั้งนะครับ");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Image to PDF</h1>
        <p className="text-gray-500 mb-8">Convert JPG and PNG images into a single PDF document instantly.</p>

        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors relative mb-8">
          <input
            type="file"
            multiple
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FileUp className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <p className="font-semibold text-gray-700">Click to browse or drag & drop</p>
          <p className="text-sm text-gray-400 mt-1">Supported formats: JPG, PNG</p>
        </div>

        {files.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Selected Images</h2>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-md">
                  <div className="flex items-center">
                    <ImageIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium truncate max-w-md">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={convertToPDF}
          disabled={files.length === 0 || isConverting}
          className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isConverting ? "Converting..." : "Convert to PDF"}
        </button>

      </div>
    </div>
  );
}
