"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, File, ArrowLeft, Scissors } from "lucide-react";
import Link from "next/link";
import { applyPrefix, addHistory } from "@/lib/store";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // รับไฟล์แค่ไฟล์เดียว
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMsg("");
    }
  };

  // 🧠 หัวใจหลัก: ฟังก์ชันหั่นไฟล์ PDF
  const splitPDF = async () => {
    if (!file) return;
    
    // ตรวจสอบรูปแบบการพิมพ์ เช่น "1-5" หรือ "3"
    const rangePattern = /^(\d+)(-(\d+))?$/;
    const match = pageRange.match(rangePattern);

    if (!match) {
      setErrorMsg("กรุณาใส่รูปแบบที่ถูกต้อง เช่น '1-5' หรือ '3'");
      return;
    }

    setIsSplitting(true);
    setErrorMsg("");

    try {
      const startPage = parseInt(match[1]) - 1; // อาร์เรย์เริ่มที่ 0
      const endPage = match[3] ? parseInt(match[3]) - 1 : startPage;

      const fileArrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      // เช็คว่าหน้าที่ใส่มา เกินจำนวนหน้าที่มีอยู่จริงไหม
      if (startPage < 0 || endPage >= totalPages || startPage > endPage) {
        setErrorMsg(`กรุณาใส่หน้ากระดาษให้อยู่ในช่วง 1 ถึง ${totalPages}`);
        setIsSplitting(false);
        return;
      }

      // สร้างเอกสารใหม่
      const newPdf = await PDFDocument.create();
      
      // ดึงหน้าเฉพาะช่วงที่ต้องการ
      const pagesToCopy = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
      
      const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
      
      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });

      // ดาวน์โหลดไฟล์ที่หั่นเสร็จแล้ว
      const splitPdfBytes = await newPdf.save();
      const blob = new Blob([splitPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      const finalName = applyPrefix(`split-${file.name}`);
      link.download = finalName;
      link.click();
      
      URL.revokeObjectURL(url);
      addHistory("Split PDF", finalName);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแยกไฟล์:", error);
      setErrorMsg("ไม่สามารถแยกไฟล์ได้ ไฟล์อาจจะติดรหัสผ่านครับ");
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* ส่วนหัว */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Split PDF Files</h1>
        <p className="text-gray-500 mb-8">Extract specific pages from your PDF document easily.</p>

        {/* กล่องอัปโหลดไฟล์ */}
        {!file ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors relative mb-8">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileUp className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <p className="font-semibold text-gray-700">Select a PDF file</p>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <File className="w-6 h-6 text-gray-400 mr-3" />
              <span className="font-medium">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-sm text-gray-400 hover:text-black underline">
              Change file
            </button>
          </div>
        )}

        {/* ส่วนให้กรอกเลขหน้า */}
        {file && (
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">Pages to extract (e.g., 1-5 or 3)</label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g., 1-5"
              className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-black transition-colors"
            />
            {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
          </div>
        )}

        {/* ปุ่มกดยืนยันการหั่นไฟล์ */}
        <button
          onClick={splitPDF}
          disabled={!file || !pageRange || isSplitting}
          className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSplitting ? "Processing..." : (
            <>
              <Scissors className="w-4 h-4 mr-2" />
              Split PDF
            </>
          )}
        </button>

      </div>
    </div>
  );
}
