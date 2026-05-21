"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { getSettings, saveSettings, Settings as SettingsType, clearHistory } from "@/lib/store";
import { Trash2, ShieldCheck, FileType, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType>({ defaultPrefix: "" });
  const [isClient, setIsClient] = useState(false);
  const [isPrivacyMode] = useState(true); // Always true as requested
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
    setSettings(getSettings());
  }, []);

  const handleSaveSettings = () => {
    saveSettings(settings);
    setSaveMessage("Settings saved successfully.");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      clearHistory();
      alert("History cleared successfully.");
    }
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

      <main className="relative z-10 min-h-screen px-4 py-5 md:ml-[260px] md:px-5 md:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 flex flex-col items-start gap-3 sm:mb-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-600 shadow-sm backdrop-blur-md">
              <SettingsIcon className="h-3 w-3" />
              Application Preferences
            </div>

            <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-[1.75rem] font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
                  Settings
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                  Manage your application preferences and history.
                </p>
              </div>
            </div>
          </header>

          <div className="max-w-3xl space-y-5">
            
            {/* File Preferences */}
            <section className="rounded-[20px] border border-zinc-200/60 bg-white/80 p-5 sm:p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-[15px] font-semibold text-zinc-900 flex items-center mb-5">
                <div className="mr-2.5 flex h-9 w-9 items-center justify-center rounded-[10px] bg-zinc-100/80 text-zinc-600 ring-1 ring-zinc-200/50">
                  <FileType className="w-4 h-4" />
                </div>
                File Preferences
              </h2>
              <div className="pl-[46px]">
                <div className="mb-4">
                  <label htmlFor="prefix" className="block text-[13px] font-medium text-zinc-900 mb-1.5">
                    Default Filename Prefix
                  </label>
                  <p className="text-[13px] text-zinc-500 mb-3.5">
                    This text will be prepended to all output files. (e.g., "minimal_")
                  </p>
                  <div className="flex max-w-sm">
                    <input
                      type="text"
                      id="prefix"
                      value={settings.defaultPrefix}
                      onChange={(e) => setSettings({ ...settings, defaultPrefix: e.target.value })}
                      placeholder="e.g. minimal_"
                      className="flex-1 block w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg shadow-sm text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-5">
                  <button
                    onClick={handleSaveSettings}
                    className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-zinc-800 transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    Save Preferences
                  </button>
                  {saveMessage && (
                    <span className="ml-3 text-[13px] text-emerald-600 font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                      {saveMessage}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Privacy & Security */}
            <section className="rounded-[20px] border border-zinc-200/60 bg-white/80 p-5 sm:p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-[15px] font-semibold text-zinc-900 flex items-center mb-5">
                <div className="mr-2.5 flex h-9 w-9 items-center justify-center rounded-[10px] bg-zinc-100/80 text-zinc-600 ring-1 ring-zinc-200/50">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                Privacy & Security
              </h2>
              <div className="pl-[46px] space-y-7">
                
                {/* Privacy Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[13px] font-medium text-zinc-900">Local Processing Only</h3>
                    <p className="text-[13px] text-zinc-500 mt-1 max-w-sm leading-relaxed">
                      All file processing is done entirely on your device. Your files are never uploaded to any server.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      type="button"
                      className={`relative inline-flex flex-shrink-0 h-6 w-10 border-[1.5px] border-transparent rounded-full cursor-not-allowed transition-colors ease-in-out duration-200 focus:outline-none ${isPrivacyMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                      disabled
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform ring-0 transition ease-in-out duration-200 ${isPrivacyMode ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-zinc-200/60 pt-6">
                  <h3 className="text-[13px] font-medium text-zinc-900 mb-1">Clear Activity History</h3>
                  <p className="text-[13px] text-zinc-500 mb-3 max-w-sm leading-relaxed">
                    Remove all logs from the My Files page. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleClearHistory}
                    className="inline-flex items-center px-3.5 py-2 border border-red-200/60 text-[13px] font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Clear History
                  </button>
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
