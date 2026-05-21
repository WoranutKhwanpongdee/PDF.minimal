"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, File, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { applyPrefix, addHistory } from "@/lib/store";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  // ฟังก์ชันรับไฟล์เมื่อผู้ใช้อัปโหลด
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  // ฟังก์ชันลบไฟล์ที่ไม่อยากรวมออก
  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  // 🧠 หัวใจหลัก: ฟังก์ชันรวมไฟล์ PDF
  const mergePDFs = async () => {
    if (files.length < 2) {
      alert("กรุณาอัปโหลดอย่างน้อย 2 ไฟล์เพื่อทำการรวมครับ");
      return;
    }

    setIsMerging(true);
    try {
      // 1. สร้างเอกสาร PDF เปล่าๆ ขึ้นมาใหม่
      const mergedPdf = await PDFDocument.create();

      // 2. วนลูปอ่านไฟล์ที่ผู้ใช้อัปโหลดทีละไฟล์
      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        // 3. เอาหน้ากระดาษมาต่อกันในไฟล์ใหม่
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      // 4. บันทึกและสร้างลิงก์ดาวน์โหลด
      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      const finalName = applyPrefix("merged-document.pdf");
      link.download = finalName;
      link.click();
      
      URL.revokeObjectURL(url);
      addHistory("Merge PDF", finalName);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการรวมไฟล์:", error);
      alert("รวมไฟล์ไม่สำเร็จ ลองใหม่อีกครั้งนะครับ");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* ส่วนหัว */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Merge PDF Files</h1>
        <p className="text-gray-500 mb-8">Combine multiple PDFs into a single document instantly.</p>

        {/* กล่องอัปโหลดไฟล์ (Dropzone) */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors relative mb-8">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FileUp className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <p className="font-semibold text-gray-700">Click to browse or drag & drop</p>
          <p className="text-sm text-gray-400 mt-1">Only PDF files are supported</p>
        </div>

        {/* รายการไฟล์ที่เลือกไว้ */}
        {files.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Selected Files</h2>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-md">
                  <div className="flex items-center">
                    <File className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ปุ่มกดยืนยันการรวมไฟล์ */}
        <button
          onClick={mergePDFs}
          disabled={files.length < 2 || isMerging}
          className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isMerging ? "Merging..." : "Merge Files"}
        </button>

      </div>
    </div>
  );
}
