"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { getHistory, removeHistoryItem, HistoryItem } from "@/lib/store";
import { FileText, Trash2, Clock, FolderOpen } from "lucide-react";

export default function FilesPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    removeHistoryItem(id);
    setHistory(getHistory());
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-10rem] h-[40rem] w-[40rem] rounded-full bg-zinc-900/5 blur-3xl" />
        <div className="absolute right-[-15rem] top-[10rem] h-[45rem] w-[45rem] rounded-full bg-zinc-700/5 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[20rem] h-[40rem] w-[40rem] rounded-full bg-zinc-500/5 blur-3xl" />
      </div>

      <Sidebar />

      <main className="relative z-10 ml-[260px] min-h-screen px-5 py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-5xl">
          <header className="mb-7 flex flex-col items-start gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-600 shadow-sm backdrop-blur-md">
              <FolderOpen className="h-3 w-3" />
              Activity Log
            </div>

            <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
                  My Files
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                  History log of your recently processed documents.
                </p>
              </div>
            </div>
          </header>

          <div className="rounded-[20px] border border-zinc-200/60 bg-white/80 overflow-hidden shadow-sm backdrop-blur-xl">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-zinc-100/80 text-zinc-400 ring-1 ring-zinc-200/50">
                  <Clock className="w-7 h-7" />
                </div>
                <p className="text-base font-semibold text-zinc-900">No recent activity</p>
                <p className="mt-1.5 text-[13px] text-zinc-500 max-w-sm">Processed files and your history log will appear here automatically.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200/60 bg-zinc-50/50 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                      <th className="px-5 py-3.5">Action</th>
                      <th className="px-5 py-3.5">Filename</th>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5 w-[80px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors group">
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60">
                            {item.action}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-zinc-900 text-sm flex items-center">
                          <div className="mr-2.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-100/80 text-zinc-500">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate max-w-[280px]">{item.filename}</span>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-zinc-500">
                          {item.date}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-red-50 rounded-lg"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
